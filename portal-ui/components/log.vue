<template>
	<div class="pull-left full-width">
		<refresh></refresh>
		<table class="table table-striped">
			<tr>
				<th>{{$t('common.action')}}</th>
				<th>{{$t('common.user')}}</th>
				<th>{{$t('common.createdTime')}}</th>
				<th>{{$t('common.comments')}}</th>
				<th width="100px;">{{$t('common.status')}}</th>
			</tr>
			<tr v-for="i in operateType.length" track-by="$index">
				<td>{{$t('log.'+operateType[i])}} </td>
				<td>{{userName[i]}}</td>
				<td>{{time_create[i]}}</td>
				<td>{{comments[i]}}</td>
				<td>
					<status :type="status[i]"></status>
				</td>
			</tr>
		</table>
		<pagination></pagination>
	</div>
</template>
<script>
	import {
		getClusterId
	} from'../vuex/getters'
	import {
		exportoperateType,
		exportuserName,
		exporttimecreate,
		exportcomments,
		exportstatus
	} from '../vuex/getterFormat'
	import {
		setAddress,
		setParams,
		setCurrentPage,
		resetData
	} from '../vuex/actions'
	module.exports = {
		ready: function() {
			this.setAddress('logs');
			this.setParams({
				clusterid: this.clusterid
			});
			this.setCurrentPage(1);
		},
		beforeDestroy:function(){
			this.resetData()
		},
		components: {
			pagination: function(resolve) {
				require(["./common/pagination.vue"], resolve)
			},
			status: function(resolve) {
				require(["./common/status.vue"], resolve)
			},
			refresh: function(resolve) {
				require(["./common/refresh.vue"], resolve)
			}
		},
		vuex: {
			getters: {
				operateType: exportoperateType,
				userName: exportuserName,
				time_create: exporttimecreate,
				comments: exportcomments,
				status: exportstatus,
				clusterid:getClusterId
			},
			actions: {
				setAddress,
				setParams,
				setCurrentPage,
				resetData
			}
		},
		data: function() {
			return {}
		}
	}
</script>
