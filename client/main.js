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
  Meteor.subscribe('click-events');
});

Template.root.events({
  'click, touchstart': (event) => {
    event.preventDefault();

    ClickEvents.insert({
      'userId': Session.get('userId'),
      'event': {
        'pageX': event.pageX,
        'pageY': event.pageY,
        'type': event.type
      }
    });
  },
  'click .btn--clear': (event) => {
    Meteor.call('clearAllCollections');
  },
  'touchstart .btn--clear': (event) => {
    Meteor.call('clearAllCollections');
  }
});

Template.root.helpers({
  allClickEvents: () => {
    return ClickEvents.find({});
  },
  myClickEvents: () => {
    return ClickEvents.find({ 'userId': Session.get('userId') });
  },
  othersClickEvents: () => {
    return ClickEvents.find({
      'userId': {
        $ne: Session.get('userId')
      }
    });
  },
  userId: () => {
    return Session.get('userId');
  }
});