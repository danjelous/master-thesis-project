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

Meteor.publish('press-events', () => {
   return Events.find({ type: 'press' });
});

Meteor.publish('pan-events', () => {
   return Events.find({ $or: [{ type: 'panleft' }, { type: 'panright' }] });
});
