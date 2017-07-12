import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './expenses.html';

Template.expense.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  }
});

Template.expense.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Meteor.call('expenses.setChecked', this._id, !this.checked);
  },
  'click .delete'() {
    Meteor.call('expenses.remove', this._id);
  },
  'click .toggle-private'() {
    Meteor.call('expenses.setPrivate', this._id, !this.private);
  }
});