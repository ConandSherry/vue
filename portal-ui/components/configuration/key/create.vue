<template>
	<div class="modal fade" id="createData" tabindex="-1" role="dialog" aria-labelledby="create">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="myModalLabel">{{$t('common.create')}}</h4>
				</div>
				<div class="modal-body">
					<validator name="create-keypair">
						<form class="form-horizontal" novalidate>
							<div class="form-group">
								<label class="col-sm-4 control-label">
									<span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.name')}}
								</label>
								<div class="col-sm-6">
									<input type="text" class="form-control" :class="{'input-error':$createKeypair.name && $createKeypair.name.invalid && $createKeypair.name.touched}" v-model="keypair.name" v-validate:name="{pattern:'/^$|^[A-Za-z0-9]+$/',required:true}">
									<span class="form-error" v-show="$createKeypair.name.touched">
										<span v-show="$createKeypair.name.required">{{$t('common.name')+$t('formError.required')}}</span>
										<span v-show="$createKeypair.name.pattern">{{$t('common.name')+$t('formError.pattern')}}</span>
									</span>
								</div>
							</div>
						</form>
					</validator>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" :disabled="$createKeypair.invalid" @click="create">{{$t('common.create')}}</button>
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
			let self=this;
			$('#createData').on('hidden.bs.modal',function(){
				self.success?self.$dispatch('download'):self.$dispatch('close');
			})
		},
		data: function(){
			return {
				success:false,
				keypair: {
					name:''
				}
			}
		},
		methods: {
			close: function() {
				$('#createData').modal('toggle');
			},
			create: function() {
				this.$http.post('/keypair/create',
					this.keypair
				).then(function(data){
					this.success=true,
					this.setCurrentPage(1)
					window.location.assign("/keypair/download/" + data.data.data);
				},function(err){
					this.setErrorsInfo(err.data)
					this.setErrors(true)
				})
				this.close()
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
