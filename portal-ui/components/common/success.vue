<template>
	<div class="modal fade" id="success" tabindex="-1" role="dialog" aria-labelledby="success">
		<div class="modal-dialog modal-sm" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="myModalLabel">{{$t('common.success')}}</h4>
				</div>
				<div class="modal-body">
					<div class="modal-icon-area">
						<span class="success-icon glyphicon glyphicon-ok-sign" aria-hidden="true"></span>
					</div>
					<div class="modal-font-area">
						<slot></slot>
					</div>
				</div>
				<div class="modal-footer">
					<button class="btn btn-primary" data-dismiss="modal">{{$t('common.close')}}</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	module.exports = {
		ready:function(){
			$('#confirmDelete').modal({
				backdrop: 'static',
				show: false
			})
		},
		methods:{
			close:function(){
				this.$dispatch('delete')
				$('#confirmDelete').modal('toggle')
			}
		}
	}
</script>