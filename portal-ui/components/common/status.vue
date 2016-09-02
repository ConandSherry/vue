<template>
	<span :class="classSelect">
		{{$t('status.'+type)}}
	</span>
</template>
<script>
	module.exports = {
		computed: {
			classSelect: function() {
				return {
					'label': true,
					'label-success': this.type == 'RUNNING' || this.type == 'TASK_RUNNING' || this.type == 'success',
					'label-danger': this.type == 'FAILED' || this.type == 'OFFLINE' || this.type == 'STOPPED' || this.type == 'DELETING' || this.type == 'SUSPEND',
					'label-warning': this.type == 'TERMINATING' || this.type == 'DEPLOYING' || this.type == 'INSTALLING' || this.type == 'INCOMPLETE' || this.type == 'WAITING',
					'label-info': this.type == 'IDLE',
					'label-default': this.type == 'UNKNOWN'
				}
			}
		},
		props: ['type']
	}
</script>