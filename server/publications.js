Meteor.publish('click-events', () => {
   return ClickEvents.find();
});

Meteor.publish('startup-events', () => {
   return StartupEvents.find({});
});