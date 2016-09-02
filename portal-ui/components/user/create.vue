<template>
	<div class="modal fade" id="createData" tabindex="-1" role="dialog" aria-labelledby="create">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="myModalLabel">{{$t('common.create')}}</h4>
				</div>
				<div class="modal-body">
					<validator name="create-user">
						<form class="form-horizontal" novalidate>
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.name')}}</label>
								<div class="col-sm-6">
									<input type="text" class="form-control" :class="{'input-error':$createUser.username && $createUser.username.invalid && $createUser.username.touched}" v-model="user.username" v-validate:username="{pattern:'/^$|^[A-Za-z0-9\-]+$/',required:true,maxlength:10,validateName:{rule:true,initial: 'off'}}">
									<span class="form-error" v-show="$createUser.username.touched">
										<span v-show="$createUser.username.required">{{$t('common.name')+$t('formError.required')}}</span>
										<span v-show="$createUser.username.pattern">{{$t('common.name')+$t('formError.pattern')}}</span>
										<span v-show="$createUser.username.maxlength">{{$t('common.name')+$t('formError.maxlength')}}</span>
										<span v-show="$createUser.username.validateName">{{$t('common.name')+$t('formError.duplicate')}}</span>
									</span>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.email')}}</label>
								<div class="col-sm-6">
									<input type="email" class="form-control" :class="{'input-error':$createUser.email && $createUser.email.invalid && $createUser.email.touched}" v-model="user.email" v-validate:email="{validateemail:{rule:true,initial: 'off'},required:true}">
									<span class="form-error" v-show="$createUser.email.touched">
										<span v-show="$createUser.email.required">{{$t('common.email')+$t('formError.required')}}</span>
										<span v-show="$createUser.email.validateemail">{{$t('common.email')+$t('formError.pattern')}}</span>
									</span>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label">{{$t('common.company')}}</label>
								<div class="col-sm-6">
									<input type="text" class="form-control" v-model="user.company">
								</div>
							</div>
						</form>
					</validator>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" :disabled="$createUser.invalid" @click="create">{{$t('common.create')}}</button>
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
				user:{
	                "username": "",
	                "email": "",
	                "company": ""
				}
			}
		},
		methods: {
			close: function() {
				$('#createData').modal('toggle');
			},
			create: function() {
				this.$http.post('/user', 
					this.user
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
			validateemail: function(val) {
				return /^$|^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
			},
			validateName: function(name) {
				return this.vm.$http.get('/user/validate', {
					params: {
						username: name
					}
				}).then(function() {
					return Promise.resolve()
				}, function() {
					return Promise.reject(false)
				})
			}
		},
		vuex: {
			actions:{
				setCurrentPage,
				setErrorsInfo,
				setErrors
			}
		}
	}
</script>