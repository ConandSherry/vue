<template>
	<div class="pull-left full-width">
		<endpoint></endpoint>
		<delete>
			{{$t('common.confirmDeleteInfo.'+type)+$t('common.'+$route.name)}}?
		</delete>
		<component :is="activeComponent" :clust_host_name="hostname"></component>
		<refresh></refresh>
		<button :disabled="!endpoint" @click="createFn" class="btn btn-success btn-sm btn-control">
            <span class="glyphicon glyphicon-edit" aria-hidden="true"></span> {{$t('network.create')}}
		</button>
		<button :disabled="!endpoint" @click="deleteAll" class="btn btn-warning btn-sm btn-control">
            <span class="glyphicon glyphicon-trash" aria-hidden="true"></span> {{$t('network.terminateAll')}}
      	</button>
		<div>
			<ul class="nav nav-tabs" role="tablist">
				<li role="presentation" class="active">
					<a href="#page1" @click="getData('true')" aria-controls="page1" role="tab" data-toggle="tab">{{$t('network.internalNetwork')}}</a>
				</li>
				<li role="presentation">
					<a href="#page2" @click="getData('false')" aria-controls="page2" role="tab" data-toggle="tab">{{$t('network.externalNetworkMapping')}}</a>
				</li>
			</ul>
			<div class="tab-content">
				<div role="tabpanel" class="tab-pane active" id="page1">
					<table class="table table-striped">
						<tr>
							<th>{{$t('common.name')}}</th>
							<th>{{$t('common.segment')}}</th>
							<th>{{$t('common.subnet')}}</th>
							<th>{{$t('common.gateway')}}</th>
							<th>{{$t('common.networkdriver')}}</th>
							<th>{{$t('common.createdTime')}}</th>
							<th width="66px">{{$t('common.action')}}</th>
						</tr>
						<tr v-for="i in name.length" track-by="$index">
							<td>
								{{name[i]}}
							</td>
							<td>
								<span v-show="!ipRange[i]">-</span>
								<span v-show="ipRange[i]">{{ipRange[i]}}</span>
							</td>
							<td>
								{{subnet[i]}}
							</td>
							<td>
								<span v-show="!gateway[i]">-</span>
								<span v-show="gateway[i]">{{gateway[i]}}</span>
							</td>
							<td>
								{{driver[i]}}
							</td>
							<td>{{time_create[i]}}</td>
							<td>
								<button type="button" class="btn btn-default btn-xs" @click="deleteModal(i)" aria-label="Delete" data-toggle="tooltip" :data-original-title="$t('common.delete')">
                                <span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>
							</td>
						</tr>
					</table>
				</div>
				<div role="tabpanel" class="tab-pane" id="page2">
					<table class="table table-striped">
						<tr>
							<th>{{$t('common.name')}}</th>
							<th>{{$t('common.segment')}}</th>
							<th>{{$t('common.subnet')}}</th>
							<th>{{$t('common.gateway')}}</th>
							<th>{{$t('common.networkdriver')}}</th>
							<th>{{$t('common.createdTime')}}</th>
							<th width="66px">{{$t('common.action')}}</th>
						</tr>
						<tr v-for="i in name.length" track-by="$index">
							<td>
								{{name[i]}}
							</td>
							<td>
								<span v-show="!ipRange[i]">-</span>
								<span v-show="ipRange[i]">{{ipRange[i]}}</span>
							</td>
							<td>
								{{subnet[i]}}
							</td>
							<td>
								<span v-show="!gateway[i]">-</span>
								<span v-show="gateway[i]">{{gateway[i]}}</span>
							</td>
							<td>
								{{driver[i]}}
							</td>
							<td>{{time_create[i]}}</td>
							<td>
								<button type="button" class="btn btn-default btn-xs" @click="deleteModal(i)" aria-label="Delete" data-toggle="tooltip" :data-original-title="$t('common.delete')">
                                <span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>
							</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
		<pagination></pagination>
	</div>
</template>
<script>
	import {
		exportuserName,
		exportnetworkname,
		exportnetworkiprange,
		exporttimecreate,
		exportnetworksubnet,
		exportnetworkdriver,
		exportnetworkgateway
	} from '../vuex/getterFormat'
	import {
		getendPoint,
		getparams,
		getSelected,
		getClusterId
	} from '../vuex/getters'
	import {
		setAddress,
		setParams,
		setCurrentPage,
		setSelectedIndex,
		resetData,
		setErrorsInfo,
		setErrors
	} from '../vuex/actions'
	module.exports = {
		ready: function() {
			this.setAddress('network');
			this.setParams({
				internal: this.internal,
				clientAddr: this.endpoint,
				cluster_id: this.clusterId
			});
			this.setCurrentPage(1);
		},
		beforeDestroy: function() {
			this.resetData()
		},
		watch:{
			name:function(nv,ov){
				$('[data-toggle="tooltip"]').tooltip()
			}
		},
		events:{
			'close':function(){
				this.activeComponent=''
			},
			'delete': function() {
				if(this.type == 'one') {
					this.$http.delete('/network/' + this.selected._id, {
						params: {
							"clientAddr": this.endpoint
						}
					}).then(
						function() {
							this.setParams({
								internal: this.internal,
								clientAddr: this.endpoint,
								cluster_id: this.clusterId
							});
							this.setCurrentPage(1);
						},
						function(err) {
							this.setErrorsInfo(err.data)
							this.setErrors(true)
						}
					)
				} else {
					this.$http.delete('/network?cluster_id='+this.clusterId, {
						params: {
							"clientAddr": this.endpoint
						}
					}).then(function() {
						this.setParams({
							internal: this.internal,
							clientAddr: this.endpoint,
							cluster_id: this.clusterId
						});
						this.setCurrentPage(1);
					}, function(err) {
						this.setErrorsInfo(err.data)
						this.setErrors(true)
					})
				}

			}
		},
		methods: {
			createFn:function(){
				this.$http.get("/cluster/"+this.clusterId+"/hosts",{
					params:{
						'count':true,
						'skip':'',
						'limit':''
					}
				}).then(function(data){
					data=data.json();
					this.hostname = _.find(data.data, function(item) {
						return item.isSharedNode
					}).hostName;
					this.activeComponent='create';
				},function(err){
					this.setErrorsInfo(err.data)
					this.setErrors(true)
				})
			},
			deleteModal: function(index) {
				this.setSelectedIndex(index);
				this.type = 'one';
				$('#confirmDelete').modal('toggle')
			},
			deleteAll: function() {
				this.type = 'all';
				$('#confirmDelete').modal('toggle')
			},
			getData: function(internal) {
				if(this.params.internal != internal) {
					this.internal = internal
					this.setParams({
						internal: this.internal,
						clientAddr: this.endpoint,
						cluster_id: this.clusterId
					});
					this.setCurrentPage(1);
				}
			}
		},
		components: {
			pagination: function(resolve) {
				require(["./common/pagination.vue"], resolve)
			},
			endpoint: function(resolve) {
				require(["./common/endpoint.vue"], resolve)
			},
			refresh: function(resolve) {
				require(["./common/refresh.vue"], resolve)
			},
			delete: function(resolve) {
				require(["./common/delete.vue"], resolve)
			},
			create: function(resolve) {
				require(["./network/create.vue"], resolve)
			}
		},
		vuex: {
			getters: {
				params: getparams,
				endpoint: getendPoint,
				name: exportnetworkname,
				ipRange: exportnetworkiprange,
				subnet: exportnetworksubnet,
				gateway: exportnetworkgateway,
				driver: exportnetworkdriver,
				time_create: exporttimecreate,
				selected: getSelected,
				clusterId: getClusterId
			},
			actions: {
				setAddress,
				setParams,
				setCurrentPage,
				setSelectedIndex,
				resetData,
				setErrorsInfo,
				setErrors
			}
		},
		data: function() {
			return {
				type: 'one',
				hostname:'',
				internal: "true",
				activeComponent:''
			}
		}
	}
</script>
