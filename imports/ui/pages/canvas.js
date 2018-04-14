import { Meteor } from 'meteor/meteor';
import { Events } from '../../api/events/events.js';

import './canvas.html';

Template.Canvas.onCreated(function () {

   // Subscribe to specific events
   Events.subscribe('all');
});

Template.Canvas.events({
   'click .canvas__area': (e) => {

      // Override to canvas relative coordintes
      e.pageX = e.offsetX;
      e.pageY = e.offsetY;

      Events.insertClick(e);
      drawStuff();
   }
});

Template.Canvas.helpers({
   templateGestures: {
      'press .canvas__area': (e) => {

      }
   }
});

drawStuff = () => {
   const elems = Events.find({});
   let context = $('.canvas__area')[0].getContext('2d');
   elems.forEach(elem => {
      context.beginPath();
      context.arc(elem.event.x, elem.event.y, 40, 0, 2 * Math.PI);
      context.stroke();
   });
}
