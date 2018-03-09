import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import './util/init-user';

import './main.html';


Meteor.startup(() => {

  // Initial value
  let userId = getLocalStorageVar('userId');

  // Get a new id if there is none
  if (userId == null) {

    Meteor.call('getUserId', (err, res) => {
      if (err) {
        console.log(`Error: ${err} `);
      } else {
        // Store the new userId in the LS if the client gets refreshed, loses
        // connection etc, use session for the rest of the app
        setLocalStorageVar('userId', res.id);
        userId = res.id;
        console.log(`set user id to ${res.id}`);
      }
    });
  }

  Session.set('userId', userId);
  Meteor.subscribe('click-events');
});

Template.root.events({
  'click': e => {
    console.log(e);
    console.log('Register click');

    // Full object clone only containing values (no objects or functions)
    // let newObj = removeCircularStructure(e);

    // Only necessary values
    let newObj = {
      center: {
        x: e.pageX,
        y: e.pageY
      },
      type: 'click'
    };

    handleTapClicks(newObj, 'click');
  },
  'click .btn--clear': () => {
    Meteor.call('clearAllCollections');
  }
});

Template.root.helpers({
  templateGestures: {
    'tap *': (e, t) => {

      Session.set('tapHappened', Session.get('userId'));

      if (e.pointerType === 'mouse') {
        console.log("Tap from mouse");

        // Could abort here as click event fires, no need for setTimeout etc.
      }

      setTimeout(() => {
        console.log('deleted Sessionvar tapHappened');
        delete Session.keys['tapHappened'];
      }, 100);

      console.log('Register tap');
      handleTapClicks(e, 'tap');
    },
    'tap .btn--clear': () => {
      Meteor.call('clearAllCollections');
    }
  },
  allClickEvents: () => {
    return ClickEvents.find({});
  },
  myClickEvents: () => {
    return ClickEvents.find({ 'origin': Session.get('userId') });
  },
  othersClickEvents: () => {
    return ClickEvents.find({
      'origin': {
        $ne: Session.get('userId')
      }
    });
  },
  userId: () => {
    return Session.get('userId');
  }
});

handleTapClicks = (e, type) => {

  const potentialTapClick = Session.get('tapHappened');
  const userId = Session.get('userId');

  // Get tapClicks from the same user
  if (potentialTapClick && potentialTapClick === userId && type === 'click') {


    // Alter last event from this user (which is a tap) to a click
    // Get _id
    // const lastDoc = ClickEvents.find(
    //   { 'origin': userId },
    //   { sort: { 'origin': -1 } }
    // );
    // let id;
    // lastDoc.forEach((doc) => {
    //   id = doc._id;
    // });

    // ClickEvents.update(
    //   { _id: id },
    //   { $set: { 'event.type': 'click' } }
    // );
    return;

  } else {

    // Normal tap or click
    ClickEvents.insert({
      'origin': userId,
      'event': {
        'x': e.center.x,
        'y': e.center.y,
        'type': type
      }
    });
    console.log('inserted');
  }
};

// Clone only values, as the original object may contain circular objects
removeCircularStructure = (obj) => {
  let newObj = {};

  for (let prop in obj) {
    let val = obj[prop];
    if (typeof val != 'object' && typeof val != 'function') {
      newObj[prop] = val;
    }
  }
  return newObj;
};