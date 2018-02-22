import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

// code to run on server at startup
Meteor.startup(() => {
  clearAllCollections();
});

Meteor.methods({
  'getUserId'() {
    return { 'id': Random.hexString(10) };
  }
});

Meteor.methods({
  'clearAllCollections': () => {
    clearAllCollections();
  }
})