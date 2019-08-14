import { Injectable } from '@angular/core';
import { DbObject } from './db-object';

import { BehaviorSubject, Observable } from 'rxjs';

import * as io from 'socket.io-client';

@Injectable()
export class UserService {
  
  //Hardwired - require login implementation
  private _socketLoaded: boolean = false;
  private _loggedInUser: string = 'user1';
  private _loginMonitor: BehaviorSubject<any>;
  private _logoutMonitor: BehaviorSubject<any>;
  private _socketMonitor: BehaviorSubject<boolean>;
 
  private socket: io.Socket;

  private userDb = {}

  private userDbSubjects = {};

  constructor() { 
    this._loginMonitor = new BehaviorSubject<any>({'user': undefined});
    this._logoutMonitor = new BehaviorSubject<any>(false);
    this._socketMonitor = new BehaviorSubject<boolean>(this._socketLoaded);
    this.socket = io();
    
    this.socket.on('db', (data)=>{
      console.log("SOCKET DATA: " + JSON.stringify(data));
      this.userDb = data;

      // This is the problem !
      this._socketLoaded = true;
      this._socketMonitor.next(this._socketLoaded);
    });

    this.socket.on('clientUpdate', (dbData: any)=>{
        console.log("Recieved update from server");
        if(this._socketLoaded) this.UpdateDbFromSocket(dbData.path, this.userDb, dbData.data);
    });

    
  }

  private UserTemplate() {
    return {
        'seats': [],
        'subscription': {
          'type': 'BETA',
          'start': 1502094567158
        },
        'penalties': []
      };
  }

  private FlightTemplate() {
    return {
      'seats': [],
      'baskets': []
    }
  }

  private SeatTemplate() {
    return {
      'seatId': 'NONE~VERSION',
      'position': 'POSITION',
      'swapPrefs': {
        'rows': undefined,
        'position': undefined,
        'basketId': undefined
      },
      'requests': {
        'out': [], //'12C' '14K' etc
        'in': []
      },
      'swapComplete': undefined //Seat Id
    };
  }

  /* Login helper */
  Login(userId: string, nickname?:string) {
    console.log("Logging in: " + userId);

    this.UserSetup(userId);

    this._loggedInUser = userId;
    this._loginMonitor.next({'user': this._loggedInUser, 'nickname': nickname || 'None'});
  }

  UserSetup(userId: string) {
    let url = `users/${userId}`;

    if(userId === undefined) return;

    try {
      this.Ref(url);
    } catch (e) {
      //console.log("Generating new user");
      this.New('USER', userId, 'users');
    }
  }

  Logout() {
    console.log("Logging out");
    this._loggedInUser = undefined;
    this._loginMonitor.next({'user': this._loggedInUser});
    this._logoutMonitor.next(true);
  }

  ListenForLogin() {
    return this._loginMonitor;
  }

  ListenForLogout() {
    return this._logoutMonitor;
  }

  ListenForSocketLoaded() {
    return this._socketMonitor;
  }

  SocketUpdate(data: any, path: string[]) {
    this.socket.emit('dbUpdate', { 'data': data, 'path': path});
    this._socketMonitor.next(this._socketLoaded);
  }

  /* DB Access */

  Ref(url: string): DbObject<any> {
    let subject: DbObject<any> = this.userDbSubjects[url];

    if(!subject) {
      let route = url.trim().split('/');

      // A useful debugging strategy !
      // if(route.find(path => path === "undefined")) throw "undefined path!";

      if(this._socketLoaded) {     
        //console.log("Searching for route: " + JSON.stringify(route));
        let routeValue = this.GetValueFromRoute(route.slice(), this.userDb);
        // console.log("Value recieved: " + JSON.stringify(routeValue));


        subject = new DbObject(routeValue, route.slice(), this);
        this.userDbSubjects[url] = subject;
      } else {
        // AWAITING STATE
        subject = new DbObject({'socketLoading': true}, route.slice(), this);
      }
      
    }

    return subject;
  }

  // TO FIX
  New(template: string, data: any, url: string, actions?:any[]) {

    let route: string[] = url.trim().split('/');
    let acts: any[] = actions || [];

    let action = () => {};

    switch(template) {
      case 'SEAT':

        acts.push({
          id: 'AddSeat',
          func: () => {
            let seatsObj = this.Ref(url);
            seatsObj.Push(data);  

            this.Ref("stats/seats").IncrementStat();
          }
         }
        );

        let parentRoute = route.slice(0,-2);
        let failArgs = ['FLIGHT', route[route.length-2], parentRoute.join('/'), acts];

        this.MapActions(acts, this.New, [
            this, failArgs
          ]
        );       
        break;
      case 'FLIGHT':
        acts.push({
          id: 'Add Flight',
          func: () => {

            let datesObj = this.Ref(url);
            datesObj.Add(data, this.FlightTemplate());

            this.Ref("stats/flights").IncrementStat();
          } 
        });

        parentRoute = route.slice(0,-1);
        failArgs = ['DATE', route[route.length-1], parentRoute.join('/'), acts];

        this.MapActions(acts, this.New, [
            this, failArgs
          ]
        );
        
        break;
      case 'DATE':
        acts.push({
          id: "Add date",
          func: () => {

            let flightsObj = this.Ref(url);
            flightsObj.Add(data);
          }
        });

        this.MapActions(acts, ()=>{console.log("Db setup error!")}, [
            this, undefined
          ]
        );
        break;
      case 'USER':
        console.log("new called for user");
        
        acts.push({
          id: "Adding user",
          func: () => {
            console.log(`Creating ${data} at url ${url}`);

            let userRefObj = this.Ref(url);
            userRefObj.Add(data, this.UserTemplate());
            
            this.Ref("stats/users").IncrementStat();
          }
        });

        this.MapActions(acts, ()=>{console.log("Db setup error!")}, [this, undefined]);

        break;
      case 'SEAT-REF':
        acts.push({
          id: "Add seat ref",
          func: () => {
            let seatRefsObj = this.Ref(url);
            seatRefsObj.Push(data);
          }
        });

        // users/userId/seats -> users , data = userId
        parentRoute = route.slice(0,-2);
        failArgs = ['USER', route[route.length-2], parentRoute.join('/'), acts];

        this.MapActions(acts, this.New, [this, failArgs]);

        break;
    }
  }

  private MapActions(acts: any[], onFail: any, context) {
    console.log("Actions length: " + acts.length);

    let temp;

    try {
      while(acts.length > 0) {
        temp = acts.pop();
        temp.func.apply(context[0], undefined);
      }
    } catch (e) {
      console.log(e);

      acts.push(temp);
      onFail.apply(...context);
    }
  }

  dbValueFromRoute(route) {
    // console.log("Searching for route: " + JSON.stringify(route));
    return this.GetValueFromRoute(route, this.userDb);
  }

  private GetValueFromRoute(route, passVal) {
    if(route.length < 1) return passVal;

    console.log("Route: " + route);

    let path: string = route.shift();
    
    let deepVal = passVal[path];

    if((deepVal !== 0) && !deepVal) throw {msg: 'Error access value at path', accessing: JSON.stringify(passVal), 'path': path};

    return this.GetValueFromRoute(route, deepVal);
 }

 private UpdateDbFromSocket(route, passVal, setVal) {
  // 1. Get the subject related to this data
  // If the subject exists then update it

  // Else directly update the database

  this._socketMonitor.next(this._socketLoaded);

  let subject: DbObject<any> = this.userDbSubjects[route.join('/')];

  //console.log("Url to assign: " + route.join('/'));

  this.DirectDbUpdateFromSocket(route, passVal, setVal);
  
  if(subject) subject.QuietUpdate(setVal);
  
 }

 private DirectDbUpdateFromSocket(route, passVal, setVal) {
    var subPath = null;

    console.log("Direct update: " + JSON.stringify(setVal));

    if(route.length <= 1) {
        var subPath = route.shift();
        passVal[subPath] = setVal;

        return;
    };
    
    var subPath = route.shift();
    var deepVal = passVal[subPath]; 
  
    this.UpdateDbFromSocket(route, deepVal, setVal);
 }
}