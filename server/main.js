import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  clearAllCollections();

  const obj = {
    'event': 'startup',
    'origin': 'server'
  };

  StartupEvents.insert(obj);
  const test = StartupEvents.findOne({ 'event': 'startup' });
  console.log('inserted se event');
});