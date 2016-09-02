<template>
	<div class="modal fade" id="createData" tabindex="-1" role="dialog" aria-labelledby="create">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="myModalLabel">{{$t('common.create')}}</h4>
				</div>
				<div class="modal-body">
					<validator name="create-provider">
						<form class="form-horizontal" novalidate>
							<div class="form-group">
								<label class="col-sm-4 control-label">
									<span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.type')}}
								</label>
								<div class="col-sm-6">
									<select v-model="platform.type" class="form-control">
										<option :value="item.name" v-for="item in types" track-by="$index">{{item.name}}</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.sshUser')}}
								</label>
								<div class="col-sm-6">
									<input type="text" v-model="platform.sshUser" class="form-control" :class="{'input-error':$createProvider.sshUser&&$createProvider.sshUser.invalid&&$createProvider.sshUser.touched}" v-validate:ssh-user="{required:true,pattern:'/^$|^[a-zA-Z_](([a-zA-Z0-9_-]{0,30})|([a-zA-Z0-9_-]{0,29}[$]))$/'}">
									<span class="form-error" v-show="$createProvider.sshUser.touched">
										<span v-show="$createProvider.sshUser.required">{{$t('common.sshUser')+$t('formError.required')}}</span>
										<span v-show="$createProvider.sshUser.pattern">{{$t('common.sshUser')+$t('formError.pattern')}}</span>
									</span>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.name')}}
								</label>
								<div class="col-sm-6">
									<input type="text" v-model="platform.name" class="form-control" :class="{'input-error':$createProvider.name&&$createProvider.name.invalid&&$createProvider.name.touched}" v-validate:name="{pattern:'/^$|^[A-Za-z0-9]+$/',required:true,validateName:{rule:true,initial: 'off'}}">
									<span class="form-error" v-show="$createProvider.name.touched">
										<span v-show="$createProvider.name.required">{{$t('common.name')+$t('formError.required')}}</span>
										<span v-show="$createProvider.name.validateName">{{$t('common.name')+$t('formError.duplicate')}}</span>
										<span v-show="$createProvider.name.pattern">{{$t('common.name')+$t('formError.pattern')}}</span>
									</span>
								</div>
							</div>
							<div v-if="platform.type=='openstack'">
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.address')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.openstackInfo['openstack-auth-url']" class="form-control" :class="{'input-error':$createProvider.openstackAuthUrl&&$createProvider.openstackAuthUrl.invalid&&$createProvider.openstackAuthUrl.touched}" v-validate:openstack-auth-url="{required:true}">
										<span class="form-error" v-show="$createProvider.openstackAuthUrl.touched">
											<span v-show="$createProvider.openstackAuthUrl.required">{{$t('common.address')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.username')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.openstackInfo['openstack-username']" class="form-control" :class="{'input-error':$createProvider.openstackUsername&&$createProvider.openstackUsername.invalid&&$createProvider.openstackUsername.touched}" v-validate:openstack-username="{required:true}">
										<span class="form-error" v-show="$createProvider.openstackUsername.touched">
											<span v-show="$createProvider.openstackUsername.required">{{$t('common.username')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.password')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.openstackInfo['openstack-password']" class="form-control" :class="{'input-error':$createProvider.openstackPassword&&$createProvider.openstackPassword.invalid&&$createProvider.openstackPassword.touched}" v-validate:openstack-password="{required:true}">
										<span class="form-error" v-show="$createProvider.openstackPassword.touched">
											<span v-show="$createProvider.openstackPassword.required">{{$t('common.password')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.provider.tenantName')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.openstackInfo['openstack-tenant-name']" class="form-control" :class="{'input-error':$createProvider.openstackTenantName&&$createProvider.openstackTenantName.invalid&&$createProvider.openstackTenantName.touched}" v-validate:openstack-tenant-name="{required:true}">
										<span class="form-error" v-show="$createProvider.openstackTenantName.touched">
											<span v-show="$createProvider.openstackTenantName.required">{{$t('configuration.provider.tenantName')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.provider.flavorName')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.openstackInfo['openstack-flavor-name']" class="form-control" :class="{'input-error':$createProvider.openstackFlavorName&&$createProvider.openstackFlavorName.invalid&&$createProvider.openstackFlavorName.touched}" v-validate:openstack-flavor-name="{required:true}">
										<span class="form-error" v-show="$createProvider.openstackFlavorName.touched">
											<span v-show="$createProvider.openstackFlavorName.required">{{$t('configuration.provider.flavorName')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.provider.imageName')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.openstackInfo['openstack-image-name']" class="form-control" :class="{'input-error':$createProvider.openstackImageName&&$createProvider.openstackImageName.invalid&&$createProvider.openstackImageName.touched}" v-validate:openstack-image-name="{required:true}">
										<span class="form-error" v-show="$createProvider.openstackImageName.touched">
											<span v-show="$createProvider.openstackImageName.required">{{$t('configuration.provider.imageName')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.provider.safeGroup')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.openstackInfo['openstack-sec-groups']" class="form-control" :class="{'input-error':$createProvider.openstackSecGroups&&$createProvider.openstackSecGroups.invalid&&$createProvider.openstackSecGroups.touched}" v-validate:openstack-sec-groups="{required:true}">
										<span class="form-error" v-show="$createProvider.openstackSecGroups.touched">
											<span v-show="$createProvider.openstackSecGroups.required">{{$t('configuration.provider.safeGroup')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.provider.IpPool')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.openstackInfo['openstack-floatingip-pool']" class="form-control" :class="{'input-error':$createProvider.floatingipPool&&$createProvider.floatingipPool.invalid&&$createProvider.floatingipPool.touched}" v-validate:floatingip-pool="{required:true}">
										<span class="form-error" v-show="$createProvider.floatingipPool.touched">
											<span v-show="$createProvider.floatingipPool.required">{{$t('configuration.provider.IpPool')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.provider.webName')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.openstackInfo['openstack-nova-network']" class="form-control" :class="{'input-error':$createProvider.novaNetwork&&$createProvider.novaNetwork.invalid&&$createProvider.novaNetwork.touched}" v-validate:nova-network="{required:true}">
										<span class="form-error" v-show="$createProvider.novaNetwork.touched">
											<span v-show="$createProvider.novaNetwork.required">{{$t('configuration.provider.webName')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
							</div>
							<div v-if="platform.type!='openstack'">
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>Access Key</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.awsEc2Info['amazonec2-access-key']" class="form-control" :class="{'input-error':$createProvider.accessKey&&$createProvider.accessKey.invalid&&$createProvider.accessKey.touched}" v-validate:access-key="{required:true}">
										<span class="form-error" v-show="$createProvider.accessKey.touched">
											<span v-show="$createProvider.accessKey.required">Access Key {{$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>Secret Key</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.awsEc2Info['amazonec2-secret-key']" class="form-control" :class="{'input-error':$createProvider.secretKey&&$createProvider.secretKey.invalid&&$createProvider.secretKey.touched}" v-validate:secret-key="{required:true}">
										<span class="form-error" v-show="$createProvider.secretKey.touched">
											<span v-show="$createProvider.secretKey.required">Secret Key {{$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.provider.imageId')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.awsEc2Info['amazonec2-ami']" class="form-control" :class="{'input-error':$createProvider.ami&&$createProvider.ami.invalid&&$createProvider.ami.touched}" v-validate:ami="{required:true}">
										<span class="form-error" v-show="$createProvider.ami.touched">
											<span v-show="$createProvider.ami.required">{{$t('configuration.provider.imageId')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.provider.instanceType')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.awsEc2Info['amazonec2-instance-type']" class="form-control" :class="{'input-error':$createProvider.instanceType&&$createProvider.instanceType.invalid&&$createProvider.instanceType.touched}" v-validate:instance-type="{required:true}">
										<span class="form-error" v-show="$createProvider.instanceType.touched">
											<span v-show="$createProvider.instanceType.required">{{$t('configuration.provider.instanceType')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.provider.rootSize')}}(GB)</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.awsEc2Info['amazonec2-root-size']" class="form-control" :class="{'input-error':$createProvider.rootSize&&$createProvider.rootSize.invalid&&$createProvider.rootSize.touched}" v-validate:root-size="{required:true}">
										<span class="form-error" v-show="$createProvider.rootSize.touched">
											<span v-show="$createProvider.rootSize.required">{{$t('configuration.provider.rootSize')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.provider.region')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.awsEc2Info['amazonec2-region']" class="form-control" :class="{'input-error':$createProvider.region&&$createProvider.region.invalid&&$createProvider.region.touched}" v-validate:region="{required:true}">
										<span class="form-error" v-show="$createProvider.region.touched">
											<span v-show="$createProvider.region.required">{{$t('configuration.provider.region')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.provider.VPCId')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.awsEc2Info['amazonec2-vpc-id']" class="form-control" :class="{'input-error':$createProvider.vpcid&&$createProvider.vpcid.invalid&&$createProvider.vpcid.touched}" v-validate:vpcid="{required:true}">
										<span class="form-error" v-show="$createProvider.vpcid.touched">
											<span v-show="$createProvider.vpcid.required">{{$t('configuration.provider.VPCId')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
							</div>
						</form>
					</validator>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" :disabled="$createProvider.invalid" @click="create">{{$t('common.create')}}</button>
					<button type="button" class="btn btn-default" @click="close">{{$t('common.cancel')}}</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import {
		setCurrentPage,
		setErrorsInfo,
		setErrors
	} from '../../../vuex/actions'
	module.exports = {
		ready: function() {
			$('#createData').modal({
				backdrop: 'static',
				show: true
			});
			let self = this;
			$('#createData').on('hidden.bs.modal', function() {
				self.$dispatch('close');
			})
		},
		watch:{
			'platform.type':function(nv,ov){
				if (this.platform.type == "openstack") {
					for (var i in this.platform.openstackInfo) {
						this.platform.openstackInfo[i] = "";
					}
				} else {
					for (var i in this.platform.awsEc2Info) {
						this.platform.awsEc2Info[i] = "";
					}
				}
			}
		},
		data: function() {
			return {
				types: [{
					name: 'openstack'
				}, {
					name: 'amazonec2'
				}],
				platform: {
					"type": 'openstack',
					"sshUser": "",
					"name": "",
					"openstackInfo": {
						"openstack-auth-url": "",
						"openstack-username": "",
						"openstack-password": "",
						"openstack-tenant-name": "",
						"openstack-flavor-name": "",
						"openstack-image-name": "",
						"openstack-sec-groups": "",
						"openstack-floatingip-pool": "",
						"openstack-nova-network": "",
						"openstack-ssh-user": ""
					},
					"awsEc2Info": {
						"amazonec2-access-key": "",
						"amazonec2-secret-key": "",
						"amazonec2-ami": "",
						"amazonec2-instance-type": "",
						"amazonec2-root-size": "",
						"amazonec2-region": "",
						"amazonec2-vpc-id": "",
						"amazonec2-ssh-user": ""
					}
				}
			}
		},
		methods: {
			close: function() {
				$('#createData').modal('toggle');
			},
			create: function() {		
				if (this.platform.type == "openstack"){
					this.platform.awsEc2Info=null;
				}else{
					this.platform.openstackInfo=null;
				}	
				this.$http.post('/provider',
					this.platform
				).then(function(data) {
						this.setCurrentPage(1);
				}, function(err) {
					this.setErrorsInfo(err.data)
					this.setErrors(true)
				})
				this.close()
			}
		},
		vuex: {
			actions: {
				setCurrentPage,
				setErrorsInfo,
				setErrors
			}
		},
		validators: {
			validateName: function(name) {
				return this.vm.$http.get('/provider/validate', {
					params: {
						provider_name:name
					}
				}).then(function() {
					return Promise.resolve()
				}, function() {
					return Promise.reject(false)
				})
			}
		},
	}
</script>