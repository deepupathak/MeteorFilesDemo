import { FilesCollection } from 'meteor/ostrio:files';

export const fileCollection = new FilesCollection({
	collectionName: 'files',
	allowClientCode: true,
	downloadRoute: '/files/',
	storagePath: 'assets/files/'
});

if (Meteor.isServer) {
	fileCollection.deny({
		insert: function() {
			return false;
		},
		update: function() {
			return true;
		},
		remove: function() {
			return false;
		}
	});
	
	fileCollection.allow({
    insert: function() {
      return true;
    },
    update: function() {
      return false;
    },
    remove: function() {
      return true;
    }
  });
}