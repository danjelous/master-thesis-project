import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { ClickEvents } from '../../api/clicks/clickEvents.js';

import './app-body.html';

Template.App_Body.onCreated(function () {

   // Set userId
   Session.set('userId', window.localStorage.getItem('userId'));

   // Subscribe to events
   Meteor.subscribe('click-events');
});

Template.App_Body.events({
   'click': e => {

      ClickEvents.insert({
         'origin': Session.get('userId'),
         'event': {
            'x': e.pageX,
            'y': e.pageY,
            'type': 'click'
         }
      });
   },
   'click .btn--clear': () => {
      Meteor.call('clickEvents.removeAll');
   }
});

Template.App_Body.helpers({
   templateGestures: {
      'tap *': (e, t) => {

         /**
          *  Hammer.js interprets a very short click as a 'tap'. In this 
          * prototype refer to all taps from mobile devices as _actual_
          * taps, everything originating from a mouse is handled as a click. */
         if (e.pointerType === 'mouse') {
            return;
         }

         ClickEvents.insert({
            'origin': Session.get('userId'),
            'event': {
               'x': e.center.x,
               'y': e.center.y,
               'type': 'tap'
            }
         });

      },
      'tap .btn--clear': () => {
         Meteor.call('clickEvents.removeAll');
      }
   },
   allClickEvents: () => {
      return ClickEvents.find({});
   },
   myClickEvents: () => {
      return ClickEvents.find({ 'origin': Session.get('userId') });
   },
   othersClickEvents: () => {
      return ClickEvents.find({
         'origin': {
            $ne: Session.get('userId')
         }
      });
   },
   userId: () => {
      return Session.get('userId');
   }
});