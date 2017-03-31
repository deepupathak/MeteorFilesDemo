import { fileCollection } from '../lib/file-collection.js';

Template.fileList.onCreated(function() {
  var self;
  self = this;
  this.showSettings = new ReactiveVar(false);
  this.showPreview = function() {
    if (self.data.isImage && /png|jpe?g/i.test(self.data.extension)) {
      if (self.data.versions.thumbnail40) {
        return true;
      }
    }
    return false;
  };
});

Template.fileList.helpers({
  showPreview: function() {
  	console.log("show preview ->", Template.instance().showPreview())
    return Template.instance().showPreview();
  }
});

Template.fileList.events({
	'click #deleteFile'(event) {
		event.preventDefault();
		// console.log(this._id,"=======")
		Meteor.call('fileDelete', this._id);
	},
	/*'click #name'(event){
		event.preventDefault();
		console.log("go to preview")
	},*/
	'click #show-file'(event) {
		event.preventDefault();
		// console.log(">> goto preview >>")
		FlowRouter.go('file', {
			_id: this._id
		});
		return false;
	},
	/*'click #downloadFile'(event) {
		event.preventDefault();
		console.log(this._id);
		var url = fileCollection.findOne({_id: this._id}).link();
		console.log(url)
		return url;
	}*/
});