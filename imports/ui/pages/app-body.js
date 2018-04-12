import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { Events } from '../../api/events/events.js';

import './app-body.html';

Template.App_Body.onCreated(() => {

   // Subscribe to specific events
   // Events.subscribe('click press swipe');

   // Subscribe to all events
   Events.subscribe('all');
});

Template.App_Body.events({
   'click': e => {
      Events.insertClick(e, Session.get('userId'));
   },
   'click .btn--clear': () => {
      Meteor.call('clearCollections');
   }
});

Template.App_Body.helpers({
   templateGestures: {
      'tap *': (e) => {
         Events.insertTap(e, Session.get('userId'));
      },
      'tap .btn--clear': () => {
         Meteor.call('clearCollections');
      },
      'swipeleft *, swiperight *': (e) => {
         Events.insertSwipe(e, Session.get('userId'));
      },
      'panend *': (e) => {
         Events.insertPan(e, Session.get('userId'));
      },
      'press *': (e) => {
         Events.insertPress(e, Session.get('userId'));
      }
   },
   allEvents: () => {
      return Events.find({});
   },
   myEvents: () => {
      return Events.find({ 'origin': Session.get('userId') });
   },
   othersEvents: () => {
      return Events.find({
         'origin': {
            $ne: Session.get('userId')
         }
      });
   },
   getEventData: (event) => {
      if (event.type === 'tap' || event.type === 'click' || event.type === 'press') {
         return `on (${event.event.x}|${event.event.y})`;
      } else if (event.type.indexOf('swipe') > -1) {
         return `on <span class="code">${event.event.target}</span>`;
      } else if (event.type.indexOf('pan') > -1) {
         return `from
            (${event.event.start.x}|${event.event.start.y}) to
            (${event.event.end.x}|${event.event.end.y}) in
            ${event.event.duration}ms`;
      }
   },
   userId: () => {
      return Session.get('userId');
   }
});
