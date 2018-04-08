import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import { Events } from '../../api/events/events.js';

Meteor.methods({
   'getUserId'() {
      return { 'id': Random.hexString(10) };
   },
   'clearCollections'() {
      Events.remove({});
   }
});
