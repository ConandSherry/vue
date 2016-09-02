<template>
	<div v-show="loading" style="position: fixed;top: 0px;right: 0px;left: 0px;bottom: 0px;background: rgba(0, 0, 0, 0.5);z-index: 10000;">
		<div style="height: 100%;display: table;margin: auto;">
			<div style="display: table-cell;vertical-align: middle;">
				<img style="width:60px;height:60px;" src="/img/loading.gif">
			</div>
		</div>
	</div>
</template>
<script>
	import {
		getLoading
	} from '../../vuex/getters'
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
		},
		vuex:{
			getters:{
				loading:getLoading
			}
		}
	}
</script>
