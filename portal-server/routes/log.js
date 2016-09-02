'use strict';
module.exports = function(app) {
	app.get('/logs',(req, res, next)=>{
        Promise.all([db.collection('log').count({clusterId:req.query.clusterid}),db.collection('log').find({clusterId:req.query.clusterid}).sort({'time_create':1}).skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit)).toArray()]).then((data)=>{
            res.status(200).send({
                data:data[1],
                count:data[0]
            })
        }).catch((err)=>{
            res.status(500).send(err)
        })
	});
};
