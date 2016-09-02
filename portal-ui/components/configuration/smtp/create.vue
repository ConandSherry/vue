<template>
	<div class="modal fade" id="createData" tabindex="-1" role="dialog" aria-labelledby="create">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="myModalLabel">{{$t('common.create')}}</h4>
				</div>
				<div class="modal-body">
					<validator name="create-s-m-t-p">
						<form class="form-horizontal" novalidate>
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.smtp.address')}}</label>
								<div class="col-sm-6">
									<input type="text" v-model="smtp.address" class="form-control" :class="{'input-error':$createSMTP.address && $createSMTP.address.invalid && $createSMTP.address.touched}" v-validate:address="{required:true,pattern:'/^$|^(([\\w]+\\.)+)([A-Za-z]{1,3})$/'}">
									<span class="form-error" v-show="$createSMTP.address.touched">
										<span v-show="$createSMTP.address.required">{{$t('configuration.smtp.address')+$t('formError.required')}}</span>
										<span v-show="$createSMTP.address.pattern">{{$t('configuration.smtp.address')+$t('formError.pattern')}}</span>
									</span>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.username')}}</label>
								<div class="col-sm-6">
									<input type="text" v-model="smtp.name" class="form-control" :class="{'input-error':$createSMTP.name && $createSMTP.name.invalid && $createSMTP.name.touched}" v-validate:name="{required:true}">
									<span class="form-error" v-show="$createSMTP.name.touched">
										<span v-show="$createSMTP.name.required">{{$t('common.username')+$t('formError.required')}}</span>
									</span>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.password')}}</label>
								<div class="col-sm-6">
									<input type="password" v-model="smtp.passwd" class="form-control" :class="{'input-error':$createSMTP.passwd && $createSMTP.passwd.invalid && $createSMTP.passwd.touched}" v-validate:passwd="{required:true}">
									<span class="form-error" v-show="$createSMTP.passwd.touched">
										<span v-show="$createSMTP.passwd.required">{{$t('common.password')+$t('formError.required')}}</span>
									</span>
								</div>
							</div>
						</form>
					</validator>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" :disabled="$createSMTP.invalid" @click="create">{{$t('common.create')}}</button>
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
				smtp: {
					"name": "",
					"passwd": "",
					"address": ""
				}
			}
		},
		methods: {
			close: function() {
				$('#createData').modal('toggle');
			},
			create: function() {
				this.$http.post('/smtp',
					this.smtp
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
		}
	}
</script>