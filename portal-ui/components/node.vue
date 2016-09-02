<template>
	<div class="pull-left full-width">
		<components :is="activeComponent"></components>
        <div class="row" v-show="cluster && cluster.status">
            <div class="col-xs-12">
                <div :class="{'alert':true,'alert-success': cluster.status == 'RUNNING', 'alert-warning': cluster.status == 'DEPLOYING'||cluster.status == 'INSTALLING'||cluster.status == 'MODIFYING','alert-danger': cluster.status == 'TERMINATING' || cluster.status == 'FAILED'}" role="alert" style="font-weight:500;color:#555">
                    <span class="glyphicon glyphicon-home" aria-hidden="true"></span>
                    &nbsp;{{$t('cluster.current')}}: &nbsp;{{cluster.name}}, &nbsp;&nbsp;{{$t('status.' + cluster.status)}}, &nbsp;&nbsp;{{$t('cluster.clusterType')}}:{{$t('cluster.' + cluster.type)}}
                    <span v-show="provider_name">, &nbsp;&nbsp;{{$t('cluster.provider_name')}}:{{provider_name}}</span>.</br></br>
                    <span v-show="infoStatus">&nbsp;{{$t('node.AddNodeFailed')}}</span>
                </div>
            </div>
        </div>
		<delete>
			{{$t('common.confirmDeleteInfo.'+type)+$t('common.'+$route.name)}}?
		</delete>
		<refresh></refresh>
		<button :disabled="!cluster||cluster.status!='RUNNING'" class="btn btn-success btn-sm btn-control" @click="createNode">
            <span :class="{'disabled-cursor':!cluster||cluster.status!='RUNNING'}" class="glyphicon glyphicon-edit" aria-hidden="true"></span> {{$t('node.create')}}
		</button>
		<button :disabled="!cluster||cluster.status!='RUNNING'||disableDelete" class="btn btn-warning btn-sm btn-control" @click="deleteSome()">
            <span :class="{'disabled-cursor':!cluster||cluster.status!='RUNNING'||disableDelete}" class="glyphicon glyphicon-trash" aria-hidden="true"></span> {{$t('common.delete')}}
      	</button>
			<table class="table table-striped">
				<tr>
                    <th width="35px">
                        <input type="checkbox" v-model="nodeSelectAll" @click="selectAll(!nodeSelectAll)" :disabled="cluster.status!='RUNNING'">
                    </th>
					<th width="25%">{{$t('common.name')}}</th>
					<th width="9%">{{$t('node.nodeType')}}</th>
					<th width="9%">{{$t('node.role')}}</th>
					<th width="15%">IP</th>
					<th width="8%">{{$t('common.status')}}</th>
					<th width="5%">{{$t('common.task')}}</th>
                    <th width="5%">CPU</th>
					<th width="6%">{{$t('common.memory')}}</th>
                    <th width="46px">{{$t('common.label')}}</th>
                    <th width="66px">{{$t('common.action')}}</th>
				</tr>
				<tr v-for="i in hostName.length" track-by="$index">
                    <td>
        				<input type="checkbox" :disabled="cluster.status!='RUNNING'||masterNode[i]||sharedNode[i]||status[i]=='TERMINATING'||status[i]=='INSTALLING'" v-model="select[i]">
        			</td>
        			<td>
        				<a><span :class="{'disabled-cursor':(status[i]=='OFFLINE'||status[i]=='FAILED')}">
                            {{hostName[i]}}
                        </span></a>
        			</td>
        			<td>
        				<span v-show="type[i]=='customized'">{{$t('common.customized')}}</span>
        				<span v-show="type[i]!='customized'">{{$t('common.platform')}}</span>
        			</td>
        			<td>
        				<span v-show="masterNode[i]">{{$t('node.master')}}</span>
        				<span v-show="slaveNode[i] && sharedNode[i]">{{$t('node.child')}}({{$t('node.shared')}})</span>
        				<span v-show="slaveNode[i] && !sharedNode[i]">{{$t('node.child')}}</span>
        			</td>
        			<td>
        				<div>{{$t('common.publicnet')}}:
        					<strong>
        						{{publicIp[i]}}
        					</strong>
        				</div>
        				<div>{{$t('common.privatenet')}}:
        					<strong>
        						{{privateIp[i]}}
        					</strong>
        				</div>
        			</td>
        			<td>
        				<status :type="status[i]"></status>
        			</td>
        			<td>{{task[i]}}</td>
        			<td>
        				<span v-show="cpu[i]==0">-</span>
        				<span v-show="cpu[i]!=0">{{cpu[i]}}</span>
        			</td>
        			<td>
        				<span v-show="memory[i]==0">-MB</span>
        				<span v-show="memory[i]!=0">{{memory[i]}}MB</span>
        				</td>
        			<td>
        				<span class="label label-default" style="margin-right:5px;display: inline-block;max-width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" data-toggle="tooltip" :data-original-title="tag" tooltip-class="wordbreak" v-for="tag in tags[i]" track-by="$index">{{tag}}</span>
        			</td>
        			<td>
        				<button type="button" class="btn btn-default btn-xs" @click="deleteModal(i)" aria-label="Delete" :disabled="cluster.status!='RUNNING'||masterNode[i]||sharedNode[i]||status=='TERMINATING'||status=='INSTALLING'" data-toggle="tooltip" :data-original-title="$t('common.delete')" >
        					<span :class="{'disabled-cursor': cluster.status!='RUNNING'||masterNode[i]||sharedNode[i]||status=='TERMINATING'||status=='INSTALLING'}" class="glyphicon glyphicon-trash" aria-hidden="true"></span>
        				</button>
        			</td>
				</tr>
			</table>
		<pagination></pagination>
	</div>
</template>
<script>
	import {
        exporthostname,
        exportstatus,
        exporttype,
        exportMasterNode,
        exportShareNode,
        exportSlaveNode,
        exportIp,
        exportPrivateIp,
        exportmemory,
        exporttask,
        exportcpu,
        exporttags,
		exporthostId
	} from '../vuex/getterFormat'
	import {
        getcluster,
        getSelected,
		getData,
		getHttpAddress
	} from '../vuex/getters'
	import {
		setAddress,
		setParams,
		setCurrentPage,
		resetData,
		setErrorsInfo,
		setErrors,
        setSelectedIndex
	} from '../vuex/actions'
	module.exports = {
		ready: function() {
			if(this.address){
				this.setAddress("cluster/"+this.cluster._id+"/hosts");
				this.setParams({});
				this.setCurrentPage(1);
			}
		},
		beforeDestroy: function() {
			this.resetData()
		},
		components: {
			pagination: function(resolve) {
				require(["./common/pagination.vue"], resolve)
			},
            status:function(resolve){
                require(["./common/status.vue"],resolve)
            },
			refresh: function(resolve) {
				require(["./common/refresh.vue"], resolve)
			},
			delete: function(resolve) {
				require(["./common/delete.vue"], resolve)
			},
			create: function(resolve) {
				require(["./node/create.vue"], resolve)
			},
		},
        watch:{
			hostName:function(nv,ov){
				$('[data-toggle="tooltip"]').tooltip()
			},
            cluster:{
                handler:function(nv,ov){
                    if (this.cluster && this.cluster.providerId) {
                        this.$http.get("/provider/"+this.cluster.providerId).then(function(suc){
                            this.provider_name=suc.data.data.name
                        },function(err){
                            this.provider_name='-'
                            this.setErrorsInfo(err.data)
    						this.setErrors(true)
                        })
                    }else{
                        this.provider_name='-'
                    }
                },
                deep:true
            },
			id:{
				handler:function(nv,ov){
					this.select=new Array(this.id.length)
				}
			},
			select:{
				handler:function(nv,ov){
					if(this.hostName.length){
						for(let i =0;i<this.hostName.length;i++){
							if (!this.masterNode[i] && !this.sharedNode[i] && this.status[i] != 'TERMINATING' && this.status[i] != 'INSTALLING'){
								if(this.select[i]){
									this.nodeSelectAll=true
								}else{
									this.nodeSelectAll=false
									return
								}
							}
						}
					}else{
						this.nodeSelectAll=false
					}
				}
			}
		},
        computed:{
			disableDelete:function(){
				return !_.some(this.select,function(item){
					return item
				})
			},
            infoStatus:function(){
                return _.some(this.status, function(item){
					if(item == 'FAILED'){
						return true
					}else{
						return false
					}
				});
            }
        },
        events:{
            'delete': function() {
				let temp=[];
				if(this.type=="one"){
					temp.push(this.selected.hostId);
				}else{
					for (let i =0;i<this.select.length;i++){
						if(this.select[i]){
							temp.push(this.id[i])
						}
					}
				}
				this.$http.delete('/cluster/' + this.selected.clusterId+'/hosts', {
					body:{
						host_ids:temp
					}

				}).then(
					function() {
						this.setParams({});
						this.setCurrentPage(1);
					},
					function(err) {
						this.setErrorsInfo(err.data)
						this.setErrors(true)
					}
				)
			},
			'close':function(){
				this.activeComponent='';
			}
        },
        methods:{
			createNode:function(){
				this.activeComponent='create';
			},
			selectAll :function(checked){
				for(let i=0;i<this.id.length;i++){
					if (!this.masterNode[i] && !this.sharedNode[i] && this.status[i] != 'TERMINATING' && this.status[i] != 'INSTALLING') {
						this.select.$set(i,checked);
					}
				}
			},
            deleteModal: function(index) {
				this.type="one";
				this.setSelectedIndex(index)
				$('#confirmDelete').modal('toggle');
			},
			'deleteSome':function(){
				this.type="some",
				$('#confirmDelete').modal('toggle');
			},
        },
		vuex: {
			getters: {
                cluster:getcluster,
                hostName:exporthostname,
                status:exportstatus,
                type:exporttype,
                masterNode:exportMasterNode,
                slaveNode:exportSlaveNode,
                sharedNode:exportShareNode,
                publicIp:exportIp,
                privateIp:exportPrivateIp,
                memory:exportmemory,
                task:exporttask,
                cpu:exportcpu,
                tags:exporttags,
                selected:getSelected,
				id:exporthostId,
				node:getData,
				address:getHttpAddress
			},
			actions: {
				setAddress,
				setParams,
				setCurrentPage,
				resetData,
				setErrorsInfo,
				setErrors,
                setSelectedIndex
			}
		},
		data: function() {
			return {
				type:'some',
				disableDelete:true,
				activeComponent:'',
				nodeSelectAll:false,
                provider_name:'',
                infoStatus:true,
				select:new Array(10)
			}
		}
	}
</script>
