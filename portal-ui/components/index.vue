<template>
	<loading></loading>
	<component :is="activeComponent" :passdata="createDepData"></component>
	<div style="padding-bottom:3000px;overflow:hidden;" class="col-xs-2 col-md-2 left-nav">
		<div class="user-icon-display-area">
			<img src="/img/user.png" style="width:30px;"></img>
		</div>
		<div class="user-font-display-area">
			<span>
				{{username}}
            </span>
		</div>
		<div class="user-action-display-area">
			<img src="/img/settings.png" @click="profile" data-toggle="tooltip" placement="bottom" :data-original-title="$t('common.edit')" style="width:20px;cursor:pointer;"></img>
			&nbsp;
			<img src="/img/logout.png" @click="logout" data-toggle="tooltip" placement="bottom" :data-original-title="$t('common.logout')" style="width:17px;cursor:pointer;"></img>
		</div>
		<div class="user-language-display-area">
			<span @click="changeLang('zh')" :class="{language:true,active:currentLangName=='zh'}">中文</span> | <span @click="changeLang('en')" :class="{language:true,active:currentLangName=='en'}">English</span>
		</div>
		<ul style="margin-bottom: 100px;" class="nav nav-pills nav-stacked">
			<li role="presentation" :class="{active: selectRouter('node')}">
				<a v-link="{name:'node'}"><span class="glyphicon glyphicon-tasks" aria-hidden="true"></span> <span style="width:50%">{{$t('common.node')}}</span></a>
			</li>
			<li role="presentation" :class="{active: selectRouter('network')}">
				<a v-link="{name:'network'}"><span class="glyphicon glyphicon-globe" aria-hidden="true"></span> <span style="width:50%">{{$t('common.network')}}</span></a>
			</li>
			<li role="presentation" :class="{active: selectRouter('log')}">
				<a v-link="{name:'log'}"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span> <span style="width:50%">{{$t('common.log')}}</span></a>
			</li>
			<li role="presentation" :class="{active: selectRouter('keypair','smtp','provider','dockerregistries')}">
				<a v-link="{name:'keypair'}"><span class="glyphicon glyphicon-wrench" aria-hidden="true"></span><span style="width:50%"> {{$t('common.configuration')}}</span></a>
			</li>
			<li role="presentation" :class="{active: selectRouter('user')}" v-if='username=="sysadmin"'>
				<a v-link="{name:'user'}"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> <span style="width:50%">{{$t('common.user')}}</span></a>
			</li>
		</ul>
	</div>
	<div style="overflow:auto;max-height:100%;" class="col-xs-10 col-md-10 right-content" autoscroll>
		<div class="main-nav-header">
			<div class="pull-left">
				<h3>{{$t('common.'+$route.name)}}</h3>
			</div>
			<div class="pull-right btn-area">
				<label class="control-label" style="margin-right:10px;">{{$t('cluster.switch')}}</label>
				<select v-model="selectCluster" @change="changeCluster" class="form-control select-control-header input-sm" style="height:29px;">
					<option :value="item" v-for="item in clusters | orderBy 'name'" track-by="$index">{{item.name}}</option>
				</select>
				<button type="button" class="btn btn-info btn-sm" @click="getClusters"><i class="icon-refresh"></i>
					{{$t('cluster.switch')}}
	            </button>
				<div class="btn-group">
					<button type="button" class="btn btn-info btn-sm">{{$t('common.action')}}</button>
					<button type="button" class="btn btn-info btn-sm dropdown-toggle " data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<span class="caret"></span>
					    <span class="sr-only">Toggle Dropdown</span>
					</button>
					<ul class="dropdown-menu dropdown-menu-right" style="font-size:12px;">
						<li>
							<a @click="createCluster">
								<i class="icon-pencil"></i> {{$t('cluster.create')}}
							</a>
						</li>
						<li role="separator" class="divider"></li>
						<li>
							<a>
								<i class="icon-trash" :class="{'disabled-cursor':(deleteClusters.length== 0)}"></i> {{$t('cluster.delete')}}
							</a>
						</li>
					</ul>
				</div>

			</div>
		</div>
		<router-view></router-view>
	</div>
</template>
<script>
	import {
		setErrorsInfo,
		setErrors,
		setCluster
	} from '../vuex/actions'
	import {
		getError,
	} from '../vuex/getters'
	module.exports = {
		ready: function() {
			$('[data-toggle="tooltip"]').tooltip();
			this.getClusters()
		},
		compiled:function(){

		},
		computed: {
			activeComponent: function() {
				if(this.errors.show) {
					return 'error'
				} else if(this.create){
					return 'create'
				}else{
					return ''
				}
			}
		},
		vuex: {
			getters: {
				errors: getError,
			},
			actions: {
				setErrorsInfo,
				setCluster,
				setErrors
			}
		},
		events:{
			'close':function(){
				this.create=false
			}
		},
		data: function() {
			return {
				clusters:"",
				createDepData:'',
				create:false,
				username:Cookies.get('username'),
				currentLangName: Vue.config.lang,
				selectCluster:''
			};
		},
		components: {
			error: function(resolve) {
				require(["./common/error.vue"], resolve)
			},
			create:function(resolve){
				require(["./cluster/create.vue"],resolve)
			},
			loading:function(resolve){
				require(["./common/loading.vue"],resolve)
			}
		},
		methods: {
			createCluster:function(){
				let self=this;
				Promise.all([this.$http.get('/keypair?count=true&skip=0&limit=0'),this.$http.get('/provider?count=true&skip=0&limit=0'),this.$http.get('/dockerregistries?count=true&skip=0&limit=0')]).then(
					function(data){
						self.createDepData=data;
						self.create=true;
					},function(err){
						self.setErrorsInfo(err.data)
						self.setErrors(true)
					}
				)
			},
			changeCluster:function(){
				this.setCluster(this.selectCluster)
			},
			getClusters:function(){
				this.$http.get('/cluster?count=true&skip=&limit=&user_id=&status=unterminated').then(function(data){
					this.clusters=data.data.data;
					this.$broadcast('clusterCreate');
					if(!this.selectCluster){
						this.selectCluster=this.clusters[0]
						this.setCluster(this.selectCluster)
					}
				},function(err){
					this.setErrorsInfo(err.data)
					this.setErrors(true)
				})
			},
			profile:function(){
				this.$router.go({
					name:'profile'
				})
			},
			logout: function() {
				this.$http.get("/logout").then(function(response) {
					console.log("storage 重置")
					Cookies.expire('username');
					this.$router.go({
						name:'login'
						});
				}, function(err) {
					this.setErrorsInfo(err.data)
					this.setErrors(true)
				})
			},
			selectRouter: function(...name) {
				let self = this;
				for(let i in name) {
					if(name[i] == self.$route.name)
						return true
				}
				return false
			},
			changeLang: function(lang) {
				this.currentLangName = lang;
				Vue.config.lang = lang;
			}
		},

	}
</script>
