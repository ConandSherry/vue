'use strict';
// var request = require('request');

var logger = global.obj.logger;
var urlCfg = global.obj.urlCfg;

var Authentication = require('../utils/authentication');

var providerUtil = require('../utils/providerUtil');
var ProviderUtil = new providerUtil("controllerProvider");
var request = ProviderUtil.request;

var ResponseError = require('../utils/responseUtil').model;

module.exports = function(app) {
	//	create cluster
	app.post('/cluster', Authentication.ensureAuthenticated, ProviderUtil.parseProviderUrl, function(req, res, next) {
		req.body.user_id = req.session.userid;
		var options = {
			url: ProviderUtil.rebuildUrl(global.obj.controller_url + urlCfg.controller_api.cluster),
			method: 'POST',
			json: true,
			body: req.body,
			headers: {
				'X-Auth-Token': req.session.token
			}
		};
		var callback = function(error, response, body) {
			if (error || response.statusCode >= 400) {
				logger.error('Error creating cluster :', error ? error.errno : response.statusCode, body);
				next(new ResponseError(error, response, body));
			} else {
				logger.trace('Created cluster', body);
				res.status(200).send(body);
			}
		};
		logger.trace("Start to create cluster by request" + options.url);
		request(options, callback);
	});

	//send email
	app.post('/cluster/:clusterid/email', Authentication.ensureAuthenticated, ProviderUtil.parseProviderUrl, function(req, res, next) {
		var options = {
			url: ProviderUtil.rebuildUrl(global.obj.controller_url + urlCfg.controller_api.cluster + req.params.clusterid + '/email'),
			method: 'POST',
			json: true,
			body: req.body,
			headers: {
				'X-Auth-Token': req.session.token
			}
		};
		var callback = function(error, response, body) {
			if (error || response.statusCode >= 400) {
				logger.error('Error creating cluster :', error ? error.errno : response.statusCode, body);
				next(new ResponseError(error, response, body));
			} else {
				logger.trace('Created cluster', body);
				res.status(200).send(body);
			}
		};
		logger.trace("Start to create cluster by request" + options.url);
		request(options, callback);
	});

	//	list cluster
	app.get('/cluster', function(req, res, next) {
		//user_id
		if(req.query.status=='unterminated'){
			req.query.status=['INSTALLING','RUNNING','FAILED','TERMINATING','DELETING','MODIFYING']
		}else{
			req.query.status=[req.query.status];
		}
		Promise.all([db.collection('cluster').count({
			status:{
				$in:req.query.status
			}
		}),db.collection('cluster').find({
			status:{
				$in:req.query.status
			}
		}).sort({'time_create':1}).skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit)).toArray()]).then(function(data){
			res.status(200).send({
				data:data[1],
				count:data[0]
			})
		}).catch(function(err){
			res.status(500).send(err)
		});
	});
	//query cluster
	app.get('/cluster/:clusterid', Authentication.ensureAuthenticated, ProviderUtil.parseProviderUrl, function(req, res, next) {
		var options = {
			url: ProviderUtil.rebuildUrl(global.obj.controller_url + urlCfg.controller_api.cluster + req.params.clusterid),
			method: 'GET',
			json: true,
			headers: {
				'X-Auth-Token': req.session.token
			}
		};
		var callback = function(error, response, body) {
			if (error || response.statusCode >= 400) {
				logger.error('Error querying cluster :', error ? error.errno : response.statusCode, body);
				next(new ResponseError(error, response, body));
			} else {
				logger.trace('Queryed cluster', body);
				res.status(200).send(body);
			}
		};
		logger.trace("Start to query cluster by request" + options.url);
		request(options, callback);
	});

	// delete single cluster
	app.delete('/cluster/:clusterid', Authentication.ensureAuthenticated, ProviderUtil.parseProviderUrl, function(req, res, next) {
		var options = {
			url: ProviderUtil.rebuildUrl(global.obj.controller_url + urlCfg.controller_api.cluster + req.params.clusterid),
			method: 'DELETE',
			json: true,
			headers: {
				'X-Auth-Token': req.session.token
			}
		};
		var callback = function(error, response, body) {
			if (error || response.statusCode >= 400) {
				logger.error('Error deleteing cluster:', error ? error.errno : response.statusCode, body);
				next(new ResponseError(error, response, body));
			} else {
				logger.trace('Deleted cluster', body);
				res.status(200).send(body);
			}
		};
		logger.trace("Start to delete cluster by request " + options.url);
		request(options, callback);
	});

	// add node
	app.post('/cluster/:clusterid/hosts', Authentication.ensureAuthenticated, ProviderUtil.parseProviderUrl, function(req, res, next) {
		var options = {
			url: ProviderUtil.rebuildUrl(global.obj.controller_url + urlCfg.controller_api.cluster + req.params.clusterid + '/hosts'),
			method: 'POST',
			json: true,
			body: req.body,
			headers: {
				'X-Auth-Token': req.session.token
			}
		};
		var callback = function(error, response, body) {
			if (error || response.statusCode >= 400) {
				logger.error('Error creating cluster :', error ? error.errno : response.statusCode, body);
				next(new ResponseError(error, response, body));
			} else {
				logger.trace('Created cluster', body);
				res.status(200).send(body);
			}
		};
		logger.trace("Start to create cluster by request" + options.url);
		request(options, callback);
	});

	//delete node
	app.delete('/cluster/:clusterid/hosts', Authentication.ensureAuthenticated, ProviderUtil.parseProviderUrl, function(req, res, next) {
		var options = {
			url: ProviderUtil.rebuildUrl(global.obj.controller_url + urlCfg.controller_api.cluster + req.params.clusterid + '/hosts'),
			method: 'DELETE',
			json: true,
			body: req.body,
			headers: {
				'X-Auth-Token': req.session.token
			}
		};
		var callback = function(error, response, body) {
			if (error || response.statusCode >= 400) {
				logger.error('Error deleteing cluster:', error ? error.errno : response.statusCode, body);
				next(new ResponseError(error, response, body));
			} else {
				logger.trace('Deleted cluster', body);
				res.status(200).send(body);
			}
		};
		logger.trace("Start to delete cluster by request " + options.url);
		request(options, callback);
	});
	//list node
	app.get('/cluster/:clusterid/hosts', Authentication.ensureAuthenticated, ProviderUtil.parseProviderUrl, function(req, res, next) {
		var options = {
			url: ProviderUtil.rebuildUrl(global.obj.controller_url + urlCfg.controller_api.cluster + req.params.clusterid + '/hosts?sort=-time_update&status=unterminated&count=' + req.query.count + '&skip=' + req.query.skip + '&limit=' + req.query.limit),
			method: 'GET',
			json: true,
			headers: {
				'X-Auth-Token': req.session.token
			}
		};
		var callback = function(error, response, body) {
			if (error || response.statusCode >= 400) {
				logger.error('Error querying cluster:', error ? error.errno : response.statusCode, body);
				next(new ResponseError(error, response, body));
			} else {
				logger.trace('Queryed cluster', body);
				res.status(200).send(body);
			}
		};
		logger.trace("Start to query node by request " + options.url);
		request(options, callback);
	});
	app.get('/cluster/:clusterid/hosts/:hostid', Authentication.ensureAuthenticated, ProviderUtil.parseProviderUrl, function(req, res, next) {
		var options = {
			url: ProviderUtil.rebuildUrl(global.obj.controller_url + urlCfg.controller_api.cluster + req.params.clusterid + '/hosts/' + req.params.hostid),
			method: 'GET',
			json: true,
			headers: {
				'X-Auth-Token': req.session.token
			}
		};
		var callback = function(error, response, body) {
			if (error || response.statusCode >= 400) {
				logger.error('Error querying nodes:', error ? error.errno : response.statusCode, body);
				next(new ResponseError(error, response, body));
			} else {
				logger.trace('Queryed nodes', body);
				res.status(200).send(body);
			}
		};
		logger.trace("Start to query nodes by request " + options.url);
		request(options, callback);
	});
	app.get('/cluster/:clusterid/hosts/:hostid', Authentication.ensureAuthenticated, ProviderUtil.parseProviderUrl, function(req, res, next) {
		var options = {
			url: ProviderUtil.rebuildUrl(global.obj.controller_url + urlCfg.controller_api.cluster + req.params.clusterid + '/hosts/' + req.params.hostid),
			method: 'GET',
			json: true,
			headers: {
				'X-Auth-Token': req.session.token
			}
		};
		var callback = function(error, response, body) {
			if (error || response.statusCode >= 400) {
				logger.error('Error querying node:', error ? error.errno : response.statusCode, body);
				next(new ResponseError(error, response, body));
			} else {
				logger.trace('Queryed node', body);
				res.status(200).send(body);
			}
		};
		logger.trace("Start to query node by request " + options.url);
		request(options, callback);
	});
	app.get('/containers?', Authentication.ensureAuthenticated, function(req, res, next) {
		var options = {
			url: ProviderUtil.rebuildUrl(req.query.clientAddr + urlCfg.dcosclient_api.container + '?host_ip=' + req.query.host_ip),
			method: 'GET',
			json: true,
			headers: {
				'X-Auth-Token': req.session.token
			}
		};
		var callback = function(error, response, body) {
			if (error || response.statusCode >= 400) {
				logger.error('Error query node containers:', error ? error.errno : response.statusCode, body);
				next(new ResponseError(error, response, body));
			} else {
				logger.trace('Query node containers', body);
				res.status(200).send(body);
			}
		};
		logger.trace("Start to query node containers " + options.url);
		request(options, callback);
	});
	app.get('/clusterValidate', Authentication.ensureAuthenticated, ProviderUtil.parseProviderUrl, function(req, res, next) {
		var userid = req.session.userid;
		var options = {
			url: ProviderUtil.rebuildUrl(global.obj.controller_url + urlCfg.controller_api.validateCluster + '?clustername=' + req.query.clustername + '&userid=' + userid),
			method: 'GET',
			json: true,
			headers: {
				'X-Auth-Token': req.session.token
			}
		};
		var callback = function(error, response, body) {
			if (error || response.statusCode >= 400) {
				logger.error('Error query cluster name:', error ? error.errno : response.statusCode, body);
				next(new ResponseError(error, response, body));
			} else {
				logger.trace('Query cluster name', body);
				res.status(200).send(body);
			}
		};
		logger.trace("Start to query cluster name " + options.url);
		request(options, callback);
	});
}
