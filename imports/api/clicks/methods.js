import { ClickEvents } from './clickEvents.js';

Meteor.methods({
   'clickEvents.removeAll'() {
      ClickEvents.remove({});
   }
})