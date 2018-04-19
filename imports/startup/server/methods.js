import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import { Events } from '../../api/events/events.js';

Meteor.methods({
  'getUserId' () {
    return { 'id': Random.hexString(10) };
  },
  'clear-all-events' () {
    console.log('Cleared all events');
    Events.remove({});
  },
  'clear-click-events' () {
    console.log('Cleared click events');
    Events.remove({ type: 'click' });
  },
  'clear-tap-events' () {
    console.log('Cleared tap events');
    Events.remove({ type: 'tap' });
  },
  'clear-press-events' () {
    console.log('Cleared press events');
    Events.remove({ type: 'press' });
  },
});
