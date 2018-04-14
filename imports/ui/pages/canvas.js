import { Session } from 'meteor/session';
import { Events } from '../../api/events/events.js';

import './canvas.html';

// Canvas and context
let canvas;
let context;

Template.Canvas.onRendered(() => {

   // Subscribe to specific events
   Events.subscribe('all');

   // Initialise canvas and context
   canvas = $('.canvas__area')[0];
   context = canvas.getContext('2d');

   // Observe changes to the subscribed cursor
   const cursor = Events.find({});
   const handle = cursor.observeChanges({
      added(id) {
         console.log('added' + id);
         paintCanvas();
      },

      removed() {
         clearCanvas();
      }
   });
});

Template.Canvas.events({
   'click .btn--clear': () => {
      Events.clearAll();
   },
   'click .canvas__area': (e) => {

      // Override to canvas relative coordintes
      e.pageX = e.offsetX;
      e.pageY = e.offsetY;

      Events.insertClick(e, Session.get('userId'));
   }
});

Template.Canvas.helpers({
   templateGestures: {
      'tap .canvas__area': (e) => {
         Events.insertTap(e, Session.get('userId'));
      }
   }
});

paintCanvas = () => {
   clearCanvas();
   const elems = Events.find({});
   elems.forEach(elem => {
      context.beginPath();
      context.arc(elem.event.x, elem.event.y, 40, 0, 2 * Math.PI);
      context.stroke();
   });
}

paintItem = (item) => {

}

clearCanvas = () => {
   context.clearRect(0, 0, canvas.width, canvas.height);
}
