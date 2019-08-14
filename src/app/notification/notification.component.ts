import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActionsService } from '../actions.service';
import { AsyncService } from '../async.service';
import { UserService } from '../user.service';
import { SubscriptionService } from '../subscription.service';

import { Observable } from 'rxjs/observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css', '../main.css']
})
export class NotificationComponent implements OnInit {
  
  notice: string = ``;
  duration: number = 5000; // 1 second 
  type: string = '';

  styles = {
    'notification-area': true,
    'notification-action': this.type === 'ACTION',
    'notification-notice': this.type === 'NOTICE',
    'notification-warning': this.type === 'WARNING',
    'maximised': this.notice.length > 0,
    'minimised': this.notice.length === 0
  }

  actions = [
    {
      display: (seat) => `Selected seat ${this.SeatIdPure(seat)}`,
      type: 'ACTION',
      duration: 5000,
      trigger: this.actionsService.selectedSeatMonitor.filter(val => val?true:false)
    },
    {
      display: (swap:{mySeat, swapSeat}) => `Confirmed swap of ${this.SeatIdPure(swap.mySeat)} for ${this.SeatIdPure(swap.swapSeat)}`,
      type: 'ACTION',
      duration: 5000,
      trigger: this.actionsService.confirmedSeatMonitor.filter(val => val?true:false)
    },
    {
      display: (login) => `${login.nickname} you are now logged in!`,
      type: 'NOTICE',
      duration: 5000,
      trigger: this.asyncService.onLogin(true)
    },
    {
      display: (logout) => `You are now logged out`,
      type: 'NOTICE',
      duration: 5000,
      trigger: this.userService.ListenForLogout().filter((logout) => logout)
    },
    {
      display: (swap:{mySeat, swapSeat}) => `Applied to swap your seat ${this.SeatIdPure(swap.mySeat)} with seat ${this.SeatIdPure(swap.swapSeat)}`,
      type: 'ACTION',
      duration: 9000,
      trigger: this.actionsService.swapSeatMonitor.filter(val => val?true:false)
    },
    {
      display: (err: {msg}) => `Oops, ${err.msg}`,
      type: 'WARNING',
      duration: 5000,
      trigger: this.actionsService.warningMonitor.filter(val => val?true:false)
    },
    {
      display: (n: {notice, daysLeft, expiredDays}) => `Your subscription has expired ${n.expiredDays} ago!`,
      type: 'WARNING',
      duration: 9000,
      trigger: this.subscription.noticeMonitor.filter(n => n !== undefined && n.notice?true:false)
    }
  ];

  subscriptions = [];

  constructor(
    private actionsService: ActionsService, 
    private asyncService: AsyncService,
    private subscription: SubscriptionService,
    private userService: UserService) { }

  ngOnInit() {
    for(let action of this.actions) {
      this.Register(action);
    }
  }

  ngOnDestroy() {
    this.Deregister();
  }

  private Register(action: {display, type, duration, trigger}) {
    let trigger = action.trigger;
    let triggerDelay = action.trigger.delay(action.duration);
    
    trigger.subscribe((value) => {
      this.notice = action.display(value);
      this.type = action.type;
      this.UpdateStyles();
    });

    triggerDelay.subscribe((value) => {
      this.notice=``;
      this.UpdateStyles();
    });

    this.subscriptions.push([trigger, triggerDelay]);
  }

  private Deregister() {
    // for(let sub of this.subscriptions) {
    //   sub.unsubscribe();
    // }
  }

  private UpdateStyles() {
    this.styles = this.GetStyles();
  }

  private GetStyles() {
    return {
      'notification-area': true,
      'notification-action': this.type === 'ACTION',
      'notification-notice': this.type === 'NOTICE',
      'notification-warning': this.type === 'WARNING',
      'maximised': this.notice.length > 0,
      'minimised': this.notice.length === 0
    };
  }

  private SeatIdPure(seat): string {
    return seat.seatId.split('~')[0];
  }
}
