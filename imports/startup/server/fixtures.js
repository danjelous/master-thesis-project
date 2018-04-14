import { Meteor } from 'meteor/meteor';
import { Events } from '../../api/events/events.js';

Meteor.startup(() => {
   Events.clearAll();
});
