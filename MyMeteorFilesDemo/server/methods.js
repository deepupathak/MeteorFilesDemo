import { fileCollection } from '../lib/file-collection.js';

Meteor.methods({
	fileDelete(id){
		fileCollection.remove({_id: id});
	}
})