import { Session } from 'meteor/session';
import { Events } from '../../api/events/events.js';

import './events-list.html';

Template.Events_List.onCreated(() => {

  // Subscribe to specific events
  // Events.subscribe('click press swipe');

  // Subscribe to all events
  Events.subscribe('all');
});

Template.Events_List.events({
  'click': e => {
    Events.insertClick(e, Session.get('userId'));
  },
  'click .btn--clear': () => {
    Events.clear('all');
  }
});

Template.Events_List.helpers({
  templateGestures: {
    'tap *': (e) => {
      Events.insertTap(e, Session.get('userId'));
    },
    'tap .btn--clear': () => {
      Events.clear('all');
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
    return Events.find({
      'origin': Session.get('userId')
    });
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
      const pos = `on (${event.event.x.toFixed(2)}|${event.event.y.toFixed(2)}).<br>`;
      const inserted = `Inserted: ${formatTimeStamp(event.timestamp)}<br>`;
      const received = `Received: ${formatTimeStamp(Date.now())}`;
      return pos + inserted + received;
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

function formatTimeStamp(duration) {
  const milliseconds = parseInt((duration % 1000));
  let seconds = parseInt((duration / 1000) % 60);
  let minutes = parseInt((duration / (1000 * 60)) % 60);
  let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? `0${hours}` : hours;
  minutes = (minutes < 10) ? `0${minutes}` : minutes;
  seconds = (seconds < 10) ? `0${seconds}` : seconds;

  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}
