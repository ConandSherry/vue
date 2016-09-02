<template>
	<div class="modal fade" id="confirmDelete" tabindex="-1" role="dialog" aria-labelledby="delete">
		<div class="modal-dialog modal-sm" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="myModalLabel">{{$t('common.confirmDelete')}}</h4>
				</div>
				<div class="modal-body">
					<div class="modal-icon-area">
						<span class="confirm-icon glyphicon glyphicon-question-sign" aria-hidden="true"></span>
					</div>
					<div class="modal-font-area">
						<slot>
							{{$t('common.confirmDeleteInfo.one')}}{{$t('common.'+$route.name)}}?
						</slot>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" @click="close">{{$t('common.delete')}}</button>
					<button type="button" class="btn btn-default" data-dismiss="modal">{{$t('common.cancel')}}</button>
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