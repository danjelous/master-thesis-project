import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { Events } from '../../api/events/events.js';

import './app-body.html';

const USER_ID = Session.get('userId');

Template.App_Body.onCreated(() => {

   // Subscribe to specific events
   // Meteor.subscribe('click-events');
   // Meteor.subscribe('swipe-events');

   // Subscribe to all events
   Meteor.subscribe('all-events');
});

Template.App_Body.events({
   'click': e => {

      /**
       * Check possible ghost click.
       * Ghost clicks are triggered after a tap and in this use case not
       * wanted as they act as a duplicated event.
       */
      let potentialTap = Session.get('tapHappened');

      if (potentialTap && USER_ID === potentialTap) {
         delete Session.keys['tapHappened'];
         return;
      }

      Events.insert({
         'origin': USER_ID,
         'type': 'click',
         'event': {
            'x': e.pageX,
            'y': e.pageY,
         }
      });

   },
   'click .btn--clear': () => {
      Meteor.call('clearCollections');
   }
});

Template.App_Body.helpers({
   templateGestures: {
      'tap *': (e) => {

         /**
          *  Hammer.js interprets a very short click as a 'tap'. In this
          * prototype refer to all taps from mobile devices as _actual_
          * taps, everything originating from a mouse is handled as a click. */
         if (e.pointerType === 'mouse') {
            return;
         }

         preventGhostClicks();

         Events.insert({
            'origin': USER_ID,
            'type': 'tap',
            'event': {
               'x': e.center.x,
               'y': e.center.y,
            }
         });

      },
      'tap .btn--clear': () => {
         Meteor.call('clearCollections');
      },
      'swipeleft *, swiperight *': (e) => {

         preventGhostClicks();

         /***
          * Only support left and right swipes as vertical
          * events resign to scroll behaviour. */
         let targetSelector = (String)(e.target.nodeName).toLowerCase();
         targetSelector += (e.target.id) ? `#${e.target.id}` : '';
         targetSelector += (e.target.className) ? `.${e.target.className}` : '';

         Events.insert({
            'origin': USER_ID,
            'type': e.type,
            'event': {
               'target': targetSelector
            }
         });
      }
   },
   allEvents: () => {
      return Events.find({});
   },
   myEvents: () => {
      return Events.find({ 'origin': USER_ID });
   },
   othersEvents: () => {
      return Events.find({
         'origin': {
            $ne: USER_ID
         }
      });
   },
   getEventData: (event) => {
      if (event.type === 'tap' || event.type === 'click') {
         return `( ${event.event.x} | ${event.event.y} )`;
      } else if (event.type.indexOf('swipe') > -1) {
         return `<span class="code">${event.event.target}</span>`;
      }
   },
   userId: () => {
      return USER_ID;
   }
});

/**
 * Set a variable after each touch event.
 * If there is a touch AND click interaction from the same userId
 * nearly simulatneously (~10ms) a ghost click was detected.
 */
preventGhostClicks = () => {
   Session.set('tapHappened', USER_ID);
}
