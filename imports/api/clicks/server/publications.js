import { Meteor } from 'meteor/meteor';
import { ClickEvents } from '../clickEvents.js';

Meteor.publish('click-events', () => {
   return ClickEvents.find();
});