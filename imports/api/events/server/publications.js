import { Meteor } from 'meteor/meteor';
import { Events } from '../events.js';

Meteor.publish('all-events', () => {
   return Events.find();
});

Meteor.publish('swipe-events', () => {
   return Events.find({ $or: [{ type: 'swipeleft' }, { type: 'swiperight' }] });
});

Meteor.publish('click-events', () => {
   return Events.find({ $or: [{ type: 'click' }, { type: 'tap' }] });
});
