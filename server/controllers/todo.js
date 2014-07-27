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

	removelist: function(req, res, next) {
		// get user from username
		User.findOne({ 'local.username': req.body.username }, function(err, user) {
			if (err) {
				res.send(500, err);
			}
			else if (!user) {
				res.send(400, 'User not found.  A valid user is needed to create a list');
			}
			else {
				// remove list
				Todo.remove({ 'userId': user._id, '_id': req.body.listId }, function(err) {
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

						Todo.update({ '_id': list._id }, { $push: { listItems: listItem } }, function(err) {
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
	},

	removeitem: function(req, res, next) {
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
				Todo.findOne({ 'userId': user._id, '_id': req.body.listId }, function(err, list) {
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

						Todo.update({ _id: list._id }, { $pull: { listItems: { _id: req.body.itemId } } }, function(err) {
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
	},

	getlist: function(req, res, next) {		
		// get userid from username
		User.findOne({ 'local.username': req.body.username }, function(err, user) {
			if (err) {
				res.send(500, err);
			}
			else if (!user) {
				res.send(400, 'User not found.  A valid user is needed to retrieve a list');
			}
			else {
				// get list from username and listname
				Todo.findOne({ 'userId': user._id, '_id': req.body.listId }, function(err, list) {
					if (err) {
						res.send(500, err);
					}
					else if (!list) {
						res.send(400, 'List not found.  Check list name and try again');
					}
					else {
						res.json(200, list);
					}
				});
			}
		});
	},

	getlistnames: function(req, res, next) {
		// get userid from username
		User.findOne({ 'local.username': req.body.username }, function(err, user) {
			if (err) {
				res.send(500, err);
			}
			else if (!user) {
				res.send(400, 'User not found.  A valid user is needed to retrieve a list');
			}
			else {
				// get list from username and listname
				Todo.find({ 'userId': user._id }, { 'listItems': 0 }, function(err, lists) {
					if (err) {
						res.send(500, err);
					}
					else if (!lists) {
						res.send(400, 'No lists found.');
					}
					else {
						res.json(200, lists);
					}
				});
			}
		});
	}
};