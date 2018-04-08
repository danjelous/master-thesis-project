import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

// Initial value from localstorage
let userId = window.localStorage.getItem('userId');

// Get a new id if there is none available
if (!userId) {

   Meteor.call('getUserId', (err, res) => {
      if (err) {
         console.log(`Error: ${err} `);
      } else {

         // Store the new userId in the LS to reuse it
         window.localStorage.setItem('userId', res.id);
         Session.set('userId', res.id);
      }
   });
} else {
   // Write existing id into the session
   Session.set('userId', userId);
}
