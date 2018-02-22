import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import './main.html';
import './util/initUser';

Meteor.startup(() => {

  // Initial value
  let userId = getLocalStorageVar('userId');

  // Get a new id if there is none
  if (userId == null) {

    Meteor.call('getUserId', (err, res) => {
      if (err) {
        console.log(`Error: ${err} `);
      } else {
        // Store the new userId in the LS if the client gets refreshed, loses
        // connection etc, use session for the rest of the app
        setLocalStorageVar('userId', res.id);
        userId = res.id;
        console.log(`set user id to ${res.id}`);
      }
    });
  }
  Session.set('userId', userId);

  Meteor.call('clearAllCollections');
  Meteor.subscribe('click-events');
});

Template.root.events({
  'click': (event) => {
    event.preventDefault();

    ClickEvents.insert({
      'origin': Session.get('userId'),
      'event': {
        'pageX': event.pageX,
        'pageY': event.pageY,
        'type': event.type
      }
    });
  }
});

Template.root.helpers({
  clickEvents: () => {
    return ClickEvents.find({});
  },
  userId: () => {
    return Session.get('userId');
  }
});