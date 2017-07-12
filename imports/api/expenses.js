import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Expenses = new Mongo.Collection('expenses');

if (Meteor.isServer) {
  Meteor.publish('expenses', function expensesPublication() {
    return Expenses.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
  'expenses.insert'(text) {
    check(text, String);
    
    let sum = text.match(/\d+(?:[\.,]\d+)?/)[0];
    
    let name_tag_arr = text.replace(sum,',').split(',');
    let name = name_tag_arr[0].trim();
    let tag = name_tag_arr[1].trim();
    sum = parseFloat(sum.replace(',','.'));
    
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Expenses.insert({
      text, name, sum, tag,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
      private: true
    })
  },

  'expenses.update'(expenseId, name, sum, tag) {
    check(expenseId, String);
    //check(text, String);

    const expense = Expenses.findOne(expenseId);

    if (expense.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
      //return error;
    } else {
      var result = Expenses.update(expenseId, { $set: { name: name, sum: sum, tag: tag } });
      return result;
    }
    
   
    
  },

  'expenses.remove'(expenseId) {
      check(expenseId, String);

    const expense = Expenses.findOne(expenseId);
    if (expense.private && expense.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    if (expense.owner == Meteor.userId()) {
      Expenses.remove(expenseId);
    }
  },

  //checkbutton deleted from the expenses template
  'expenses.setChecked'(expenseId, setChecked) {
    check(expenseId, String);
    check(setChecked, Boolean);

    Expenses.update(expenseId, { $set: { checked: setChecked }});
  },

  'expenses.setPrivate'(expenseId, setToPrivate) {
      check(expenseId, String);
      check(setToPrivate, Boolean);

      const expense = Expenses.findOne(expenseId);

      if (expense.owner !== Meteor.userId()) {
        let error = new Meteor.Error('not-authorized');
      } else { 
//        var result = Expenses.update(expenseId, { $set: { private: setToPrivate } }) 
//        return result;
        Expenses.update(expenseId, { $set: { private: setToPrivate } }) 
      }
      
  }
})