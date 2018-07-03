import { Meteor } from 'meteor/meteor';
import { Events } from '../events.js';

/**
 * Use like the following:
 *
 * Events.subscribe('all')  to get all events OR specifically
 * Events.subscribe('swipe click press')
 */
Events.subscribe = args => {
  let events = args.split(' ');
  events.forEach(event => {
    Meteor.subscribe(`${event}-events`);
  });
}

/**
 *  Same usage as .subscribe
 * Events.clear('swipe click press')
 */
Events.clear = args => {
  let collections = args.split(' ');
  collections.forEach(coll => {
    Meteor.call(`clear-${coll}-events`);
  });
}
