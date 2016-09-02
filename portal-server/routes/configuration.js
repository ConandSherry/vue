'use strict';
var ObjectId = require('mongodb').ObjectID;
module.exports = function(app) {
	app.get('/keypair', (req, res, next) => {
		Promise.all([db.collection('pubkey').count({}), db.collection('pubkey').find({}).sort({
			'time_create': -1
		}).skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit)).toArray()]).then((data) => {
			res.status(200).send({
				data: data[1],
				count: data[0]
			})
		}).catch((err) => {
			res.status(500).send(err)
		})
	});
	app.post('/keypair/upload', function(req, res, next) {
		db.collection('pubkey').insert(req.body).then(
			res.status(200).send("success")
		).catch((err) => {
			res.status(500).send(err)
		})
	});
	app.post('/keypair/create', (req, res, next) => {
		req.body.pubkeyValue = "asdasdasdasda";
		db.collection('pubkey').insert(req.body).then(
			(data) => {
				res.status(200).send({
					data: data.ops[0]._id
				})
			}).catch((err) => {
			res.status(500).send(err)
		})
	});
	app.get('/keypair/download/:id', function(req, res, next) {
		db.collection('pubkey').find({
			_id: ObjectId(req.params.id)
		}).toArray().then((data) => {
			res.set('Content-Type', 'application/octet-stream')
			res.status(200).send({
				data: data
			})
		}).catch((err) => {
			res.status(500).send(err)
		})
	});
	app.delete('/keypair/:id', (req, res, next) => {
		db.collection('pubkey').remove({
			'_id': ObjectId(req.params.id)
		}).then(
			res.status(200).send("success")
		).catch((err) => {
			res.status(500).send(err)
		});
	});
	app.route('/smtp')
		.get((req, res, next) => {
			Promise.all([db.collection('smtp').count({}), db.collection('smtp').find({}).sort({
				'time_create': -1
			}).skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit)).toArray()]).then((data) => {
				res.status(200).send({
					data: data[1],
					count: data[0]
				})
			}).catch((err) => {
				res.status(500).send(err)
			})
		})
		.post((req, res, next) => {
			db.collection('smtp').insert(req.body).then(
				res.status(200).send("success")
			).catch((err) => {
				res.status(500).send(err)
			})
		});
	app.route('/smtp/:id')
		.put((req, res, next) => {
			delete req.body._id;
			db.collection('smtp').updateOne({
				'_id': ObjectId(req.params.id)
			}, req.body).then(
				res.status(200).send("success")
			).catch((err) => {
				res.status(500).send(err)
			})
		})
		.delete((req, res, next) => {
			db.collection('smtp').remove({
				'_id': ObjectId(req.params.id)
			}).then(
				res.status(200).send("success")
			).catch((err) => {
				res.status(500).send(err)
			})
		});
	app.route('/provider')
		.get((req, res, next) => {
			Promise.all([db.collection('provider').count({}), db.collection('provider').find({}).sort({
				'time_create': -1
			}).skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit)).toArray()]).then(function(data) {
				res.status(200).send({
					data: data[1],
					count: data[0]
				})
			}).catch((err) => {
				res.status(500).send(err)
			})
		})
		.post((req, res, next) => {
			db.collection('provider').insert(req.body).then(
				res.status(200).send("success")
			).catch((err) => {
				res.status(500).send(err)
			})
		});
	app.get('/provider/validate', (req, res, next) => {
		db.collection('provider').count({
			'name': req.query.provider_name
		}).then((data) => {
			if (!data) {
				res.status(200).send('susscess')
			} else {
				res.status(500).send('error')
			}
		}).catch((err) => {
			res.status(500).send(err)
		})
	});
	app.route('/provider/:id')
		.get((req, res, next) => {
			db.collection('provider').find({
				'_id': ObjectId(req.params.id)
			}).toArray().then((data) => {
				res.status(200).send({
					data: data[0]
				})
			}).catch((err) => {
				res.status(500).send(err)
			})
		})
		.put((req, res, next) => {
			delete req.body._id;
			db.collection('provider').updateOne({
				'_id': ObjectId(req.params.id)
			}, req.body).then(
				res.status(200).send("success")
			).catch((err) => {
				res.status(500).send(err)
			})
		})
		.delete((req, res, next) => {
			db.collection('provider').remove({
				'_id': ObjectId(req.params.id)
			}).then(
				res.status(200).send("success")
			).catch((err) => {
				res.status(500).send(err)
			})
		});
	app.route('/dockerregistries')
		.get((req, res, next) => {
			Promise.all([db.collection('dockerregistry').count({}), db.collection('dockerregistry').find({}).sort({
				'time_create': -1
			}).skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit)).toArray()]).then(function(data) {
				res.status(200).send({
					data: data[1],
					count: data[0]
				})
			}).catch((err) => {
				res.status(500).send(err)
			})
		})
		.post((req, res, next) => {
			db.collection('dockerregistry').insert(req.body).then(
				res.status(200).send("success")
			).catch((err) => {
				res.status(500).send(err)
			})
		});
	app.route('/dockerregistries/:id')
		.delete((req, res, next) => {
			db.collection('dockerregistry').remove({
				'_id': ObjectId(req.params.id)
			}).then(
				res.status(200).send("success")
			).catch((err) => {
				res.status(500).send(err)
			})
		});
	app.get('/dockerregistries/registryValidate', (req, res, next) => {
		db.collection('dockerregistry').count({
			'name': req.query.name
		}).then((data) => {
			if (!data) {
				res.status(200).send('susscess')
			} else {
				res.status(500).send('error')
			}
		}).catch((err) => {
			res.status(500).send(err)
		});
	});
};
