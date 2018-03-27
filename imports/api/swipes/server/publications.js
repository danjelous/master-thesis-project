import { Meteor } from 'meteor/meteor';
import { SwipeEvents } from '../swipeEvents.js';

Meteor.publish('swipe-events', () => {
   return SwipeEvents.find();
});