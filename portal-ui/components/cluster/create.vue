<template>
	<div class="modal fade" id="createData" tabindex="-1" role="dialog" aria-labelledby="create">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="myModalLabel">{{$t('common.create')}}</h4>
				</div>
				<div class="modal-body">
					<validator name="create-cluster">
						<form class="form-horizontal" novalidate>
							<label class="col-sm-offset-1 col-sm-10 form-border-bottom" style="padding-bottom:10px;">{{$t('cluster.providerInfo')}}</label>
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('cluster.providerType')}}</label>
								<div class="col-sm-6">
									<select class="form-control" v-model="cluster.type">
										<option :value="item.value" v-for="item in ClusterTypes" track-by="$index">{{$t('cluster.'+item.value)}}</option>
									</select>
								</div>
							</div>
							<div class="form-group" v-if="cluster.type!='customized'">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('cluster.providerAccount')}}</label>
								<div class="col-sm-6">
									<select class="form-control" v-model="cluster.providerId">
										<option :value="item._id" v-for="item in Providers" track-by="$index">{{item.name}}</option>
									</select>
									<span class="form-error" v-show="Providers.length==0">
										{{$t('cluster.providerNone')}}
									</span>
								</div>
							</div>
							<div class="form-group" v-if="cluster.type=='customized'">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.keypair')}}</label>
								<div class="col-sm-6">
									<textarea type="text" v-model="cluster.createNode.privateKey" class="form-control" :class="{'input-error':$createCluster.keypair&&$createCluster.keypair.invalid&&$createCluster.keypair.touched}" v-validate:keypair="{required:true}"></textarea>
									<span class="form-error" v-show="$createCluster.keypair.touched">
										<span v-show="$createCluster.keypair.required">{{$t('common.keypair')+$t('formError.required')}}</span>
									</span>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label">{{$t('common.dockerregistries')}}
									<span @click="toggleRegistrySelect" data-trigger="manual" data-toggle="popover" data-placement="right"  data-content= '<div id="aaa"></div>' data-html="true" data-template='<div class="popover" role="tooltip" style="margin-top:-25%"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>' v-show="Registries.length" style="border: none;box-shadow:none;cursor:pointer;position:absolute;top:5px;" class="glyphicon glyphicon-plus-sign glyphicon-action-add"></span>
								</label>
								<div class="col-sm-6" style="padding-top:7px;">
									<span class="form-error" v-show="Registries.length==0&&cluster.dockerRegistries.length==0">
										{{$t('cluster.registryNone')}}
									</span>
								</div>
							</div>
							<div style="margin: 0 -15px;">
								<template v-for="item in cluster.dockerRegistries" track-by="$index">
									<div class="form-group" style="margin-left: 0px;width:100%;">
										<label class="col-sm-4 control-label">Registry{{$index+1}}</label>
										<div class="col-sm-6">
											<input type="text" disabled v-model="item.name" class="form-control">
										</div>
										<div class="col-sm-1" style="padding:0">
											<span @click="popRegistry($index)" style="border:none;box-shadow:none;cursor:pointer;position:relative;top:12px;" class="glyphicon glyphicon-minus-sign glyphicon-action-remove"></span>
										</div>
									</div>
								</template>
							</div>
							<label class="col-sm-offset-1 col-sm-10 form-border-bottom" style="padding-bottom:10px;">{{$t('cluster.baseInfo')}}</label>
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('cluster.clusterName')}}</label>
								<div class="col-sm-6">
									<input type="text" v-model="cluster.name" class="form-control" :class="{'input-error':$createCluster.clusterName&&$createCluster.clusterName.invalid&&$createCluster.clusterName.touched}" v-validate:cluster-name="{required:true,maxlength:15,pattern:'/^$|^[A-Za-z0-9\\-]+$/',validateName:{rule:true,initial:'off'}}">
									<span class="form-error" v-show="$createCluster.clusterName.touched">
										<span v-show="$createCluster.clusterName.maxlength">{{$t('cluster.clusterName')+$t('formError.maxlength')}}</span>
										<span v-show="$createCluster.clusterName.required">{{$t('cluster.clusterName')+$t('formError.required')}}</span>
										<span v-show="$createCluster.clusterName.pattern">{{$t('cluster.clusterName')+$t('formError.pattern')}}</span>
										<span v-show="$createCluster.clusterName.validateName">{{$t('cluster.clusterName')+$t('formError.duplicate')}}</span>
									</span>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('cluster.clusterType')}}</label>
								<div class="col-sm-6">
									<label class="radio-inline">
										<input type="radio" v-model="cluster.createCategory" value="compact"> {{$t('cluster.Lite')}}
									</label>
									</br>
									<label class="radio-inline">
										<input type="radio" v-model="cluster.createCategory" value="ha">{{$t('cluster.HA')}}
									</label>
								</div>
							</div>
							<div v-if="cluster.type!='customized'">
								<label class="col-sm-offset-1 col-sm-10 form-border-bottom" style="padding-bottom:10px;">{{$t('cluster.nodeInfo')}}</label>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('cluster.extraNodeNumber')}}</label>
									<div class="col-sm-6">
										<input class="form-control" type="number" v-model="cluster.instances" style="display: inline-block;width:35%;" :class="{'input-error':$createCluster.instances&&$createCluster.instances.touched&&$createCluster.instances.invalid}" v-validate:instances="{required:true,min:0,pattern:'/^$|^([0]|[1-9]\\d*)$/'}">
										<div style="clear:both;"></div>
										<span class="form-error" v-show="$createCluster.instances.touched">
											<span v-show="$createCluster.instances.required">{{$t('cluster.extraNodeNumber')+$t('formError.required')}}</span>
											<span v-show="$createCluster.instances.pattern">{{$t('cluster.extraNodeNumber')+$t('formError.pattern')}}</span>
											<span v-show="$createCluster.instances.min">{{$t('cluster.extraNodeNumber')+$t('formError.min')}}</span>
										</span>
									</div>
								</div>
								<label class="col-sm-offset-1 col-sm-10 form-border-bottom" style="padding-bottom:10px;">{{$t('cluster.advancedSetting')}}</label>
								<div class="form-group">
									<label class="col-sm-4 control-label">{{$t('cluster.loginKey')}}</label>
									<div class="col-sm-6">
										<select class="form-control" v-model="cluster.pubkeyId">
											<option value="">-</option>
											<option value="{{item._id}}" v-for="item in LoginKeys" track-by="$index">{{item.name}}</option>
										</select>
									</div>
								</div>
							</div>
							<div v-if="cluster.type=='customized'">
								<label class="col-sm-offset-1 col-sm-10 form-border-bottom" style="padding-bottom:10px;">{{$t('cluster.nodeInfo') }}</label>
								<div class="form-group">
									<label class="col-sm-4 control-label">{{$t('common.node')}}
										<span @click="pushCluster()" style="border: none;box-shadow:none;cursor:pointer;margin:0px;positive:relative;top:5px;" class="glyphicon glyphicon-plus-sign glyphicon-action-add"></span>
									</label>
								</div>
								<div style="margin: 0 -15px;">
									<template v-for="item in cluster.createNode.nodes" track-by="$index">
										<div class="form-group" style="margin-left:0px;width:100%;background:#F0F0F0;padding:15px 0px;margin-bottom:0px;">
											<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('node.ipaddress')+($index+1)}}</label>
											<div class="col-sm-6">
												<input type="text"  v-model="item.ip" class="form-control" :class="{'input-error':$createCluster['ip'+($index+1)]&&$createCluster['ip'+($index+1)].invalid&&$createCluster['ip'+($index+1)].touched}" :field="'ip'+($index+1)" v-validate="{required:true,pattern:'/^$|^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)($|(?!\\.$)\\.)){4}$/'}">
												<span class="form-error" v-show="$createCluster['ip'+($index+1)].touched">
													<span v-show="$createCluster['ip'+($index+1)].required">{{$t('node.ipaddress')+($index+1)+$t('formError.pattern')}}</span>

													<span v-show="$createCluster['ip'+($index+1)].pattern">{{$t('node.ipaddress')+($index+1)+$t('formError.pattern')}}</span>
												</span>
											</div>
										</div>
										<div class="form-group" style="margin-left: 0px;width:100%;background:#F0F0F0;padding-bottom:15px;">
											<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.sshUser')+($index+1)}}</label>
											<div class="col-sm-6">
												<input type="text" v-model="item.sshUser" class="form-control" :class="{'input-error':$createCluster['sshuser'+($index+1)]&&$createCluster['sshuser'+($index+1)].invalid&&$createCluster['sshuser'+($index+1)].touched}" :field="'sshuser'+($index+1)" v-validate="{required:true,pattern:'/^$|^[a-zA-Z_](([a-zA-Z0-9_-]{0,30})|([a-zA-Z0-9_-]{0,29}[$]))$/'}" >
												<span class="form-error" v-show="$createCluster['sshuser'+($index+1)].touched">
													<span v-show="$createCluster['sshuser'+($index+1)].required">{{$t('common.sshUser')+($index+1)+$t('formError.required')}}</span>
													<span v-show="$createCluster['sshuser'+($index+1)].pattern">{{$t('common.sshUser')+($index+1)+$t('formError.pattern')}}</span>
												</span>
											</div>
											<div class="col-sm-1" style="padding:0">
												<span v-show="cluster.createNode.nodes.length!=5&&cluster.createCategory=='ha'" @click="popCluster($index)" style="border:none;box-shadow:none;cursor:pointer;position:relative;top:-16px;" class="glyphicon glyphicon-minus-sign glyphicon-action-remove" aria-hidden="true"></span>
												<span v-show="cluster.createNode.nodes.length!=3&&cluster.createCategory=='compact'" @click="popCluster($index)" style="border:none;box-shadow:none;cursor:pointer;position:relative;top:-16px;" class="glyphicon glyphicon-minus-sign glyphicon-action-remove" aria-hidden="true"></span>
											</div>
										</div>
									</template>
								</div>
								<label class="col-sm-offset-1 col-sm-10 form-border-bottom" style="padding-bottom:10px;">{{$t('cluster.advancedSetting')}}</label>
								<div class="form-group">
									<label class="col-sm-4 control-label">{{$t('node.networkAdapter')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="cluster.createNode.privateNicName" class="form-control">
									</div>
								</div>
							</div>
						</form>
					</validator>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" :disabled="$createCluster.invalid" @click="create">{{$t('common.create')}}</button>
					<button type="button" class="btn btn-default" @click="close">{{$t('common.cancel')}}</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import {
		getcluster
	} from '../../vuex/getters'
	import {
		setCurrentPage,
		setErrorsInfo,
		setErrors
	} from '../../vuex/actions'
	module.exports = {
		ready: function() {
			let html=`<span v-on:click="toggleRegistrySelect()" style="margin-bottom:7px;margin-top:-7px;border: none;box-shadow:none;cursor:pointer;position:relative;top:5px;" class="glyphicon glyphicon-remove glyphicon-action-remove pull-right"></span>
		  <div style="clear:both;max-height:120px;overflow-x:hidden;">
			  <table style="width:200px" class="table table-hover">
				  <tr v-for="item in Registries" track-by="$index">
					  <td>
						  <div v-on:click="pushRegistry($index)" style="cursor: pointer;">{{item.name}}</div>
					  </td>
				  </tr>
			  </table>
		  </div>`;
			$('#createData').modal({
				backdrop: 'static',
				show: true
			});
			let self=this;
			$('#createData').on('hidden.bs.modal',function(){
				self.$dispatch('close');
			});
			this.cluster.type="openstack";
			this.cluster.createCategory="compact";
			this.Registries=this.passdata[2].data.data;
			this.LoginKeys=this.passdata[0].data.data;
			this.providersModel=this.passdata[1].data.data;
			$('[data-toggle="popover"]').popover()
			$('[data-toggle="popover"]').on('shown.bs.popover', function (e) {
				var $element = $('#aaa').replaceWith(html);
				self.cleanup=self.$compile($('.popover-content').get(0));
			});
			$('[data-toggle="popover"]').on('hide.bs.popover',function(e){
				self.cleanup()
			})
			$('[data-toggle="popover"]').on('hidden.bs.popover', function (e) {
			    $(e.target).data("bs.popover").inState.click = false;
			});
		},
		data: function(){
			return {
				Registries:'',
				LoginKeys:'',
				Providers:'',
				providersModel:'',
				ClusterTypes : [{
					value: 'openstack'
				}, {
					value: 'amazonec2'
				}, {
					value: 'customized'
				}],
				cluster : {
					providerId:"",
					type: "",
					name: "",
					owner: "",
					details: "",
					createCategory:"",
					nodeAttribute: "",
					pubkeyId: "",
					instances: 0,
					createNode: {
						privateKey: "",
						privateNicName: "",
						nodes: ""
					},
					dockerRegistries:[]
				}
			}
		},
		methods: {
			pushRegistry : function(index) {
				var temp=this.Registries.splice(index, 1);
				this.cluster.dockerRegistries.push(temp[0]);
				this.toggleRegistrySelect();
			},
			popRegistry : function(index) {
				var temp=this.cluster.dockerRegistries.splice(index, 1);
				this.Registries.push(temp[0]);
				$('[data-toggle="popover"]').popover('hide')
			},
			toggleRegistrySelect:function(){
				$('[data-toggle="popover"]').popover('toggle')
			},
			popCluster : function(index) {
				this.cluster.createNode.nodes.splice(index, 1);
			},
			pushCluster : function() {
				this.cluster.createNode.nodes.push({});
			},
			close: function() {
				$('#createData').modal('toggle');
				this.$dispatch('close')
			},
			create: function() {
				if(this.cluster.type=="customized"){
					this.cluster.instances=this.cluster.createNode.nodes.length;
				}else{
					if(this.cluster.createCategory=='compact'){
						this.cluster.instances +=3;
					}else{
						this.cluster.instances +=5;
					}
				};
				this.$http.post('/cluster',
					this.cluster
				).then(function(){
					this.setCurrentPage(1)
				},function(err){
					this.setErrorsInfo(err.data)
					this.setErrors(true)
				})
				this.close()
			}
		},
		validators: {
			validateName: function(name) {
				return this.vm.$http.get('/clusterValidate', {
					params: {
						clustername: name
					}
				}).then(function() {
					return Promise.resolve()
				}, function() {
					return Promise.reject(false)
				})
			}
		},
		props:['passdata'],
		vuex: {
			getters: {
				cluster: getcluster
			},
			actions:{
				setCurrentPage,
				setErrorsInfo,
				setErrors
			}
		},
		watch: {
			'cluster.createCategory':function(nv,ov){
				if(this.cluster.createCategory=="compact"){
					this.cluster.createNode.nodes=[{
						ip: "",
						sshUser: ""
					},{
						ip: "",
						sshUser: ""
					},{
						ip: "",
						sshUser: ""
					}]
				}else{
					this.cluster.createNode.nodes=[{
						ip: "",
						sshUser: ""
					},{
						ip: "",
						sshUser: ""
					},{
						ip: "",
						sshUser: ""
					},{
						ip: "",
						sshUser: ""
					},{
						ip: "",
						sshUser: ""
					}]
				}
			},
			'cluster.type':function(nv,ov){
				if (nv == 'customized') {
					this.cluster.instances = 0;
					this.cluster.name = '';
					if (this.LoginKeys.length) {
						this.cluster.pubkeyId = "";
					}
				}

				this.Providers = _.filter(this.providersModel, function(item) {
					if (nv == item.type) {
						return true
					} else {
						return false
					}
				});
				if (this.Providers.length) {
					this.cluster.providerId = this.Providers[0]._id;
				}else{
					this.cluster.providerId='';
				}
				if(this.cluster.createCategory=="compact"){
					this.cluster.createNode = {
						privateKey: "",
						nodes: [{
							ip: "",
							sshUser: ""
						}, {
							ip: "",
							sshUser: ""
						}, {
							ip: "",
							sshUser: ""
						}]
					}
				}else{
					this.cluster.createNode = {
						privateKey: "",
						nodes: [{
							ip: "",
							sshUser: ""
						}, {
							ip: "",
							sshUser: ""
						}, {
							ip: "",
							sshUser: ""
						}, {
							ip: "",
							sshUser: ""
						}, {
							ip: "",
							sshUser: ""
						}]
					}
				}
			}
		}
	}
</script>
