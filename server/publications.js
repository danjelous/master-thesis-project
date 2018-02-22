Meteor.publish('click-events', () => {
   console.log('publish click event');
   return ClickEvents.find();
});

Meteor.publish('startup-events', () => {
   console.log('Publish startup event');
   return StartupEvents.find({});
});