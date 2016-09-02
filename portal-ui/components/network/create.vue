<template>
	<div class="modal fade" id="createData" tabindex="-1" role="dialog" aria-labelledby="create">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="myModalLabel">{{$t('common.create')}}</h4>
				</div>
				<div class="modal-body">
					<validator name="create-network">
						<form class="form-horizontal" novalidate>
							<div class="form-group">
								<label class="col-sm-4 control-label">
									<span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('network.networkName')}}
								</label>
								<div class="col-sm-6">
									<input type="text" class="form-control" :class="{'input-error':$createNetwork.networkname && $createNetwork.networkname.invalid && $createNetwork.networkname.touched}" v-model="network.network.name" v-validate:networkname="{pattern:'/^$|^[A-Za-z0-9]+$/',required:true,validateName:{rule:true,initial: 'off'}}">
									<span class="form-error" v-show="$createNetwork.networkname.touched">
										<span v-show="$createNetwork.networkname.required">{{$t('network.networkName')+$t('formError.required')}}</span>
										<span v-show="$createNetwork.networkname.pattern">{{$t('network.networkName')+$t('formError.pattern')}}</span>
										<span v-show="$createNetwork.networkname.validateName">{{$t('network.networkName')+$t('formError.duplicate')}}</span>
									</span>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label">
									<span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('network.scope')}}
								</label>
								<div class="col-sm-6">
									<div class="col-sm-6" style="height: 34px;padding: 6px 12px;font-size: 14px;line-height: 1.42857143;">
										<input type="radio" value="false" v-model="network.network.internal">&nbsp&nbsp{{$t('network.external')}}
									</div>
									<div class="col-md-6" style="height: 34px;padding: 6px 12px;font-size: 14px;line-height: 1.42857143;">
										<input type="radio" value="true" v-model="network.network.internal">&nbsp&nbsp{{$t('network.internal')}}
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('network.subnet')}}</label>
								<div class="col-sm-6">
									<input type="text" class="form-control" :class="{'input-error':$createNetwork.subnet && $createNetwork.subnet.invalid && $createNetwork.subnet.touched}" v-model="network.network.subnet[0]" v-validate:subnet="{pattern:'/^$|^((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(\\.)){3}(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\/(3[0-2]|[12]\\d|[1-9]|0)$/',required:true}">
									<span class="form-error" v-show="$createNetwork.subnet.touched">
										<span v-show="$createNetwork.subnet.required">{{$t('network.subnet')+$t('formError.required')}}</span>
										<span v-show="$createNetwork.subnet.pattern">{{$t('network.subnet')+$t('formError.pattern')}}</span>
										<span v-show="!$createNetwork.subnet.pattern && subnetcheck">{{$t('network.subnet')+$t('formError.pattern')}}</span>
									</span>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label">{{$t('network.gateway')}}</label>
								<div class="col-sm-6">
									<input type="text" class="form-control" :class="{'input-error':$createNetwork.gateway && $createNetwork.gateway.invalid && $createNetwork.gateway.touched}" v-model="network.network.gateway[0]" v-validate:gateway="{pattern:'/^$|^((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)($|(?!\\.$)\\.)){4}$/'}">
									<span class="form-error" v-show="$createNetwork.gateway.touched">
										<span v-show="$createNetwork.gateway.pattern">{{$t('network.gateway')+$t('formError.pattern')}}</span>
									<span v-show="!$createNetwork.gateway.pattern && gatewaysame">{{$t('network.gateway')+$t('formError.pattern')}}</span>
									</span>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label">{{$t('network.iprange')}}</label>
								<div class="col-sm-6">
									<input type="text" class="form-control" :class="{'input-error':$createNetwork.iprange && $createNetwork.iprange.invalid && $createNetwork.iprange.touched}" v-model="network.network.iprange[0]" v-validate:iprange="{pattern:'/^$|^((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(\\.)){3}(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)\\/(3[0-2]|[12]\\d|[1-9])$/'}">
									<span class="form-error" v-show="$createNetwork.iprange.touched">
										<span v-show="$createNetwork.iprange.pattern">{{$t('network.iprange')+$t('formError.pattern')}}</span>
										<span v-show="!$createNetwork.iprange.pattern &&!$createNetwork.gateway.pattern && ( mask || iprangesame )">{{$t('network.iprange')+$t('formError.pattern')}}</span>
									</span>
								</div>
							</div>
						</form>
					</validator>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" :disabled="$createNetwork.invalid || subnetcheck ||mask || iprangesame || gatewaysame" @click="create">{{$t('common.create')}}</button>
					<button type="button" class="btn btn-default" @click="close">{{$t('common.cancel')}}</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import {
		getendPoint,
		getcluster
	} from '../../vuex/getters'
	import {
		setCurrentPage,
		setErrorsInfo,
		setErrors
	} from '../../vuex/actions'
	module.exports = {
		ready: function() {
			$('#createData').modal({
				backdrop: 'static',
				show: true
			});
			let self=this;
			$('#createData').on('hidden.bs.modal',function(){
				self.$dispatch('close');
			})
		},
		data: function(){
			return {
				network: {
					"cluster_id": this.cluster._id,
					"cluster_name": this.cluster.name,
					"user_name": this.cluster.owner,
					"clust_host_name": this.clust_host_name,
					"network": {
						"name": "",
						"internal": "false",
						"driver": "overlay",
						"subnet": [],
						"gateway": [],
						"iprange": []
					}
				},
				subnetcheck: false,
				mask: false,
				iprangesame: false,
				gatewaysame: false
			}
		},
		props: ['clust_host_name'],
		methods: {
			close: function() {
				$('#createData').modal('toggle');
			},
			create: function() {
				this.$http.post('/network?clientAddr='+this.endpoint, 
					this.network
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
				return this.vm.$http.get('/network/validate', {
					params: {
						networkname: name,
						clientAddr: this.vm.endpoint,
						username: Cookies.get('username')
					}
				}).then(function() {
					return Promise.resolve()
				}, function() {
					return Promise.reject(false)
				})
			}
		},
		vuex: {
			getters: {
				endpoint: getendPoint,
				cluster: getcluster
			},
			actions:{
				setCurrentPage,
				setErrorsInfo,
				setErrors
			}
		},
		watch: {
			'network.network': {
				handler: function(nv, ov) {
					if(nv.name == ov.name && nv.internal == ov.internal && nv.driver == ov.driver) {
						let subnet, subnetlength, gateway, iprange, iprangelength;
						if(!_.isEmpty(nv.subnet[0])) {
							subnetlength = nv.subnet[0].slice(nv.subnet[0].indexOf('/') + 1);
							subnet = nv.subnet[0].slice(0, nv.subnet[0].indexOf('/')).split('.');
							subnet = _.map(subnet, function(item) {
								item = parseInt(item).toString(2);
								var len = item.length;
								while(len < 8) {
									item = "0" + item;
									len++;
								}
								return item;
							});
							subnet = subnet.join('');
							this.subnetcheck = (subnet.slice(subnetlength) != 0)
						} else {
							this.subnetcheck = false;
						}
						if(!_.isEmpty(nv.gateway[0])) {
							gateway = nv.gateway[0].split('.');
							gateway = _.map(gateway, function(item) {
								item = parseInt(item).toString(2);
								var len = item.length;
								while(len < 8) {
									item = "0" + item;
									len++;
								}
								return item;
							});
							gateway = gateway.join('');
						}
						if(!_.isEmpty(nv.iprange[0])) {
							iprangelength = nv.iprange[0].slice(nv.iprange[0].indexOf('/') + 1);
							iprange = nv.iprange[0].slice(0, nv.iprange[0].indexOf('/')).split('.');
							iprange = _.map(iprange, function(item) {
								item = parseInt(item).toString(2);
								var len = item.length;
								while(len < 8) {
									item = "0" + item;
									len++;
								}
								return item;
							});
							iprange = iprange.join('');
						}
						if(subnetlength && iprangelength && parseInt(subnetlength) > parseInt(iprangelength)) {
							this.mask = true;
							return;
						} else {
							this.mask = false;
						}
						if(subnet && gateway) {
							if(subnet.slice(0, subnetlength) == gateway.slice(0, subnetlength)) {
								this.gatewaysame = false;
							} else {
								this.gatewaysame = true;
							}
						}
						if(subnet && iprange) {
							if(subnet.slice(0, subnetlength) == iprange.slice(0, subnetlength)) {
								this.iprangesame = false;
							} else {
								this.iprangesame = true;
							}
						}
					}
				},
				deep: true
			}
		}
	}
</script>