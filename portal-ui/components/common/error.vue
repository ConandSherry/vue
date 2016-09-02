<template>
	<div class="modal fade" id="error" tabindex="-1" role="dialog" aria-labelledby="error">
		<div class="modal-dialog modal-sm" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="myModalLabel">{{$t(errors.info.title)}}</h4>
				</div>
				<div class="modal-body">
					<div class="modal-icon-area">
						<span class="failed-icon glyphicon glyphicon-remove-sign" aria-hidden="true"></span>
					</div>
					<div class="modal-font-area">
						<span> {{$t('error.' + errors.info.code)}}</span>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" @click="close">{{$t('common.close')}}</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import {
		getError
	} from '../../vuex/getters'
	import {
		setErrorsInfo,
		setErrors
	} from '../../vuex/actions'
	module.exports = {
			vuex: {
				getters: {
					errors: getError
				},
				actions: {
					setErrors
				}
			},
			ready: function() {
				$('#error').modal({
					backdrop: 'static',
					show: true
				});
				let self = this;
				$('#error').on('hidden.bs.modal', function() {
					self.setErrors(false);
					if(self.errors.info.code === "E10012" || self.errors.info.code === "Web.NotSignIn" || self.errors.info.code === "E10050" || self.errors.info.code === "E10052" || self.errors.info.code === "E10016") {
						Cookies.expire('username');
						self.$router.go({
							name:'login'
							});
						
					}
				})
			},
			methods: {
				close: function() {
					$('#error').modal('toggle');
				}
			}
	}
</script>