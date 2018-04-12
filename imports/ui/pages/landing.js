import { FlowRouter } from 'meteor/kadira:flow-router';

import './landing.html';

Template.Landing.events({
   'change .connect-public__options': (e) => {
      if (e.target.value !== '') {
         $('.connect-public__button').removeClass('disabled');
      } else {
         $('.connect-public__button').addClass('disabled');
      }
   },
   'input .connect-private__space-id': (e) => {
      if (e.target.value.length > 0) {
         $('.connect-private__button').removeClass('disabled');
      } else {
         $('.connect-private__button').addClass('disabled');
      }
   },
   'click .connect-public__button': (e) => {
      if ($(e.target).hasClass('disabled')) {
         return;
      }

      // Forward to the visualisation
      FlowRouter.go('/events-list');
   }
})
