<template>
	<button type="button" class="btn btn-info btn-sm btn-control" @click="queryData" style="margin-right:3px;"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span> {{$t('common.refresh')}}</button>
</template>
<script>
	import {
		queryData
	} from '../../vuex/actions'
	module.exports = {
		vuex: {
			actions: {
				queryData
			}
		}
	}
</script>