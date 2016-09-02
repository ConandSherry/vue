<template>
	<div class="modal fade" id="editData" tabindex="-1" role="dialog" aria-labelledby="edit">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="myModalLabel">{{$t('common.edit')}}</h4>
				</div>
				<div class="modal-body">
					<validator name="edit-user">
						<form class="form-horizontal" novalidate>
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.name')}}</label>
								<div class="col-sm-6">
									<input type="text" class="form-control" v-model="user.username" disabled>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.email')}}</label>
								<div class="col-sm-6">
									<input type="email" class="form-control" v-model="user.email" disabled>
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
					<button type="button" class="btn btn-primary" :disabled="$editUser.invalid" @click="edit">{{$t('common.edit')}}</button>
					<button type="button" class="btn btn-default" @click="close">{{$t('common.cancel')}}</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import {
		cloneObj
	} from'../../utils'
	import {
		setCurrentPage,
		setErrorsInfo,
		setErrors
	} from '../../vuex/actions'
	import {
		getSelected
	} from '../../vuex/getters'
	module.exports = {
		ready: function() {
			$('#editData').modal({
				backdrop: 'static',
				show: true
			});
			let self=this;
			$('#editData').on('hidden.bs.modal',function(){
				self.$dispatch('close');
			});
			this.user=cloneObj(this.userModel);
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
				$('#editData').modal('toggle');
			},
			edit: function() {
				this.$http.put('/user/'+this.user._id, 
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
		vuex: {
			getters:{
				userModel: getSelected
			},
			actions:{
				setCurrentPage,
				setErrorsInfo,
				setErrors
			}
		}
	}
</script>