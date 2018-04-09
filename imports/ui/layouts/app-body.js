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

      /**
       * Check possible ghost click.
       * Ghost clicks are triggered after a tap and in this use case not
       * wanted as they act as a duplicated event.
       */
      let potentialTap = Session.get('tapHappened');

      if (potentialTap && Session.get('userId') === potentialTap) {
         delete Session.keys['tapHappened'];
         return;
      }

      // EVents.insert({e});

      // Refactor++
      // Brunner.addClick(e, 1)

      Events.insert({
         'origin': Session.get('userId'),
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

         Meteor.call('insertIntoSwipes', {})

         preventGhostClicks();

         Events.insert({
            'origin': Session.get('userId'),
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

         /**
          * Similar to ghost clicks, a swipeleft is also a (fast) panleft. To suppress
          * this behaviour the same behaviour as in prevenGhostClicks is used. */
         preventPanRecognise();

         /***
          * Only support left and right swipes as vertical
          * events resign to scroll behaviour. */
         let targetSelector = (String)(e.target.nodeName).toLowerCase();
         targetSelector += (e.target.id) ? `#${e.target.id}` : '';
         targetSelector += (e.target.className) ? `.${e.target.className}` : '';

         Events.insert({
            'origin': Session.get('userId'),
            'type': e.type,
            'event': {
               'target': targetSelector
            }
         });
      },
      'panend *': (e) => {

         // Above threshold?
         const PAN_THRESHOLD = 20;
         if (Math.abs(e.deltaX) <= PAN_THRESHOLD) {
            return;
         }

         // Has a swipe happened?
         let potentialSwipe = Session.get('swipeHappened');
         if (potentialSwipe && Session.get('userId') === potentialSwipe) {
            delete Session.keys['swipeHappened'];
            return;
         }

         preventGhostClicks();

         // Determine direction
         let direction = (e.deltaX < 0) ? 'panleft' : 'panright';

         Events.insert({
            'origin': Session.get('userId'),
            'type': direction,
            'event': {
               'start': {
                  'x': e.center.x - e.deltaX,
                  'y': e.center.y - e.deltaY
               },
               'end': {
                  'x': e.center.x,
                  'y': e.center.y
               },
               'duration': e.deltaTime
            }
         });
      },
      'press *': (e) => {
         preventGhostClicks();

         Events.insert({
            'origin': Session.get('userId'),
            'type': 'press',
            'event': {
               'x': e.center.x,
               'y': e.center.y,
            }
         });
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

/**
 * Set a variable after each touch event.
 * If there is a touch AND click interaction from the same userId
 * nearly simulatneously (~10ms) a ghost click was detected.
 */
preventGhostClicks = () => {
   Session.set('tapHappened', Session.get('userId'));
}

/**
 * Similar to ghostClicks, but with swipe and pan behaviour.
 */
preventPanRecognise = () => {
   Session.set('swipeHappened', Session.get('userId'));
}
