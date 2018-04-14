import { Session } from 'meteor/session';
import { Events } from '../../api/events/events.js';

import './canvas.html';

// Helpers for drawing
let canvas;
let context;
let chosenShape = '';

Template.Canvas.onRendered(() => {

   // Subscribe to specific events
   Events.subscribe('all');

   // Initialise canvas and context
   canvas = $('.canvas__area')[0];
   context = canvas.getContext('2d');

   // Initialise width/height responsively
   initResponsiveCanvas(canvas);

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
   'click .btn--clear-canvas': () => {
      Events.clearAll();
   },
   'click .canvas__area': (e) => {

      if (chosenShape === '') {
         $('.alert--no-shape').removeClass('hidden');
         $('.control-panel__shape').focus();
         return;
      }


      /**
       * Override pixel based to relative coordinates (responsiveness).
       * So on a 400x400px canvas a click on 200|200 (offsetX|offsetY)
       * gets transformed to 0.5x0.5 */
      e.pageX = e.offsetX / canvas.width;
      e.pageY = e.offsetY / canvas.height;

      Events.insertClick(e, Session.get('userId'));
   },
   'click .control-panel svg': (e) => {

      // Reset visuals
      $.each($('.control-panel svg'), (index, elem) => {
         $(elem).attr('class', '');
      });

      // Hide possible error message
      $('.alert--no-shape').addClass('hidden');

      // Handle event
      if (e.target.nodeName === 'svg') {
         // Click on <svg>
         chosenShape = e.target.children[0].nodeName;
         $(e.target).attr('class', 'shape--highlight');
      } else {
         chosenShape = (e.target.name === 'circle') ? 'circle' : 'rect';
         $(e.target).parent().attr('class', 'shape--highlight');
      }
   }
});

Template.Canvas.helpers({
   templateGestures: {
      'tap .canvas__area': (e) => {

         /** Hammer delivers absolute coordinates > subtract offset from
          * canvas and transform to relative coords. */
         let relX = e.center.x -= $(canvas).offset().left;
         let relY = e.center.y -= $(canvas).offset().top;

         // Transform to canvas relative coords
         e.center.x = relX / canvas.width;
         e.center.y = relY / canvas.height;

         Events.insertTap(e, Session.get('userId'));
      }
   }
});

initResponsiveCanvas = () => {
   if (context) {
      window.addEventListener('resize', resizeCanvas, false);
      window.addEventListener('orientationchange', resizeCanvas, false);
      resizeCanvas();
   }
}

resizeCanvas = () => {
   // Overrride with max width/height of 800x600 and 20px padding
   canvas.width = (window.innerWidth > 800) ? 800 : window.innerWidth - 40;
   canvas.height = (window.innerHeight > 600) ? 600 : window.innerHeight - 40;

   // Repaint
   paintCanvas();
}

paintCanvas = () => {
   clearCanvas();
   const elems = Events.find({});
   elems.forEach(elem => {
      context.beginPath();

      // Transform relative coordinates (0 to 1) to actual pixels
      context.arc(elem.event.x * canvas.width, elem.event.y * canvas.height, 40, 0, 2 * Math.PI);
      context.stroke();
   });
}

clearCanvas = () => {
   context.clearRect(0, 0, canvas.width, canvas.height);
}
