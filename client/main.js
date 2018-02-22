import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import './main.html';

Session.set('userID', '');

Meteor.startup(() => {
  Meteor.call('getUserID', (err, res) => {
    if (err) {
      console.log(`Error: ${err}`);
    } else {
      Session.set('userID', res.id);
    }
  });

  Meteor.call('clearAllCollections');
  Meteor.subscribe('click-events');
});

Template.root.events({
  'click': (event) => {
    event.preventDefault();

    ClickEvents.insert({
      'origin': userID,
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
  userID: () => {
    return Session.get('userID');
  }
});