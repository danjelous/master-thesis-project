import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import './main.html';

Meteor.startup(() => {


  if (!Session.get('userId')) {

    Meteor.call('getUserId', (err, res) => {
      if (err) {
        console.log(`Error: ${err}`);
      } else {
        // SetPersistent stores value in localstorage
        // So if you want a new ID (foreverwhat reason) clear that
        Session.setPersistent('userId', res.id);
      }
    });
  }

  Meteor.call('clearAllCollections');
  Meteor.subscribe('click-events');
});

Template.root.events({
  'click': (event) => {
    event.preventDefault();

    ClickEvents.insert({
      'origin': Session.get('userID'),
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