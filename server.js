global.obj = {};
const express = require('express'),
	path = require('path'),
	fs = require('fs'),
	reload = require('reload'),
	http = require('http'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	bodyParser = require('body-parser'),
	compression = require('compression'),
	config = require('konphyg')(path.resolve(path.dirname(__dirname), './vue_rebuild/portal-server/conf')),
	app = express(),
	port = 3000;

var MongoClient = require ('mongodb').MongoClient;
MongoClient.connect('mongodb://192.168.10.119:27017/linker_dcos',function(err,db){
    global.db=db
})


var dcosCfg = global.obj.dcosCfg = config('linker-dcos');
var logger = global.obj.logger = require('./portal-server/utils/logger');
var responseError = require('./portal-server/utils/responseUtil');
var ZkUtil = require('./portal-server/utils/zkUtil');
global.obj.urlCfg = config('url');

const server = http.createServer(app);

if(dcosCfg.controllerProvider.ha.enabled) {
	global.obj.zkUtil_controller = new ZkUtil(dcosCfg.controllerProvider.ha.zookeeper_url, "controllerProvider");
};
if(dcosCfg.identityProvider.ha.enabled) {
	global.obj.zkUtil_identity = new ZkUtil(dcosCfg.identityProvider.ha.zookeeper_url, "identityProvider");
}
var sessionStore;

const webpack = require('webpack'),
	webpackDevMiddleware = require('webpack-dev-middleware'),
	webpackHotMiddleware = require('webpack-hot-middleware'),
	webpackDevConfig = require('./webpack.config.js');

const compiler = webpack(webpackDevConfig);

app.use(webpackDevMiddleware(compiler, {
	publicPath: webpackDevConfig.output.publicPath,
	noInfo: true,
	stats: {
		colors: true
	}
}));
app.use(webpackHotMiddleware(compiler));
app.use(compression());
app.use(cookieParser());

const staticPath = path.resolve(__dirname, 'portal-ui');
app.use(express.static(staticPath));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
	next();
});

if(dcosCfg.ha.enabled) {
	console.log('HA is enabled, setting up Redis for session store');
	var RedisStore = require('connect-redis')(session);
	sessionStore = new RedisStore(dcosCfg.ha.redis.options);
} else {
	logger.info('Without HA, using MemoryStore');
	var MemoryStore = session.MemoryStore;
	sessionStore = new MemoryStore();
}

app.use(session({
	key: 'JSESSIONID',
	store: sessionStore,
	secret: "aaa",
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: false,
		maxAge: 3600000
	},
	rolling: true
}));

fs.readdirSync(path.join(__dirname, 'portal-server', 'routes')).forEach(function(file) {
	if(file[0] === '.') {
		return;
	}
	require(path.join(__dirname, 'portal-server', 'routes', file))(app);
});

app.use(responseError.handler());

app.use(function(err, req, res, next) {
	if(!err) {
		return next();
	}
	logger.error('Uncaught error', err, req.path);
	res.status(500).send();
});

// app.use("/index/configuration/",express.static(__dirname + "/portal-ui"))
// app.use("/index/", express.static(__dirname + "/portal-ui"));
//
// app.get('/index/*', function(req, res) {
// 	res.sendFile(__dirname + "/portal-ui/index.html");
// });

reload(server, app);

server.listen(port, function() {
	console.log('App (dev) is now running on port 3000!');
});
