import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

// Initial value from localstorage
let userId = window.localStorage.getItem('userId');

// Get a new id if there is none
if (userId == null) {

  Meteor.call('getUserId', (err, res) => {
    if (err) {
      console.log(`Error: ${err} `);
    } else {
      // Store the new userId in the LS if the client gets refreshed, loses
      // connection etc, use session for the rest of the app
      window.localStorage.setItem('userId', res.id);
      userId = res.id;
      console.log(`set user id to ${res.id}`);
    }
  });
}

Session.set('userId', userId);

// TODO: Move to /ui --> app
Meteor.subscribe('click-events');