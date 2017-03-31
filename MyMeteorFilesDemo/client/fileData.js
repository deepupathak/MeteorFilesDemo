import { fileCollection } from '../lib/file-collection.js';

Template.fileData.onCreated(function() {
  this.fetchedText = new ReactiveVar(false);
  this.showOriginal = new ReactiveVar(false);
  this.showPreview = new ReactiveVar(false);
  this.showError = new ReactiveVar(false);
  this.showInfo = new ReactiveVar(false);
  this.warning = new ReactiveVar(false);
});

Template.fileData.helpers({
	file: function(){
		// var current = FlowRouter.current().params._id;
		// console.log("----", fileCollection.find({_id: FlowRouter.current().params._id}))
		return fileCollection.find({_id: FlowRouter.current().params._id});
	},
	warning: function() {
    return Template.instance().warning.get();
  },
  getCode: function() {
    if (this.type && !!~this.type.indexOf('/')) {
      return this.type.split('/')[1];
    } else {
      return '';
    }
  },
  isBlamed: function() {
    return !!~_app.blamed.get().indexOf(this._id);
  },
  showInfo: function() {
    return Template.instance().showInfo.get();
  },
  showError: function() {
    return Template.instance().showError.get();
  },
  fetchedText: function() {
    return Template.instance().fetchedText.get();
  },
  showPreview: function() {
    return Template.instance().showPreview.get();
  },
  showOriginal: function() {
    return Template.instance().showOriginal.get();
  }
});

Template.fileData.onRendered(function() {
	var self = this;
	this.warning.set(false);
	this.fetchedText.set(false);
	var file = fileCollection.find({_id: FlowRouter.current().params._id});
	// console.log(file,"***")
	if (file.isText || file.isJSON){
		console.log("file isText OR isJSON");
		HTTP.call('GET', file.link(), function(error, resp) {
		  self.showPreview.set(true);
		  if (error) {
		    console.error(error);
		  } else {
		    if (!~[500, 404, 400].indexOf(resp.statusCode)) {
		      /*if (resp.content.length < 1024 * 64) {*/
		        self.fetchedText.set(resp.content);
		      /*} else {
		        self.warning.set(true);
		      }*/
		    }
		  }
		});
	}else if (file.isImage){
		console.log("file isImage");
		if (/png|jpe?g/i.test(file.type)) {
		  img  = new Image();
		  img.onload = function() {
			  self.showPreview.set(true);
			};

			img.onerror = function() {
			  self.showError.set(true);
			};
			var handle, ref, ref1;

			if ((ref = file.versions) != null ? (ref1 = ref.preview) != null ? ref1.extension : void 0 : void 0) {
			  img.src = file.link('preview');
			} else {
			  handle = fileCollection.find(file._id).observeChanges({
			    changed: function(_id, fileds) {
			      var ref2, ref3;
			      if (fileds != null ? (ref2 = fileds.versions) != null ? (ref3 = ref2.preview) != null ? ref3.extension : void 0 : void 0 : void 0) {
			        img.src = self.file.link('preview');
			        handle.stop();
			      }
			    }
			  });
			}
		}else{
			img  = new Image();
      img.onload = function() {
			  self.showPreview.set(true);
			};
			img.onerror = function() {
			  self.showError.set(true);
			};
      img.src = file.link()
		}
	}else if (file.isVideo){
		console.log("file isVideo");
    video = document.getElementById(file._id);
    if (!video.canPlayType(file.type)) {
		  self.showError.set(true);
		} else {
		  video.play();
		}
	}else if (file.isAudio){
		console.log("file isAudio");
    audio = document.getElementById(file._id);
    if (! audio.canPlayType(file.type)){
			self.showError.set(true);
    }else{
    	audio.play();
    }
  }
  window.IS_RENDERED = true;
});

Template.fileData.events({
	'click #data-show-info': function(e, template) {
    e.preventDefault();
    template.showInfo.set(!template.showInfo.get());
    return false;
  },
  'touchmove .file-overlay': function(e) {
    e.preventDefault();
    return false;
  },
  'touchmove .file': function(e, template) {
    var timer;
    if (template.$(e.currentTarget).height() < template.$('.file-table').height()) {
      template.$('a.show-info').hide();
      template.$('h1.file-title').hide();
      template.$('a.download-file').hide();
      if (timer) {
        Meteor.clearTimeout(timer);
      }
      timer = Meteor.setTimeout(function() {
        template.$('a.show-info').show();
        template.$('h1.file-title').show();
        return template.$('a.download-file').show();
      }, 768);
    }
  }
})