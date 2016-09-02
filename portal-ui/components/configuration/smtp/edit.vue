<template>
	<div class="modal fade" id="editData" tabindex="-1" role="dialog" aria-labelledby="edit">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="myModalLabel">{{$t('common.edit')}}</h4>
				</div>
				<div class="modal-body">
					<validator name="edit-s-m-t-p">
						<form class="form-horizontal" novalidate>
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.smtp.address')}}</label>
								<div class="col-sm-6">
									<input type="text" v-model="smtp.address" class="form-control" :class="{'input-error':$editSMTP.address && $editSMTP.address.invalid && $editSMTP.address.touched}" v-validate:address="{required:true,pattern:'/^$|^(([\\w]+\\.)+)([A-Za-z]{1,3})$/'}">
									<span class="form-error" v-show="$editSMTP.address.touched">
										<span v-show="$editSMTP.address.required">{{$t('configuration.smtp.address')+$t('formError.required')}}</span>
										<span v-show="$editSMTP.address.pattern">{{$t('configuration.smtp.address')+$t('formError.pattern')}}</span>
									</span>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.username')}}</label>
								<div class="col-sm-6">
									<input type="text" v-model="smtp.name" class="form-control" :class="{'input-error':$editSMTP.name && $editSMTP.name.invalid && $editSMTP.name.touched}" v-validate:name="{required:true}">
									<span class="form-error" v-show="$editSMTP.name.touched">
										<span v-show="$editSMTP.name.required">{{$t('common.username')+$t('formError.required')}}</span>
									</span>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.password')}}</label>
								<div class="col-sm-6">
									<input type="password" v-model="smtp.passwd" class="form-control" :class="{'input-error':$editSMTP.passwd && $editSMTP.passwd.invalid && $editSMTP.passwd.touched}" v-validate:passwd="{required:true}">
									<span class="form-error" v-show="$editSMTP.passwd.touched">
										<span v-show="$editSMTP.passwd.required">{{$t('common.password')+$t('formError.required')}}</span>
									</span>
								</div>
							</div>
						</form>
					</validator>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" :disabled="$editSMTP.invalid" @click="edit">{{$t('common.edit')}}</button>
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
			this.smtp=cloneObj(this.smtpModel);
		},
		methods: {
			close: function() {
				$('#editData').modal('toggle');
			},
			edit: function() {
				this.$http.put('/smtp/'+this.smtp._id,
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
		data: function() {
			return {
				smtp: {
					"name": "",
					"passwd": "",
					"address": ""
				}
			}
		},
		vuex: {
			getters:{
				smtpModel: getSelected
			},
			actions: {
				setCurrentPage,
				setErrorsInfo,
				setErrors
			}
		}
	}
</script>