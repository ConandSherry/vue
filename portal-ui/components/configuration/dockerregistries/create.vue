<template>
	<div class="modal fade" id="createData" tabindex="-1" role="dialog" aria-labelledby="create">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="myModalLabel">{{$t('common.create')}}</h4>
				</div>
				<div class="modal-body">
					<validator name="create-registry">
						<form class="form-horizontal" novalidate autocomplete="off">
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.name')}}</label>
								<div class="col-sm-6">
									<input type="text" v-model="registry.name" class="form-control" :class="{'input-error':$createRegistry.name&&$createRegistry.name.invalid&&$createRegistry.name.touched}" v-validate:name="{pattern:'/^$|^[A-Za-z0-9]+$/',required:true,validateName:{rule:true,initial: 'off'}}">
									<span class="form-error" v-show="$createRegistry.name.touched">
										<span v-show="$createRegistry.name.required">{{$t('common.name')+$t('formError.required')}}</span>
										<span v-show="$createRegistry.name.validateName">{{$t('common.name')+$t('formError.duplicate')}}</span>
										<span v-show="$createRegistry.name.pattern">{{$t('common.name')+$t('formError.pattern')}}</span>
									</span>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.dockerregistries.registryUrl')}}</label>
								<div class="col-sm-6">
									<input type="text" v-model="registry.registry" class="form-control" :class="{'input-error':$createRegistry.registry&&$createRegistry.registry.touched&&$createRegistry.registry.invalid}" v-validate:registry="{pattern:'/^$|^[A-Za-z0-9]([A-Za-z0-9-]{0,}[A-Za-z0-9])?(\\.[A-Za-z0-9]([A-Za-z0-9-]{0,}[A-Za-z0-9])?){0,}(:\\d+)?$/',required:true}">
									<span class="form-error" v-show="$createRegistry.registry.touched">					
										<span v-show="$createRegistry.registry.required">{{$t('configuration.dockerregistries.registryUrl')+$t('formError.required')}}</span>
									<span v-show="$createRegistry.registry.pattern">{{$t('configuration.dockerregistries.registryUrl')+$t('formError.pattern')}}</span>
									</span>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.secure')}}</label>
								<div class="col-sm-6">
									<label class="radio-inline col-sm-6">
										<input type="radio" v-model="registry.secure" :value="true"> True
									</label>
									<label class="radio-inline">
										<input type="radio" v-model="registry.secure" :value="false">False
									</label>
								</div>
							</div>
							<div class="form-group" v-if="registry.secure">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.certificate')}}</label>
								<div class="col-sm-6">
									<textarea class="form-control" v-model="registry.ca_text" :class="{'input-error':$createRegistry.ca_text&&$createRegistry.ca_text.touched&&$createRegistry.ca_text.invalid}" style="height:200px" v-validate:ca_text="{required:true}">
									</textarea>
									<span class="form-error" v-show="$createRegistry.ca_text.touched">
										<span v-show="$createRegistry.ca_text.required">{{$t('common.certificate')+$t('formError.required')}}</span>
									</span>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label">{{$t('common.username')}}</label>
								<div class="col-sm-6">
									<input type="text" v-model="registry.username" class="form-control" :class="{'input-error':$createRegistry.username&&$createRegistry.username.touched&&$createRegistry.username.invalid}">
									<span class="form-error">
										<span v-show="usernameInfo">{{$t('common.username')+$t('formError.required')}}</span>
									</span>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label">{{$t('common.password')}}</label>
								<div class="col-sm-6">
									<input type="password" v-model="registry.password" class="form-control">
								</div>
							</div>
						</form>
					</validator>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" :disabled="$createRegistry.invalid || usernameInfo" @click="create">{{$t('common.create')}}</button>
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
		data: function() {
			return {
				registry: {
					name: '',
					registry: '',
					secure: true,
					ca_text: '',
					username: '',
					password: ''
				}
			}
		},
		computed:{
			usernameInfo:function(){
				if(this.registry.password && !this.registry.username){
					return true;
				}else{
					return false;
				}
			}
		},
		watch:{
			'registry.secure':function(nv,ov){
				if(!this.registry.secure){
					this.registry.ca_text='';
				}
			}
		},
		methods: {
			close: function() {
				$('#createData').modal('toggle');
			},
			create: function() {
				this.$http.post('/dockerregistries',
					this.registry
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
				return this.vm.$http.get('/dockerregistries/registryValidate', {
					params: {
						name:name,
						type:'name'
					}
				}).then(function() {
					return Promise.resolve()
				}, function() {
					return Promise.reject(false)
				})
			}
		}
	}
</script>