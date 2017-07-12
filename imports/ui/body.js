import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Expenses } from '../api/expenses.js';

import './expenses.js' ;
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('expenses');
});

Template.body.helpers ({
  expenses() { 
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      return Expense.find({ checked: { $ne: true } }, 
                        { sort: { createdAt: -1 } });
    }
    
    return Expenses.find({}, { sort: { username: 0 } }); 
  },
  incompleteCount() {
      return Expenses.find({ checked: { $ne: true } }).count();
  }
  
});

Template.body.events({
  'submit .new-expense'(event) {
    event.preventDefault();
    
    const target = event.target;
    const text = target.text.value;
    
    Meteor.call('expenses.insert', text);
    
    target.text.value = '';
  },
  
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
  
  'submit .update-expense'(event) {
    
              /* is actually never fires up */
    
    event.preventDefault();
    
    const target = event.target;
    //const text = target.text.value;
    

    Meteor.call('expenses.update', this._id, name, sum, tag);
    
    //Lose focus to implicitly show changes were submited 
    target.blur(); // text here is the input[name="text"] of parent node
  },
  
  'blur .update-expense'(event) {
    event.preventDefault();
    const target = event.target.parentNode.children;
    
    //const text = event.target.value;
    const name = target.name.value;
    const sum = parseFloat(target.sum.value.replace(',','.'));
    const tag = target.tag.value;
    
    Meteor.call('expenses.update', this._id, name, sum, tag, function (error, result) {
      if (error) console.log(error.message);
      //console.log(result);
    });
  }
});