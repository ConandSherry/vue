<template>
	<div class="modal fade" id="editData" tabindex="-1" role="dialog" aria-labelledby="edit">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="myModalLabel">{{$t('common.edit')}}</h4>
				</div>
				<div class="modal-body">
					<validator name="edit-provider">
						<form class="form-horizontal" novalidate>
							<div class="form-group">
								<label class="col-sm-4 control-label">
									<span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.type')}}
								</label>
								<div class="col-sm-6">
									<select v-model="platform.type" disabled class="form-control">
										<option :value="item.name" v-for="item in types" track-by="$index">{{item.name}}</option>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.sshUser')}}
								</label>
								<div class="col-sm-6">
									<input type="text" v-model="platform.sshUser" class="form-control" :class="{'input-error':$editProvider.sshUser&&$editProvider.sshUser.invalid&&$editProvider.sshUser.touched}" v-validate:ssh-user="{required:true,pattern:'/^$|^[a-zA-Z_](([a-zA-Z0-9_-]{0,30})|([a-zA-Z0-9_-]{0,29}[$]))$/'}">
									<span class="form-error" v-show="$editProvider.sshUser.touched">
										<span v-show="$editProvider.sshUser.required">{{$t('common.sshUser')+$t('formError.required')}}</span>
										<span v-show="$editProvider.sshUser.pattern">{{$t('common.sshUser')+$t('formError.pattern')}}</span>
									</span>
								</div>
							</div>
							<div v-if="platform.type=='openstack'">
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.address')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.openstackInfo['openstack-auth-url']" class="form-control" :class="{'input-error':$editProvider.openstackAuthUrl&&$editProvider.openstackAuthUrl.invalid&&$editProvider.openstackAuthUrl.touched}" v-validate:openstack-auth-url="{required:true}">
										<span class="form-error" v-show="$editProvider.openstackAuthUrl.touched">
											<span v-show="$editProvider.openstackAuthUrl.required">{{$t('common.address')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.username')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.openstackInfo['openstack-username']" class="form-control" :class="{'input-error':$editProvider.openstackUsername&&$editProvider.openstackUsername.invalid&&$editProvider.openstackUsername.touched}" v-validate:openstack-username="{required:true}">
										<span class="form-error" v-show="$editProvider.openstackUsername.touched">
											<span v-show="$editProvider.openstackUsername.required">{{$t('common.username')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.password')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.openstackInfo['openstack-password']" class="form-control" :class="{'input-error':$editProvider.openstackPassword&&$editProvider.openstackPassword.invalid&&$editProvider.openstackPassword.touched}" v-validate:openstack-password="{required:true}">
										<span class="form-error" v-show="$editProvider.openstackPassword.touched">
											<span v-show="$editProvider.openstackPassword.required">{{$t('common.password')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.provider.tenantName')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.openstackInfo['openstack-tenant-name']" class="form-control" :class="{'input-error':$editProvider.openstackTenantName&&$editProvider.openstackTenantName.invalid&&$editProvider.openstackTenantName.touched}" v-validate:openstack-tenant-name="{required:true}">
										<span class="form-error" v-show="$editProvider.openstackTenantName.touched">
											<span v-show="$editProvider.openstackTenantName.required">{{$t('configuration.provider.tenantName')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.provider.flavorName')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.openstackInfo['openstack-flavor-name']" class="form-control" :class="{'input-error':$editProvider.openstackFlavorName&&$editProvider.openstackFlavorName.invalid&&$editProvider.openstackFlavorName.touched}" v-validate:openstack-flavor-name="{required:true}">
										<span class="form-error" v-show="$editProvider.openstackFlavorName.touched">
											<span v-show="$editProvider.openstackFlavorName.required">{{$t('configuration.provider.flavorName')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.provider.imageName')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.openstackInfo['openstack-image-name']" class="form-control" :class="{'input-error':$editProvider.openstackImageName&&$editProvider.openstackImageName.invalid&&$editProvider.openstackImageName.touched}" v-validate:openstack-image-name="{required:true}">
										<span class="form-error" v-show="$editProvider.openstackImageName.touched">
											<span v-show="$editProvider.openstackImageName.required">{{$t('configuration.provider.imageName')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.provider.safeGroup')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.openstackInfo['openstack-sec-groups']" class="form-control" :class="{'input-error':$editProvider.openstackSecGroups&&$editProvider.openstackSecGroups.invalid&&$editProvider.openstackSecGroups.touched}" v-validate:openstack-sec-groups="{required:true}">
										<span class="form-error" v-show="$editProvider.openstackSecGroups.touched">
											<span v-show="$editProvider.openstackSecGroups.required">{{$t('configuration.provider.safeGroup')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.provider.IpPool')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.openstackInfo['openstack-floatingip-pool']" class="form-control" :class="{'input-error':$editProvider.floatingipPool&&$editProvider.floatingipPool.invalid&&$editProvider.floatingipPool.touched}" v-validate:floatingip-pool="{required:true}">
										<span class="form-error" v-show="$editProvider.floatingipPool.touched">
											<span v-show="$editProvider.floatingipPool.required">{{$t('configuration.provider.IpPool')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.provider.webName')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.openstackInfo['openstack-nova-network']" class="form-control" :class="{'input-error':$editProvider.novaNetwork&&$editProvider.novaNetwork.invalid&&$editProvider.novaNetwork.touched}" v-validate:nova-network="{required:true}">
										<span class="form-error" v-show="$editProvider.novaNetwork.touched">
											<span v-show="$editProvider.novaNetwork.required">{{$t('configuration.provider.webName')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
							</div>
							<div v-if="platform.type!='openstack'">
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>Access Key</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.awsEc2Info['amazonec2-access-key']" class="form-control" :class="{'input-error':$editProvider.accessKey&&$editProvider.accessKey.invalid&&$editProvider.accessKey.touched}" v-validate:access-key="{required:true}">
										<span class="form-error" v-show="$editProvider.accessKey.touched">
											<span v-show="$editProvider.accessKey.required">Access Key {{$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>Secret Key</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.awsEc2Info['amazonec2-secret-key']" class="form-control" :class="{'input-error':$editProvider.secretKey&&$editProvider.secretKey.invalid&&$editProvider.secretKey.touched}" v-validate:secret-key="{required:true}">
										<span class="form-error" v-show="$editProvider.secretKey.touched">
											<span v-show="$editProvider.secretKey.required">Secret Key {{$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.provider.imageId')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.awsEc2Info['amazonec2-ami']" class="form-control" :class="{'input-error':$editProvider.ami&&$editProvider.ami.invalid&&$editProvider.ami.touched}" v-validate:ami="{required:true}">
										<span class="form-error" v-show="$editProvider.ami.touched">
											<span v-show="$editProvider.ami.required">{{$t('configuration.provider.imageId')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.provider.instanceType')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.awsEc2Info['amazonec2-instance-type']" class="form-control" :class="{'input-error':$editProvider.instanceType&&$editProvider.instanceType.invalid&&$editProvider.instanceType.touched}" v-validate:instance-type="{required:true}">
										<span class="form-error" v-show="$editProvider.instanceType.touched">
											<span v-show="$editProvider.instanceType.required">{{$t('configuration.provider.instanceType')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.provider.rootSize')}}(GB)</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.awsEc2Info['amazonec2-root-size']" class="form-control" :class="{'input-error':$editProvider.rootSize&&$editProvider.rootSize.invalid&&$editProvider.rootSize.touched}" v-validate:root-size="{required:true}">
										<span class="form-error" v-show="$editProvider.rootSize.touched">
											<span v-show="$editProvider.rootSize.required">{{$t('configuration.provider.rootSize')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.provider.region')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.awsEc2Info['amazonec2-region']" class="form-control" :class="{'input-error':$editProvider.region&&$editProvider.region.invalid&&$editProvider.region.touched}" v-validate:region="{required:true}">
										<span class="form-error" v-show="$editProvider.region.touched">
											<span v-show="$editProvider.region.required">{{$t('configuration.provider.region')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.provider.VPCId')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="platform.awsEc2Info['amazonec2-vpc-id']" class="form-control" :class="{'input-error':$editProvider.vpcid&&$editProvider.vpcid.invalid&&$editProvider.vpcid.touched}" v-validate:vpcid="{required:true}">
										<span class="form-error" v-show="$editProvider.vpcid.touched">
											<span v-show="$editProvider.vpcid.required">{{$t('configuration.provider.VPCId')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
							</div>
						</form>
					</validator>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" :disabled="$editProvider.invalid" @click="edit">{{$t('common.edit')}}</button>
					<button type="button" class="btn btn-default" @click="close">{{$t('common.cancel')}}</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import {
		cloneObj
	} from'../../../utils'
	import {
		setCurrentPage,
		setErrorsInfo,
		setErrors
	} from '../../../vuex/actions'
	import {
		getSelected
	} from '../../../vuex/getters'
	module.exports = {
		ready: function() {
			$('#editData').modal({
				backdrop: 'static',
				show: true
			});
			let self = this;
			$('#editData').on('hidden.bs.modal', function() {
				self.$dispatch('close');
			});
			this.platform=cloneObj(this.platformModel)
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
				$('#editData').modal('toggle');
			},
			edit: function() {		
				if (this.platform.type == "openstack"){
					this.platform.awsEc2Info=null;
				}else{
					this.platform.openstackInfo=null;
				}
				let self=this;
				this.$http.put('/provider/'+this.platform._id,
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
			getters:{
				platformModel:getSelected
			},
			actions: {
				setCurrentPage,
				setErrorsInfo,
				setErrors
			}
		}
	}
</script>