'use strict';
var ObjectId = require('mongodb').ObjectID;
module.exports = function(app) {
	app.route('/network')
		.get((req, res, next)=>{
			Promise.all([db.collection('network').count({'clusterId':req.query.clusterid,'network.internal':req.query.internal}),db.collection('network').find({'clusterId':req.query.clusterid,'network.internal':req.query.internal}).sort({'time_create':1}).skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit)).toArray()]).then((data)=>{
	            res.status(200).send({
	                data:data[1],
	                count:data[0]
	            })
	        }).catch((err)=>{
	            res.status(500).send(err)
	        })
		})
		.post((req, res, next)=> {
			db.collection('network').insert(req.body).then(
				res.status(200).send("success")
			).catch((err)=>{
				res.status(500).send(err)
			})
		})
		.delete((req, res, next)=> {
			db.collection('network').remove({'clusterId':req.query.clusterid}).then(
				res.status(200).send("success")
			).catch((err)=>{
				res.status(500).send(err)
			});
		});
	app.delete('/network/:networkid',(req, res, next)=> {
		db.collection('network').remove({'_id':ObjectId(req.params.networkid)}).then(
			res.status(200).send("success")
		).catch((err)=>{
			res.status(500).send(err)
		});
	});
	app.get('/network/validate', (req, res, next)=> {
		db.collection('network').count({'user_name':req.query.username,'network.name':req.query.networkname}).then((data)=>{
			if(!data){
				res.status(200).send('susscess')
			}else{
				res.status(500).send('error')
			}
		}).catch((err)=>{
			res.status(500).send(err)
		})
	});
};
