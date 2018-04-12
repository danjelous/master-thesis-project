import { DefinedRoutes } from '../../startup/client/routes.js';
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
      if ($(e.target).hasClass('disabled')) return;

      // Forward to the visualisation
      FlowRouter.go(`/${$('.connect-public__options').val()}`);
   },
   'click .connect-private__button': (e) => {
      if ($(e.target).hasClass('disabled')) return;

      const targetSpace = $('.connect-private__space-id');

      // Check if the space exists
      DefinedRoutes.forEach(route => {
         if (route === `/${targetSpace.val()}`) {

            // Forward to the space
            FlowRouter.go(`/${targetSpace.val()}`);
         }
      });

      // No defined space found, show error message
      $('.connect-private__alert').removeClass('hidden');
      $('.connect-private__space-id').focus();
   }
});
