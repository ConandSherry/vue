<template>
	<div class="pull-left full-width">
		<success>{{$t('profile.success')}}</success>
		<ul class="nav nav-tabs" role="tablist">
			<li role="presentation" class="active">
				<a href="#page1" aria-controls="page1" role="tab" data-toggle="tab">{{$t('profile.baseInfo')}}</a>
			</li>
			<li role="presentation">
				<a href="#page2" aria-controls="page2" role="tab" data-toggle="tab">{{$t('profile.confirm')}}</a>
			</li>
		</ul>
		<div class="tab-content">
			<div role="tabpanel" class="tab-pane active" id="page1">
				<form class="form-horizontal" novalidate>
					<div class="form-group">
						<label class="col-sm-4 control-label">{{$t('common.username')}}</label>
						<div class="col-sm-6">
							<input type="text" class="form-control" v-model="user.username" disabled>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-4 control-label">{{$t('common.email')}}</label>
						<div class="col-sm-6">
							<input type="text" class="form-control" v-model="user.email" disabled>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-4 control-label">{{$t('common.company')}}</label>
						<div class="col-sm-6">
							<input type="text" class="form-control" v-model="user.company">
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-10">
							<button type="button" style="float:right" @click="edit" class="btn btn-primary">{{$t('common.save')}}</button>
						</div>
					</div>
				</form>
			</div>
			<div role="tabpanel" class="tab-pane" id="page2">
				<validator name="change-password">
					<form class="form-horizontal" novalidate>
						<div class="form-group">
							<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('profile.old')}}</label>
							<div class="col-sm-6">
								<input type="text" class="form-control" v-model="password.password" :class="{'input-error':$changePassword.old&&$changePassword.old.invalid&&$changePassword.old.touched}" v-validate:old="{required:true,validatepassword:{'rule':true,initial:'off'}}">
								<span class="form-error" v-show="$changePassword.old.touched">
	                                <span v-show="$changePassword.old.required">{{$t('profile.old')}}{{$t('formError.required')}}</span>
								<span v-show="!$changePassword.old.required&&$changePassword.old.validatepassword">{{$t('profile.passwordError')}}</span>
								</span>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('profile.new')}}</label>
							<div class="col-sm-6">
								<input type="text" class="form-control" v-model="password.newpassword" :class="{'input-error':$changePassword.password&&$changePassword.password.invalid&&$changePassword.password.touched}" v-validate:password="{required:true}">
								<span class="form-error" v-show="$changePassword.password.touched">
	                               <span v-show="$changePassword.password.required" >{{$t('common.password')}}{{$t('formError.required')}}</span>
								</span>
							</div>
						</div>
						<div class="form-group">
							<label class="col-sm-4 control-label">{{$t('profile.confirm')}}</label>
							<div class="col-sm-6">
								<input type="text" class="form-control" v-model="password.confirm_newpassword">
							</div>
						</div>
						<div class="form-group">
							<div class="col-sm-10">
								<button type="button" @click="update" :disabled="$changePassword.invalid" style="float:right" class="btn btn-primary">{{$t('common.save')}}</button>
							</div>
						</div>
					</form>
				</validator>
			</div>
		</div>
	</div>
</template>
<script>
	import {
		exportusername,
		exportemail,
		exportcompany
	} from '../vuex/getterFormat'
	import {
		getSelected
	} from '../vuex/getters'
	import {
		setErrorsInfo,
		setErrors
	} from '../vuex/actions'
	module.exports = {
		ready: function() {
			this.getData();
			let self = this;
			$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
				if($(e.target).attr('aria-controls') == 'page1') {
					self.getData();
				} else {
					self.password = {
						confirm_newpassword: '',
						newpassword: '',
						password: ''
					}
				}
			})
		},
		components: {
			success: function(resolve) {
				require(["./common/success.vue"], resolve)
			}
		},
		methods: {
			getData: function() {
				this.$http.get('user/profile').then(function(data) {
					this.user = data.data.data;
				}, function(err) {
					this.setErrorsInfo(err.data)
					this.setErrors(true)
				})
			},
			edit: function() {
				this.$http.put('user/' + this.user._id,
					this.user
				).then(function(data) {
					$('#success').modal('toggle')
				}, function(err) {
					this.getData();
					this.setErrorsInfo(err.data)
					this.setErrors(true)
				})
			},
			update: function() {
				this.$http.put('/user/profile/changepassword', this.password).then(function(data) {
					console.log('storage 重置')
					Cookies.expire('username');
					this.$router.go({
						name: 'login'
					});
				}, function(err) {
					this.setErrorsInfo(err.data)
					this.setErrors(true)
				})
			}
		},
		vuex: {
			getters: {
				name: exportusername,
				email: exportemail,
				company: exportcompany,
				user: getSelected
			},
			actions: {
				setErrorsInfo,
				setErrors
			}
		},
		data: function() {
			return {
				user: {
					username: '',
					email: '',
					company: ''
				},
				password: {
					confirm_newpassword: '',
					newpassword: '',
					password: ''
				}
			}
		},
		validators: {
			validatepassword: function(val) {
				return this.vm.$http.post('/user/login', {
					username: Cookies.get('username'),
					password: val
				}).then(function() {
					return Promise.resolve()
				}, function() {
					return Promise.reject(false)
				})
			}
		}
	}
</script>
