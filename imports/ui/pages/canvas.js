import { Session } from 'meteor/session';
import { Events } from '../../api/events/events.js';

import './canvas.html';

// Helpers for drawing
let canvas;
let context;
let chosenShape = '';

/** Percentage based sizes (0 to 1) of drawn squares/circles
 * in relation to the smallest canvas dimension.
 * E.g. in a 200x300 canvas the size would be 200xDRAW_ITEM_SIZE.*/
const DRAW_ITEM_SIZE = 0.06;

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
      paintCanvas();
    },
    removed() {
      paintCanvas();
    }
  });
});

Template.Canvas.events({
  'click .btn--clear-canvas': () => {
    Events.clear('all');
  },
  'click .canvas__area': (e) => {

    // Check if a shape is chosen
    if (!isShapeChosen()) return;

    /**
     * Override pixel based to relative coordinates (responsiveness).
     * So on a 400x400px canvas a click on 200|200 (offsetX|offsetY)
     * gets transformed to 0.5x0.5 */
    e.pageX = e.offsetX / canvas.width;
    e.pageY = e.offsetY / canvas.height;

    // Add additional event params (shape, color etc.)
    e = addCustomEventParams(e);

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
      chosenShape = (e.target.nodeName === 'circle') ? 'circle' : 'rect';
      $(e.target).parent().attr('class', 'shape--highlight');
    }
  }
});

Template.Canvas.helpers({
  templateGestures: {
    'tap .canvas__area': e => {

      // Check if a shape is chosen
      if (!isShapeChosen()) return;

      // Transform absolute to relative coords
      e.center = transformMobileCoords(e.center);

      // Add additional event params (shape, color etc.)
      e = addCustomEventParams(e);

      Events.insertTap(e, Session.get('userId'));
    },
    'press .canvas__area': e => {

      // Highlight a chosen shape if pressed on it
      const shape = isShapeInThreshold(e.center);
      if (typeof shape === 'undefined') return;

      // Change coords of the press to the shape to highlight
      e.center.x = shape.event.x;
      e.center.y = shape.event.y;

      // Custom params
      e.eventParams = {
        'shape': shape.event.params.shape
      };

      // Only one highlight at one time
      Events.clear('press');

      // Insert elem to highlight
      Events.insertPress(e, Session.get('userId'));
    },
  }
});

// Checks if a shape is close to the given center (click/tap).
isShapeInThreshold = center => {
  // Transform
  center = transformMobileCoords(center);

  // Set threshold (%)
  const THRESHOLD = 0.02;
  let find;
  Events.find({ 'type': { $ne: 'press' } }).forEach(elem => {
    if (
      center.x <= elem.event.x + THRESHOLD &&  
      center.x >= elem.event.x - THRESHOLD &&
      center.y <= elem.event.y + THRESHOLD &&  
      center.y >= elem.event.y - THRESHOLD) {
      find = elem;
    }
  });
  return find;
}

/** Hammer delivers absolute coordinates on the current screen (ignores scrollPos).
 * So a) subtract the offset from the canvas b) transform it to relative
 * coordinates and c) take eventual scrolling into account. */
transformMobileCoords = center => {
  let relX = center.x -= $(canvas).offset().left;
  let relY = center.y -= $(canvas).offset().top;

  // c)
  relY += window.scrollY;

  // Transform to canvas relative coords
  center.x = relX / canvas.width;
  center.y = relY / canvas.height;

  return center;
}

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

  const smallestCanvasDimension =
    (canvas.width > canvas.height) ? canvas.height : canvas.width;

  // Paint only click and taps
  const elems = Events.find({ $or: [{ type: 'click' }, { type: 'tap' }] });
  elems.forEach(elem => {

    context.beginPath();
    if (elem.event.params.shape === 'circle') {
      // Transform relative coordinates (0 to 1) to actual pixels
      context.arc(
        elem.event.x * canvas.width,
        elem.event.y * canvas.height,
        smallestCanvasDimension * DRAW_ITEM_SIZE, 0, 2 * Math.PI);
    } else {
      context.rect(
        elem.event.x * canvas.width,
        elem.event.y * canvas.height,
        smallestCanvasDimension * DRAW_ITEM_SIZE * 2,
        smallestCanvasDimension * DRAW_ITEM_SIZE * 2);
    }

    // Check if color is present
    const color = (!elem.event.params.color) ? '#000000' : elem.event.params.color;

    context.lineWidth = elem.event.params.stroke;
    context.strokeStyle = color;
    context.stroke();
  });

  // Paint press events (highlighters) differently
  const HIGHLIGHT_PADDING = 0.01;
  const HIGHLIGHT_STROKE_WIDTH = 4;
  Events.find({ type: 'press' }).forEach(elem => {
    context.beginPath();
    if (elem.event.params.shape === 'circle') {
      context.arc(
        elem.event.x * canvas.width,
        elem.event.y * canvas.height,
        smallestCanvasDimension * (DRAW_ITEM_SIZE + HIGHLIGHT_PADDING), 0, 2 * Math.PI);
    } else {
      context.rect(
        (elem.event.x - HIGHLIGHT_PADDING) * canvas.width,
        (elem.event.y - HIGHLIGHT_PADDING) * canvas.height - HIGHLIGHT_STROKE_WIDTH / 2,
        smallestCanvasDimension * (DRAW_ITEM_SIZE * 2 + 2 * HIGHLIGHT_PADDING) + HIGHLIGHT_STROKE_WIDTH,
        smallestCanvasDimension * (DRAW_ITEM_SIZE * 2 + 2 * HIGHLIGHT_PADDING) + HIGHLIGHT_STROKE_WIDTH);
    };

    context.lineWidth = HIGHLIGHT_STROKE_WIDTH;
    context.strokeStyle = 'deeppink';
    context.setLineDash([5, 3]);
    context.stroke();

    // Reset line dash
    context.setLineDash([]);
  });
}

clearCanvas = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

isShapeChosen = () => {
  if (chosenShape === '') {
    $('.alert--no-shape').removeClass('hidden');
    $('.control-panel__shape').focus();
    return false;
  } else {
    return true;
  }
}

addCustomEventParams = e => {
  e.eventParams = {
    'shape': chosenShape,
    'stroke': $('.control-panel__stroke select').val(),
    'color': $('.control-panel__color input').val()
  };

  return e;
}
