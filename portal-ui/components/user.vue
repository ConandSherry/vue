<template>
	<div class="pull-left full-width">
		<component :is="activeComponent"></component>
		<delete>
			{{$t('common.confirmDeleteInfo.one')+$t('common.'+$route.name)}}?
		</delete>
		<refresh></refresh>
		<button class="btn btn-success btn-sm btn-control" @click="createFn('createUser')">
            <span class="glyphicon glyphicon-edit" aria-hidden="true"></span> {{$t('user.create')}}
		</button>
		<table class="table table-striped">
			<tr>
				<th>{{$t('common.name')}}</th>
				<th>{{$t('common.email')}}</th>
				<th>{{$t('common.company')}}</th>
				<th>{{$t('common.updatedTime')}}</th>
				<th width="100px;">{{$t('common.action')}}</th>
			</tr>
			<tr v-for="i in name.length" track-by="$index">
				<td>{{name[i]}} </td>
				<td>{{email[i]}}</td>
				<td>{{company[i]}}</td>
				<td>{{updatedTime[i]}}</td>
				<td>
					<button type="button" class="btn btn-default btn-xs" aria-label="Edit" @click="editModal('editUser',i)" data-toggle="tooltip" :data-original-title="$t('common.edit')" >
	                    <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
	                </button>
	                <button type="button" class="btn btn-default btn-xs" aria-label="Delete" @click="deleteModal(i)" :disabled="name[i] == 'sysadmin'" data-toggle="tooltip" :data-original-title="$t('common.delete')">
	                    <span class="glyphicon glyphicon-trash" :class="{'disabled-cursor': name[i] == 'sysadmin'}" aria-hidden="true"></span>
	                </button>
				</td>
			</tr>
		</table>
		<pagination></pagination>
	</div>
</template>
<script>
	import {
		exportusername,
		exportemail,
		exportcompany,
		exportupdatedTime
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
			this.setAddress('user');
			this.setParams({});
			this.setCurrentPage(1);
		},
		beforeDestroy:function(){
			this.resetData()
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
			createUser:function(resolve){
				require(["./user/create.vue"], resolve)
			},
			editUser:function(resolve){
				require(["./user/edit.vue"], resolve)
			}
		},
		watch: {
			name: function(nv, ov) {
				$('[data-toggle="tooltip"]').tooltip()
			}
		},
		methods: {
			createFn:function(name){
				this.activeComponent=name;
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
		events: {
			"close":function(){
				this.activeComponent=''
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
		vuex: {
			getters: {
				name: exportusername,
				email: exportemail,
				company: exportcompany,
				updatedTime: exportupdatedTime,
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
				activeComponent:''
			}
		}
	}
</script>