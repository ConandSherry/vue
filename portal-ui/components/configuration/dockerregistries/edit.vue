<template>
	<div class="modal fade" id="editData" tabindex="-1" role="dialog" aria-labelledby="edit">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="myModalLabel">{{$t('common.edit')}}</h4>
				</div>
				<div class="modal-body">
					<validator name="edit-registry">
						<form class="form-horizontal" novalidate autocomplete="off">
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.name')}}</label>
								<div class="col-sm-6">
									<input type="text" v-model="registry.name" class="form-control" disabled>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('configuration.dockerregistries.registryUrl')}}</label>
								<div class="col-sm-6">
									<input type="text" v-model="registry.registry" class="form-control" disabled>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.secure')}}</label>
								<div class="col-sm-6">
									<label class="radio-inline col-sm-6">
										<input type="radio" v-model="registry.secure" disabled :value="true"> True
									</label>
									<label class="radio-inline">
										<input type="radio" v-model="registry.secure" disabled :value="false">False
									</label>
								</div>
							</div>
							<div class="form-group" v-if="registry.secure">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.certificate')}}</label>
								<div class="col-sm-6">
									<textarea class="form-control" v-model="registry.ca_text" disabled style="height:200px">
									</textarea>
								</div>
							</div>
							<div class="form-group" v-if="registry.username">
								<label class="col-sm-4 control-label">{{$t('common.username')}}</label>
								<div class="col-sm-6">
									<input type="text" v-model="registry.username" class="form-control" disabled>
								</div>
							</div>
							<div class="form-group" v-if="registry.password">
								<label class="col-sm-4 control-label">{{$t('common.password')}}</label>
								<div class="col-sm-6">
									<input type="password" v-model="registry.password" class="form-control" disabled>
								</div>
							</div>
						</form>
					</validator>
				</div>
				<div class="modal-footer">
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
			})
			this.registry=cloneObj(this.registryModel)
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
		methods: {
			close: function() {
				$('#editData').modal('toggle');
			}
		},
		vuex: {
			getters:{
				registryModel:getSelected
			}
		}
	}
</script>