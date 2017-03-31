import { fileCollection } from '../lib/file-collection.js';

Meteor.publish('files', function () {
	return fileCollection.find().cursor;
});

Meteor.publish('file', function (id) {
	return fileCollection.find({_id: id}).cursor;
});