import { Methods } from './methods.js';
import { Session } from 'meteor/session';

const Events = new Mongo.Collection('all-events');

// Helper variables to store states
let tapHappenedFromUserId = '';
let swipeHappenedFromUserId = '';


Events.insertClick = (e, userId) => {
   /**
    * Check possible ghost click.
    * Ghost clicks are triggered after a tap and in this use case not
    * wanted as they act as a duplicated event.
    */
   const potentialTap = tapHappenedFromUserId;

   if (potentialTap && userId === potentialTap) {

      // Actual ghost click, abort
      tapHappenedFromUserId = '';
      return;
   }

   Events.insert({
      'origin': userId,
      'type': 'click',
      'event': {
         'x': e.pageX,
         'y': e.pageY,
      }
   });
}

Events.insertTap = (e, userId) => {

   /**
    *  Hammer.js interprets a very short click as a 'tap'. In this
    * prototype refer to all taps from mobile devices as _actual_
    * taps, everything originating from a mouse is handled as a click. */
   if (e.pointerType === 'mouse') {
      return;
   }

   preventGhostClicks(userId);

   Events.insert({
      'origin': userId,
      'type': 'tap',
      'event': {
         'x': e.center.x,
         'y': e.center.y,
      }
   });
}

Events.insertSwipe = (e, userId) => {
   preventGhostClicks(userId);

   /**
    * Similar to ghost clicks, a swipeleft is also a (fast) panleft. To suppress
    * this behaviour the same behaviour as in prevenGhostClicks is used. */
   preventPanRecognise(userId);

   /***
    * Only support left and right swipes as vertical
    * events resign to scroll behaviour. */
   let targetSelector = (String)(e.target.nodeName).toLowerCase();
   targetSelector += (e.target.id) ? `#${e.target.id}` : '';
   targetSelector += (e.target.className) ? `.${e.target.className}` : '';

   Events.insert({
      'origin': userId,
      'type': e.type,
      'event': {
         'target': targetSelector
      }
   });
}

Events.insertPan = (e, userId) => {

   // Above threshold?
   const PAN_THRESHOLD = 20;
   if (Math.abs(e.deltaX) <= PAN_THRESHOLD) {
      return;
   }

   // Has a swipe happened?
   const potentialSwipe = swipeHappenedFromUserId;
   if (potentialSwipe && userId === potentialSwipe) {

      // Event was actually a swipe, don't fire a pan
      swipeHappenedFromUserId = '';
      return;
   }

   preventGhostClicks(userId);

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
}

Events.insertPress = (e, userId) => {
   preventGhostClicks(userId);

   Events.insert({
      'origin': userId,
      'type': 'press',
      'event': {
         'x': e.center.x,
         'y': e.center.y,
      }
   });
}

/**
 * Set a variable after each touch event.
 * If there is a touch AND click interaction from the same userId
 * nearly simulatneously (~10ms) a ghost click was detected.
 */
preventGhostClicks = (userId) => {
   tapHappenedFromUserId = userId;
}

/**
 * Similar to ghostClicks, but with swipe and pan behaviour.
 */
preventPanRecognise = (userId) => {
   swipeHappenedFromUserId = userId;
}
export { Events };
