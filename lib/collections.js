ClickEvents = new Mongo.Collection('click-events');
StartupEvents = new Mongo.Collection('startup-events');

clearAllCollections = () => {
   ClickEvents.remove({});
   StartupEvents.remove({});
}