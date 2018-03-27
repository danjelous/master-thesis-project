import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

Meteor.methods({
   'getUserId'() {
      return { 'id': Random.hexString(10) };
   }
});