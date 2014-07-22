var Todo = require('../models/todo.js');
var User = require('../models/user.js');

module.exports = {
	newlist: function(req, res, next) {
		// get user from username
		User.findOne({ 'local.username': req.body.username }, function(err, user) {
			if (err) {
				res.send(500, err);
			}
			else if (!user) {
				res.send(400, 'User not found.  A valid user is needed to create a list');
			}
			else {
				// create new list
				var listToCreate = new Todo();
				
				listToCreate.userId = user._id;
				listToCreate.listName = req.body.listName;

				listToCreate.save(function(err) {
					if (err) {
						next(err);
					}
					else {
						res.send(200);
					}
				});
			}
		});
	}, 

	additem: function(req, res, next) {
		// add item to list, based on username and listname
		
		// get userid from username
		User.findOne({ 'local.username': req.body.username }, function(err, user) {
			if (err) {
				res.send(500, err);
			}
			else if (!user) {
				res.send(400, 'User not found.  A valid user is needed to create a list');
			}
			else {
				// get list from username and listname
				Todo.findOne({ 'userId': user._id, 'listName': req.body.listName }, function(err, list) {
					if (err) {
						res.send(500, err);
					}
					else if (!list) {
						res.send(400, 'List not found.  Check list name and try again');
					}
					else {
						// add item to list
						var listItem = {
							text: req.body.text,
							created: new Date()
						}

						Todo.update({ _id: list._id }, { $push: { listItems: listItem } }, function(err) {
							if (err) {
								next(err);
							}
							else {
								res.send(200);
							}
						});
					}
				});
			}
		});
	}
};