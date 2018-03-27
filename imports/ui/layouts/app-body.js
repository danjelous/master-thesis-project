import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { ClickEvents } from '../../api/clicks/clickEvents.js';
import { SwipeEvents } from '../../api/swipes/swipeEvents.js';

import './app-body.html';

Template.App_Body.onCreated(function () {

   // Subscribe to events
   Meteor.subscribe('click-events');
   Meteor.subscribe('swipe-events');
});

Template.App_Body.events({
   'click': e => {

      /**
       * Check possible ghost click.
       * Ghost clicks are triggered after a tap and in this use case not
       * wanted as they act as a duplicated event.
       */
      let potentialTap = Session.get('tapHappened');
      const userId = Session.get('userId');

      if (potentialTap && userId === potentialTap) {
         delete Session.keys['tapHappened'];
         return;
      }

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

         // Prevent ghost clicks
         const userId = Session.get('userId');
         Session.set('tapHappened', userId);

         ClickEvents.insert({
            'origin': userId,
            'event': {
               'x': e.center.x,
               'y': e.center.y,
               'type': 'tap'
            }
         });

      },
      'tap .btn--clear': () => {
         Meteor.call('clearCollections');
      },
      'swipeleft *, swiperight *': (e) => {

         /***
          * Only support left and right swipes as vertical 
          * events resign to scroll behaviour. */
         let targetSelector = (String)(e.target.nodeName).toLowerCase();
         targetSelector += (e.target.id) ? `#${e.target.id}` : '';
         targetSelector += (e.target.className) ? `.${e.target.className}` : '';

         SwipeEvents.insert({
            'origin': Session.get('userId'),
            'event': {
               'type': 'swipe',
               'direction': e.type,
               'target': targetSelector
            }
         });
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
   allSwipeEvents: () => {
      return SwipeEvents.find({});
   },
   mySwipeEvents: () => {
      return SwipeEvents.find({ 'origin': Session.get('userId') });
   },
   othersSwipeEvents: () => {
      return SwipeEvents.find({
         'origin': {
            $ne: Session.get('userId')
         }
      });
   },
   userId: () => {
      return Session.get('userId');
   }
});