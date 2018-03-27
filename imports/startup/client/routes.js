import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import to load these templates
import '../../ui/layouts/app-body.js';

FlowRouter.route('/', {
   name: 'App_Body',
   action() {
      BlazeLayout.render('App_Body');
   },
});