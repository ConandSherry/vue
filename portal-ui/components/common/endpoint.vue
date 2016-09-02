<template>
	<div class="row" v-if="!endPoint">
		<div class="col-xs-12">
			<div class="alert alert-danger" role="alert" style="font-weight:500;color:#555">
				<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>&nbsp; 
				{{$t('error.EndPoint.Unavailable')}}
			</div>
		</div>
	</div>
</template>
<script>
	import {
		getendPoint
	} from '../../vuex/getters'
	module.exports = {
		data:function(){
			return{
			}
		},
		vuex:{
			getters:{
				endPoint :getendPoint
			}
		}
	}
</script>