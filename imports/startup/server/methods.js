import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import { ClickEvents } from '../../api/clicks/clickEvents.js';
import { SwipeEvents } from '../../api/swipes/swipeEvents.js';

Meteor.methods({
   'getUserId'() {
      return { 'id': Random.hexString(10) };
   },
   'clearCollections'() {
      ClickEvents.remove({});
      SwipeEvents.remove({});
   }
});