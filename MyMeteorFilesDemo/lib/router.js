// import { fileCollection } from '../lib/file-collection.js';

FlowRouter.route('/', {
	name:'HomePage',
	action: function(){
		BlazeLayout.render('mainLayout', {content: 'main'});
	},
	waitOn: function(params) {
    return [_app.subs.subscribe('files')];
  },
  whileWaiting: function() {
    BlazeLayout.render('mainLayout', {content: '_loading'});
  }
});


FlowRouter.route('/:_id', {
  name: 'file',
  action: function(params, queryParams, file) {
    BlazeLayout.render('mainLayout', {content:'fileData'});
  }/*,
  waitOn: function(params) {
    return [_app.subs.subscribe('file', params._id)];
  },
  whileWaiting: function() {
    BlazeLayout.render('mainLayout', {content: '_loading'});
  },
  onNoData: function() {
    BlazeLayout.render('mainLayout', {content: '_404'});
  },
  data: function(params) {
    return fileCollection.findOne(params._id) || false;
  }*/
});