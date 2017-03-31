import { Template } from 'meteor/templating';
// import { ReactiveVar } from 'meteor/reactive-var';

import { fileCollection } from '../lib/file-collection.js';

import './main.html';

Template.main.onRendered(()=> {
	Meteor.subscribe('files');
});

Template.main.helpers({
	fileLists() {
		return fileCollection.find();
	}
});

Template.main.events({
	'click #fakeUpload'(event) {
		event.preventDefault();
		$('#userfileupload').click();
	},
	'change #userfileupload': function(e, template) {
		// return template.$('form#uploadFile').submit();
		e.preventDefault();
		var file = $('#userfileupload')[0].files[0];
		// console.log('-----', file)
		let uploadInstance = fileCollection.insert({
			file: file,
			meta: {
				created_at: new Date()
			},
			streams: 'dynamic',
			chunkSize: 'dynamic',
			allowWebWorkers: false
		});

		uploadInstance.on('end', function (error, fileObj) {
			// console.log('On end File Object: ', fileObj);
		});
	},
	/*'submit form#uploadFile': function(e) {
		e.preventDefault();
		// console.log('-----', e.currentTarget.userfileupload.files)
		var file = e.currentTarget.userfileupload.files;
		console.log(file,"-------------")
		let uploadInstance = fileCollection.insert({
			file: file,
			meta: {},
			streams: 'dynamic',
			chunkSize: 'dynamic',
			allowWebWorkers: false // If you see issues with uploads, change this to false
		});
	},*/
	'dragover #uploadFile, dragenter #uploadFile': function(e, template) {
		var uf;
		e.preventDefault();
		e.stopPropagation();
		uf = document.getElementById('uploadFile');
		if (!~uf.className.indexOf('file-over')) {
			uf.className += ' file-over';
		}
		e.originalEvent.dataTransfer.dropEffect = 'copy';
	},
	'drop #uploadFile.file-over': function(e, template) {
		var uf;
		e.preventDefault();
		e.stopPropagation();
		uf = document.getElementById('uploadFile');
		if (!!~uf.className.indexOf('file-over')) {
			uf.className = uf.className.replace(' file-over', '');
		}
		e.originalEvent.dataTransfer.dropEffect = 'copy';
		// console.log(e)
		// console.log(e.originalEvent.dataTransfer.files[0])
		// console.log(template)

		let uploadInstance = fileCollection.insert({
			file: e.originalEvent.dataTransfer.files[0],
			meta: {},
			streams: 'dynamic',
			chunkSize: 'dynamic',
			allowWebWorkers: false
		});
	}
})