Meteor.publish('click-events', () => {
   console.log('publish server');
   return ClickEvents.find();
});

Meteor.publish('startup-events', () => {
   console.log('Publish startup event');
   return StartupEvents.find({});
});