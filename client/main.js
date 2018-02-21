import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.root.events({
  'click': (event) => {
    console.log(`Registered click event`);
  }
});