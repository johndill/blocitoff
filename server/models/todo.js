var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = new Schema({
	userId: Schema.ObjectId,
	listName: String,
	listItems: [{
		text: String,
		created: Date
	}]
});

module.exports = mongoose.model('Todo', todoSchema);