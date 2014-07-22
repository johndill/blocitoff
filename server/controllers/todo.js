var Todo = require('../models/todo.js');
var User = require('../models/user.js');

module.exports = {
	newlist: function(req, res, next) {
		// get user from username
		var userId;
		User.findOne({ 'local.username': req.body.username }, function(err, user) {
			if (err) {
				res.send(500, err);
			}
			else if (!user) {
				res.send(400, 'User not found.  A valid user is needed to create a list');
			}
			else {
				userId = user._id;

				// create new list
				var listToCreate = new Todo();
				
				listToCreate.userId = userId;
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
	}
};