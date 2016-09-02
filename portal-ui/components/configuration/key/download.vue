<template>
	<div class="modal fade" id="downloadData" tabindex="-1" role="dialog" aria-labelledby="download">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="myModalLabel">{{$t('configuration.keypair.createSuccess')}}</h4>
				</div>
				<div class="modal-body">
					<h5>{{$t('configuration.keypair.downloadTips')}}</h5>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" @click="close">{{$t('common.ok')}}</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	module.exports = {
		ready: function() {
			$('#downloadData').modal({
				backdrop: 'static',
				show: true
			});
			let self=this;
			$('#downloadData').on('hidden.bs.modal',function(){
				self.$dispatch('close');
			})
		},
		methods: {
			close: function() {
				$('#downloadData').modal('toggle');
			},
		}
	}
</script>