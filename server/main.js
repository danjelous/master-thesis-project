import { Meteor } from 'meteor/meteor';

// code to run on server at startup
Meteor.startup(() => {
  clearAllCollections();
});

Meteor.methods({
  'getUserID'() {

    let A = {
      'id': 'A',
      'isAvailable': true
    }

    let B = {
      'id': 'B',
      'isAvailable': true
    }

    if (A.isAvailable) {
      A.isAvailable = false;
      return A;
    } else if (B.isAvailable) {
      B.isAvailable = false;
      return B;
    } else {
      return { 'id': 'X' };
    }

  }
});

Meteor.methods({
  'clearAllCollections': () => {
    clearAllCollections();
  }
})