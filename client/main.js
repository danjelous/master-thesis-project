import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';

import './main.html';

const userID = 'A';

Template.root.events({
  'click': (event) => {
    console.log('click on client happened');

    // Events.insert({
    //   'event': 'click',
    //   'origin': userID,
    //   'object': event
    // });

    // And this line is querying it
    // const todo = Events.findOne({ _id: 1 });
    // So this happens right away!
    //console.log(todo);

  }
});

Template.root.helpers({
  startupEvents: () => {
    console.log('updated startup event');
    console.log(StartupEvents.findOne({}));
    return StartupEvents.find({});
  }
});

Meteor.subscribe('startup-events', );