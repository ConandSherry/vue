require('bootstrap')
const Vuex = require('vuex')
const VueResource = require('vue-resource');
const VueI18n = require('vue-i18n');
const VueValidator = require('vue-validator');
const VueRouter = require('vue-router');
import store from './vuex/store'
Vue.use(VueI18n);
Vue.use(VueResource);
Vue.use(VueValidator);
Vue.use(VueRouter);

Vue.http.interceptors.push((request, next)  => {
	router.app.$store.state.loading++;
    next((response) => {
        router.app.$store.state.loading--;
    });
});

Vue.locale('en', function() {
	return Promise.resolve(require('./locales/en.json'))
});
Vue.locale('zh', function() {
	return Promise.resolve(require('./locales/zh.json'))
}, function() {
	Vue.config.lang = 'zh'
});

let App = Vue.extend({
	store
})
// var router = new VueRouter({
// 	hashbang:false,
// 	history:true
// });
var router = new VueRouter({
	hashbang:true,
	history:false
});
router.map({
	'/index': {
		component: function(resolve) {
			require(["./components/index.vue"], resolve)
		},
		subRoutes: {
			'/node': {
				name: 'node',
				component: function(resolve) {
					require(["./components/node.vue"], resolve)
				}
			},
			'/service': {
				name: 'service',
				component: function(resolve) {
					require(["./components/log.vue"], resolve)
				}
			},
			'/network': {
				name: 'network',
				component: function(resolve) {
					require(["./components/network.vue"], resolve)
				}
			},
			'/framework': {
				name: 'framework',
				component: function(resolve) {
					require(["./components/log.vue"], resolve)
				}
			},
			'/log': {
				name: 'log',
				component: function(resolve) {
					require(["./components/log.vue"], resolve)
				}
			},
			'/monitor': {
				name: 'monitor',
				component: function(resolve) {
					require(["./components/log.vue"], resolve)
				}
			},
			'/configuration/key': {
				name: 'keypair',
				component: function(resolve) {
					require(["./components/configuration.vue"], resolve)
				}
			},
			'/configuration/smtp': {
				name: 'smtp',
				component: function(resolve) {
					require(["./components/configuration.vue"], resolve)
				}
			},
			'/configuration/provider': {
				name: 'provider',
				component: function(resolve) {
					require(["./components/configuration.vue"], resolve)
				}
			},
			'/configuration/dockerregistries': {
				name: 'dockerregistries',
				component: function(resolve) {
					require(["./components/configuration.vue"], resolve)
				}
			},
			'/user': {
				name: 'user',
				component: function(resolve) {
					require(["./components/user.vue"], resolve)
				}
			},
			'/profile': {
				name: 'profile',
				component: function(resolve) {
					require(["./components/profile.vue"], resolve)
				}
			}
		}
	},
	'/login': {
		name: 'login',
		component: function(resolve) {
			require(["./components/login.vue"], resolve)
		}
	}
});
router.beforeEach(function (transition) {
	if(Cookies.get('username')){
		if(transition.to.path==='/login'){
			router.go({
				name:'node'
				})
		}else{
			transition.next()
		}
	}else{
		if(transition.to.path==='/login'){
			transition.next()
		}else{
			router.go({
			  name: 'login'
			})
		}
	}
});
router.redirect({
	'/index':'/index/node',
	'*':"/index/node"
});
router.start(App, 'body')
