<template>
	<div class="pull-left full-width">
		<component :is="activeComponent"></component>
		<delete>
			{{$t('common.confirmDeleteInfo.one')+$t('common.'+$route.name)}}?
		</delete>
		<ul class="nav nav-tabs" role="tablist">
			<li role="presentation" :class="{active:$route.name=='keypair'}">
				<a href="#keypair" @click="changeTab('keypair')" role="tab" data-toggle="tab">{{$t('configuration.keypair.title')}}</a>
			</li>
			<li role="presentation" :class="{active:$route.name=='smtp'}" v-if="username=='sysadmin'">
				<a href="#smtp" @click="changeTab('smtp')" role="tab" data-toggle="tab">{{$t('configuration.smtp.title')}}</a>
			</li>
			<li role="presentation" :class="{active:$route.name=='provider'}">
				<a href="#provider" @click="changeTab('provider')" role="tab" data-toggle="tab">{{$t('configuration.provider.title')}}</a>
			</li>
			<li role="presentation" :class="{active:$route.name=='dockerregistries'}">
				<a href="#dockerregistries" @click="changeTab('dockerregistries')" role="tab" data-toggle="tab">{{$t('configuration.dockerregistries.title')}}</a>
			</li>
		</ul>
		<div class="tab-content">
			<div role="tabpanel" class="tab-pane" v-if="$route.name=='keypair'" :class="{active:$route.name=='keypair'}">
				<refresh></refresh>
				<button class="btn btn-success btn-sm btn-control" @click="createFn('createKeyPair')">
                    <span class="glyphicon glyphicon-edit" aria-hidden="true"></span> {{$t('configuration.keypair.create')}}
                </button>
				<button class="btn btn-success btn-sm btn-control" @click="createFn('uploadKeyPair')">
                  	<span class="glyphicon glyphicon-upload" aria-hidden="true"></span> {{$t('configuration.keypair.upload')}}
                </button>
				<table class="table table-striped">
					<tr>
						<th width="100px">{{$t('common.name')}}</th>
						<th>{{$t('common.publickey')}}</th>
						<th width="100px">{{$t('common.action')}}</th>
					</tr>
					<tr v-if="name.length" v-for="i in name.length" track-by="$index">
						<td>{{name[i]}}</td>
						<td>{{pubkeyValue[i]}}</td>
						<td>
							<button type="button" class="btn btn-default btn-xs" aria-label="Delete" @click="deleteModal(i)" data-toggle="tooltip" :data-original-title="$t('common.delete')" :disabled="isuse[i]">
                                <span :class="{'disabled-cursor':isuse[i]}" class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                            </button>
						</td>
					</tr>
				</table>
			</div>
			<div role="tabpanel" class="tab-pane" v-if="$route.name=='smtp'" :class="{active:$route.name=='smtp'}">
				<refresh></refresh>
				<button class="btn btn-success btn-sm btn-control" v-show="address.length == 0" @click="createFn('createSMTP')">
                    <span class="glyphicon glyphicon-edit" aria-hidden="true"></span> {{$t('configuration.smtp.create')}}
                </button>
				<table class="table table-striped">
					<tr>
						<th>{{$t('common.serviceName')}}</th>
						<th>{{$t('common.username')}}</th>
						<th width="100px">{{$t('common.action')}}</th>
					</tr>
					<tr v-for="i in address.length" track-by="$index">
						<td>{{address[i]}}</td>
						<td>{{name[i]}}</td>
						<td>
							<button type="button" class="btn btn-default btn-xs" aria-label="Edit" @click="editModal('editSMTP',i)" data-toggle="tooltip" :data-original-title="$t('common.edit')">
                                <span class="glyphicon glyphicon-edit" aria-hidden="true"></span>
                            </button>
							<button type="button" class="btn btn-default btn-xs" aria-label="Delete" @click="deleteModal(i)" data-toggle="tooltip" :data-original-title="$t('common.delete')">
                    	        <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                            </button>
						</td>
					</tr>
				</table>
			</div>
			<div role="tabpanel" class="tab-pane" v-if="$route.name=='provider'" :class="{active:$route.name=='provider'}">
				<refresh></refresh>
				<button class="btn btn-success btn-sm btn-control" @click="createFn('createProvider')">
					<span class="glyphicon glyphicon-edit" aria-hidden="true"></span> {{$t('configuration.provider.create')}}
				</button>
				<table class="table table-striped">
					<tr>
						<th>{{$t('common.type')}}</th>
						<th>{{$t('common.name')}}</th>
						<th width="100px">{{$t('common.action')}}</th>
					</tr>
					<tr v-for="i in type.length" track-by="$index">
						<td>{{type[i]}}</td>
						<td>{{name[i]}}</td>
						<td>
							<button type="button" class="btn btn-default btn-xs" aria-label="Edit" @click="editModal('editProvider',i)" data-toggle="tooltip" :data-original-title="$t('common.edit')">
								<span class="glyphicon glyphicon-edit" aria-hidden="true"></span>
							</button>
							<button type="button" class="btn btn-default btn-xs" aria-label="Delete" @click="deleteModal(i)" data-toggle="tooltip" :data-original-title="$t('common.delete')" :disabled="isuse[i]">
								<span :class="{'disabled-cursor': isuse[i]}" class="glyphicon glyphicon-trash" aria-hidden="true"></span>
							</button>
						</td>
					</tr>
				</table>
			</div>
			<div role="tabpanel" class="tab-pane" v-if="$route.name=='dockerregistries'" :class="{active:$route.name=='dockerregistries'}">
				<refresh></refresh>
				<button class="btn btn-success btn-sm btn-control" @click="createFn('createRegistry')">
					<span class="glyphicon glyphicon-edit" aria-hidden="true"></span> {{$t('configuration.dockerregistries.create')}}
				</button>
				<table class="table table-striped">
					<tr>
						<th>{{$t('common.name')}}</th>
						<th>{{$t('common.registryUrl')}}</th>
						<th>{{$t('common.secure')}}</th>
						<th width="100px">{{$t('common.action')}}</th>
					</tr>
					<tr v-for="i in name.length" track-by="$index">
						<td>{{name[i]}}</td>
						<td>{{registry[i]}}</td>
						<td>{{secure[i]}}</td>
						<td>
							<button type="button" class="btn btn-default btn-xs" aria-label="Detail" @click="editModal('editRegistry',i)" data-toggle="tooltip" :data-original-title="$t('common.detail')">
								<span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span>
							</button>
							<button type="button" class="btn btn-default btn-xs" aria-label="Delete" @click="deleteModal(i)" data-toggle="tooltip" :data-original-title="$t('common.delete')" :disabled="isUse[i]">
								<span :class="{'disabled-cursor': isUse[i]}" class="glyphicon glyphicon-trash" aria-hidden="true"></span>
							</button>
						</td>
					</tr>
				</table>
			</div>
		</div>
		<pagination></pagination>
	</div>
</template>
<script>
	import {
		exportname,
		exportpubkeyValue,
		exportisuse,
		exportaddress,
		exporttype,
		exportregistry,
		exportsecure,
		exportisUse
	} from '../vuex/getterFormat'
	import {
		setAddress,
		setParams,
		setCurrentPage,
		resetData,
		setSelectedIndex,
		setErrorsInfo,
		setErrors
	} from '../vuex/actions'
	import {
		getSelected
	} from '../vuex/getters'
	module.exports = {
		ready: function() {
			this.setAddress(this.$route.name);
			this.setParams({});
			this.setCurrentPage(1);
		},
		beforeDestroy: function() {
			this.resetData()
		},
		events: {
			"close":function(){
				this.activeComponent=''
			},
			"download":function(){
				this.activeComponent='downloadKeyPair';
			},
			"delete":function(){
				this.$http.delete('/'+this.$route.name+'/' + this.selected._id).then(
					function() {
						this.setParams({});
						this.setCurrentPage(1);
					},
					function(err) {
						this.setErrorsInfo(err.data)
						this.setErrors(true)
					}
				)
			}
		},
		methods: {
			createFn:function(name){
				this.activeComponent=name;
			},
			changeTab: function(target) {
				this.$router.go({
					name: target
				})
			},
			deleteModal: function(index) {
				this.setSelectedIndex(index);
				$('#confirmDelete').modal('toggle')
			},
			editModal:function(name,index){
				this.setSelectedIndex(index);
				this.activeComponent=name;
			}
		},
		watch: {
			name: function(nv, ov) {
				$('[data-toggle="tooltip"]').tooltip()
			}
		},
		route: {
			canReuse: false
		},
		components: {
			pagination: function(resolve) {
				require(["./common/pagination.vue"], resolve)
			},
			delete: function(resolve) {
				require(["./common/delete.vue"], resolve)
			},
			refresh: function(resolve) {
				require(["./common/refresh.vue"], resolve)
			},
			createKeyPair:function(resolve){
				require(["./configuration/key/create.vue"],resolve)
			},
			downloadKeyPair:function(resolve){
				require(["./configuration/key/download.vue"],resolve)
			},
			uploadKeyPair:function(resolve){
				require(["./configuration/key/upload.vue"],resolve)
			},
			createSMTP:function(resolve){
				require(["./configuration/smtp/create.vue"],resolve)
			},
			editSMTP:function(resolve){
				require(["./configuration/smtp/edit.vue"],resolve)
			},
			createProvider:function(resolve){
				require(["./configuration/provider/create.vue"],resolve)
			},
			editProvider:function(resolve){
				require(["./configuration/provider/edit.vue"],resolve)
			},
			createRegistry:function(resolve){
				require(["./configuration/dockerregistries/create.vue"],resolve)
			},
			editRegistry:function(resolve){
				require(["./configuration/dockerregistries/edit.vue"],resolve)
			}
		},
		vuex: {
			getters: {
				name: exportname,
				pubkeyValue: exportpubkeyValue,
				isuse: exportisuse,
				isUse: exportisUse,
				address: exportaddress,
				type: exporttype,
				registry: exportregistry,
				secure: exportsecure,
				selected: getSelected
			},
			actions: {
				setAddress,
				setParams,
				setCurrentPage,
				resetData,
				setSelectedIndex,
				setErrorsInfo,
				setErrors
			}
		},
		data: function() {
			return {
				username: Cookies.get('username'),
				activeComponent:''
			}
		}
	}
</script>
