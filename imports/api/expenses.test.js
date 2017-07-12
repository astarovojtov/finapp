/* eslint-env mocha */
 
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';

import { Expenses } from './expenses.js';

if (Meteor.isServer) {
  describe('Expenses', () => {
    describe('methods', () => {
      const userId = Random.id();
      let expenseId;
      
      beforeEach(()=>{
        Expenses.remove({});
        expenseId = Expense.insert ({
          text: 'test expense',
          createdAt: new Date(),
          owner: userId,
          username: 'tmeasday',
        });
      });
      
      it('can delete owned expense', () => {
        // Find the internal implementation of the expense method so we can
        // test it in isolation
        const deleteExpense = Meteor.server.method_handlers['expenses.remove'];
 
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };
 
        // Run the method with `this` set to the fake invocation
        deleteExpense.apply(invocation, [expenseId]);
 
        // Verify that the method does what we expected
        assert.equal(Expenses.find().count(), 0);
      });
    });
  });
}