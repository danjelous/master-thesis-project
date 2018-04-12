import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import to load these templates
import '../../ui/pages/app-body.js';
import '../../ui/pages/landing.js';

FlowRouter.route('/', {
   name: 'Landing',
   action() {
      BlazeLayout.render('Landing');
   },
});
