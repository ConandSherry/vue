'use strict';
// var request = require('request');
var ObjectId = require('mongodb').ObjectID;
var urlCfg = global.obj.urlCfg;
var linkerConf = global.obj.dcosCfg;

var logger = require('../utils/logger');

var Authentication = require('../utils/authentication');

var providerUtil = require('../utils/providerUtil');

var ProviderUtil = new providerUtil("identityProvider");
var request = ProviderUtil.request;

var ResponseError = require('../utils/responseUtil').model;

module.exports = function(app) {
    app.route('/user')
        .get((req, res, next)=> {
            Promise.all([db.collection('user').count({}),db.collection('user').find({}).sort({'time_update':-1}).skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit)).toArray()]).then((data)=>{
                res.status(200).send({
                    data:data[1],
                    count:data[0]
                })
            }).catch((err)=>{
                res.status(500).send(err)
            })
        })
        .post((req, res, next)=> {
            db.collection('user').insert(req.body).then(
                res.status(200).send("success")
            ).catch((err)=>{
                res.status(500).send(err)
            })
        });
    app.get('/user/validate',(req, res, next)=> {
        db.collection('user').count({'username':req.query.username}).then((data)=>{
            if(!data){
				res.status(200).send('susscess')
			}else{
				res.status(500).send('error')
			}
        }).catch((err)=>{
			res.status(500).send(err)
		})
    });
    app.route('/user/:id')
        .put((req, res, next)=> {
            delete req.body._id;
            db.collection('user').updateOne({'_id':ObjectId(req.params.id)},req.body).then(
                res.status(200).send("success")
            ).catch((err)=>{
                res.status(500).send(err)
            })
        })
        .delete((req, res, next)=> {
            db.collection('user').remove({'_id':ObjectId(req.params.id)}).then(
    			res.status(200).send("success")
    		).catch((err)=>{
    			res.status(500).send(err)
    		});
        });
    app.get('/user/profile', Authentication.ensureAuthenticated, ProviderUtil.parseProviderUrl, function(req, res, next) {
        var options = {
            url: ProviderUtil.rebuildUrl(global.obj.identity_url + urlCfg.user_api.get + req.session.userid),
            method: 'GET',
            json: true,
            headers: {
                'X-Auth-Token': req.session.token
            }
        };
        var callback = function(error, response, body) {
            if (error || response.statusCode >= 400) {
                logger.error('Error get user information:', error ? error.errno : response.statusCode, body);
                next(new ResponseError(error, response, body));
            } else {
                logger.trace('Get user information', body);
                res.status(200).send(body);
            }
        };
        request(options, callback);
    });
    app.put('/user/profile/changepassword', Authentication.ensureAuthenticated, ProviderUtil.parseProviderUrl, function(req, res, next) {
        var options = {
            url: ProviderUtil.rebuildUrl(global.obj.identity_url + urlCfg.user_api.password + req.session.userid),
            method: 'PUT',
            json: true,
            headers: {
                'X-Auth-Token': req.session.token
            },
            body: req.body
        };
        var callback = function(error, response, body) {
            if (error || response.statusCode >= 400) {
                logger.error('Error update user password:', error ? error.errno : response.statusCode, body);
                next(new ResponseError(error, response, body));
            } else {
                logger.trace('Updated user password', body);
                res.status(200).send(body);
            }
        };
        request(options, callback);
    });

};
