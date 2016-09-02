<template>
	<loading></loading>
	<component :is="error"></component>
	<div class="login-area">
		<div style="text-align:center;margin-bottom:50px;">
			<img src="/img/linker.png"></img>
		</div>
		<validator name="login-form">
			<form novalidate>
				<div class="form-group">
					<div class="input-group">
						<span class="input-group-addon">
							<span class="glyphicon glyphicon-user" aria-hidden="true"></span>
						</span>
						<input type="text" class="form-control" placeholder="{{$t('common.username')}}" v-model="user.username" v-validate:username="['required']">
					</div>
					<span class="form-error" v-show="$loginForm.username.touched">
						<span v-show="$loginForm.username.required" style="margin-left:42px;">{{$t("common.username")+$t('formError.required')}}</span>
					</span>
				</div>
				<div class="form-group">
					<div class="input-group">
						<span class="input-group-addon">
							<span class="glyphicon glyphicon-lock" aria-hidden="true"></span>
						</span>
						<input type="password" class="form-control" placeholder="{{$t('common.password')}}" v-model="user.password" v-validate:password="['required']">
					</div>
					<span class="form-error" v-show="$loginForm.password.touched">
						<span v-show="$loginForm.password.required" style="margin-left:42px;">{{$t("common.password")+$t('formError.required')}}</span>
					</span>
				</div>
				<br/>
			</form>
			<button class="btn btn-primary btn-block" :disabled="!$loginForm.valid" @click="login">{{$t("common.login")}}</button>
		</validator>
	</div>
</template>
<script>
	import {
		setErrorsInfo,
		setErrors
	} from '../vuex/actions'
	import {
		getError
	} from '../vuex/getters'
	module.exports = {
		data: function() {
			return {
				user: {
					username: '',
					password: ''
				}
			};
		},
		computed: {
			error: function() {
				if(this.errors.show) {
					return 'error'
				} else {
					return ''
				}

			}
		},
		components: {
			error: function(resolve) {
				require(["./common/error.vue"], resolve)
			},
			loading:function(resolve){
				require(["./common/loading.vue"],resolve)
			}
		},
		methods: {
			login: function() {
				this.$http.post('/user/login', this.user).then(
					function(suc) {
						var expireDate = new Date();
  					   	expireDate.setDate(expireDate.getDate() + 2);
						Cookies.set('username', this.user.username,{'expires': expireDate});
						this.$router.go({
							name:'node'
							})
					},
					function(err) {
						this.setErrorsInfo(err.data)
						this.setErrors(true)
					}
				)
			}
		},
		vuex: {
			getters: {
				errors: getError
			},
			actions: {
				setErrorsInfo,
				setErrors
			}
		},
	}
</script>
