import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { AsyncService } from './async.service';

import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SubscriptionService {

  noticePeriod: number = 258489860;
  noticeMonitor: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  subscriptions = {
    "BETA": { volume : 4, duration: 2882880000 },
    "INDIVIDUAL":  { volume: 1, duration: 31708089860 },
    "COUPLE": { volume : 2, duration: 31708089860 },
    "FAMILY": { volume : 4, duration: 31449600000 }
  };

  loggedInUser: string;
  userSubscription: { type, start };

  constructor(private userService: UserService, private asyncService: AsyncService) {

    this.asyncService.onLogin(true)
    .switchMap((login) => { 
      this.loggedInUser = login.user;
      return this.userService.Ref(`users/${login.user}/subscription`)
    }).subscribe((sub) => {
      this.userSubscription = sub

      console.log("User subcription: " + JSON.stringify(sub));

      if(sub && sub.type) {
        let notice = this.onNoticePeriod(sub);
        notice.notice ? this.noticeMonitor.next(notice): () => {};
      }   
      
    });
  }

  // Provide access to seat limit
  get SeatLimit() {

    if(!this.userSubscription) return 0;
    if(!this.userSubscription.type) return 0;

    console.log(`Sub type: ${this.userSubscription.type}, Volume: ${this.subscriptions[this.userSubscription.type].volume}`);

    return this.subscriptions[this.userSubscription.type].volume;
  }

  // Adding and removing subscriptions for user by timestamp
  VerifySubscription(): boolean {
    if(this.userSubscription) return false;
    if(this.userSubscription.type === null) return false;

    let uS = this.userSubscription;
    let subscriptionEnd = uS.start + this.subscriptions[uS.type].duration;

    let hasExpired = this.HasExpired(this.userSubscription);

    if(hasExpired) {
      this.HandleSubscription({
        'type': null,
        'start': 0
      });
    } 

    return hasExpired;
  }

  // Handle updating user subscription after a purchase
  HandleSubscription(purchase:{ type, start }) {
    this.userService.Ref(`users/${this.loggedInUser}/subscription`).Update(purchase);
  }

  private HasExpired(subscription): boolean {
    let uS = subscription;
    let subscriptionEnd = uS.start + this.subscriptions[uS.type].duration;
    return Date.now() > subscriptionEnd;
  }

  private onNoticePeriod(subscription): {notice: boolean, daysLeft: number,  expiredDays: number}{
    let uS = subscription;
    let dayMulti = 1000 * 60 * 60 * 24;


    let subscriptionEnd = uS.start + this.subscriptions[uS.type].duration;
    let expiredOn: number = subscriptionEnd - this.noticePeriod;

    let expiredDays = Math.round((Date.now() - subscriptionEnd) / dayMulti);
    let daysLeft = subscriptionEnd - uS.start;

    let notice: boolean = Date.now() > expiredOn;

    return {notice, daysLeft, expiredDays};
  }
}
