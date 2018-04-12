import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import to load these templates
import '../../ui/pages/events-list.js';
import '../../ui/pages/landing.js';
import '../../ui/pages/canvas.js';

FlowRouter.route('/', {
   name: 'Landing',
   action() {
      BlazeLayout.render('Landing');
   },
});

FlowRouter.route('/events-list', {
   name: 'Events_List',
   action() {
      BlazeLayout.render('Events_List');
   },
});

FlowRouter.route('/canvas', {
   name: 'Canvas',
   action() {
      BlazeLayout.render('Canvas');
   },
});

const DefinedRoutes = ['/', '/events-list', '/canvas'];
export { DefinedRoutes };
