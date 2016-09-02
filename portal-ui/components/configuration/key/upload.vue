<template>
	<div class="modal fade" id="uploadKeypair" tabindex="-1" role="dialog" aria-labelledby="upload">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="myModalLabel">{{$t('common.upload')}}</h4>
				</div>
				<div class="modal-body">
					<validator name="upload-keypair">
						<form class="form-horizontal" novalidate>
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.name')}}</label>
								<div class="col-sm-6">
									<input type="text" class="form-control" :class="{'input-error':$uploadKeypair.name && $uploadKeypair.name.invalid && $uploadKeypair.name.touched}" v-model="keypair.name" v-validate:name="{pattern:'/^$|^[A-Za-z0-9]+$/',required:true}">
									<span class="form-error" v-show="$uploadKeypair.name.touched">
										<span v-show="$uploadKeypair.name.required">{{$t('common.name')+$t('formError.required')}}</span>
										<span v-show="$uploadKeypair.name.pattern">{{$t('common.name')+$t('formError.required')}}</span>
									</span>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.publickey')}}</label>
								<div class="col-sm-6">
									<textarea class="form-control" v-model="keypair.pubkeyValue" v-validate:publickey="{required:true}" style="height:200px">
									</textarea>
									<span class="form-error" v-show="$uploadKeypair.publickey.$touched">
										<span v-show="$uploadKeypair.publickey.required">{{$t('common.publickey')+$t('formError.required')}}</span>
									</span>
								</div>
							</div>
						</form>
					</validator>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" :disabled="$uploadKeypair.invalid" @click="upload">{{$t('common.upload')}}</button>
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
			$('#uploadKeypair').modal({
				backdrop: 'static',
				show: true
			});
			let self = this;
			$('#uploadKeypair').on('hidden.bs.modal', function() {
				self.$dispatch('close');
			})
		},
		data: function() {
			return {
				keypair: {
					"name": "",
					"pubkey_value": ""
				}
			}
		},
		methods: {
			close: function() {
				$('#uploadKeypair').modal('toggle');
			},
			upload: function() {
				this.$http.post('/keypair/upload',
					this.keypair
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