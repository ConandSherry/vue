<template>
	<div class="modal fade" id="createData" tabindex="-1" role="dialog" aria-labelledby="create">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="myModalLabel">{{$t('common.create')}}</h4>
				</div>
				<div class="modal-body">
					<validator name="create-node">
						<form class="form-horizontal" novalidate>
							<div v-if="cluster.type!='customized'">
								<div class="form-group">
									<label class="radio-inline col-sm-3 col-sm-offset-3">
										<input type="radio" v-model="node.addMode" value="new" checked> {{$t('node.newnode')}}
									</label>
									<label class="radio-inline">
										<input type="radio" v-model="node.addMode" value="reuse">{{$t('node.existnode')}}
									</label>
								</div>
								<div v-if="node.addMode=='new'">
									<div class="form-group">
										<label class="col-sm-4 control-label">{{$t('cluster.clusterName')}}</label>
										<div class="col-sm-6">
											<input type="text" v-model="cluster.name" disabled class="form-control">
										</div>
									</div>
									<div class="form-group">
										<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('cluster.nodeNumber')}}</label>
										<div class="col-sm-6">
											<input class="form-control" type="number" v-model="node.addNumber" style="display: inline-block;width:35%;" :class="{'input-error':$createNode.num && $createNode.num.invalid && $createNode.num.touched}" v-validate:num="{required:true,pattern:'/^$|^[1-9]\\d*$/',min:1}">
											<span style="font-size: 12px;line-height:30px;color:#E38D13">{{$t('node.nodeNumberInfo')}}</span>
											<div class="form-error" v-show="$createNode.num.touched">
												<span v-show="$createNode.num.required">{{$t('cluster.nodeNumber')+$t('formError.required')}}</span>
												<span v-show="$createNode.num.pattern">{{$t('cluster.nodeNumber')+$t('formError.pattern')}}</span>
												<span v-show="!$createNode.num.required&&!$createNode.num.pattern&&$createNode.num.min">{{$t('cluster.nodeNumber')+$t('formError.min')}}</span>
											</div>
										</div>
									</div>
									<div class="form-group">
										<label class="col-sm-4 control-label">{{$t('common.tag')}}<span @click="pushLabel()" style="border: none;box-shadow:none;cursor:pointer;position:relative;top:5px;" class="glyphicon glyphicon-plus-sign glyphicon-action-add"></span></label>
									</div>
									<div style="margin: 0 -15px;">
										<template v-for="item in node.label" track-by="$index">
											<div class="form-group" style="margin-left:0px;width:100%;background:#F0F0F0;padding:15px 0px;margin-bottom:0px;">
												<label class="col-sm-4 control-label">Key{{$index+1}}</label>
												<div class="col-sm-6">
													<input type="text" v-model="item.key" class="form-control">
												</div>
											</div>
											<div class="form-group" style="margin-left: 0px;width:100%;background:#F0F0F0;padding-bottom:15px;">
												<label class="col-sm-4 control-label">Value{{$index+1}}</label>
												<div class="col-sm-6">
													<input type="text" v-model="item.value" class="form-control">
												</div>
												<div class="col-sm-1" style="padding:0" v-show="node.label.length!=1">
													<span @click="popLabel($index)" style="border:none;box-shadow:none;cursor:pointer;position:relative;top:-16px;" class="glyphicon glyphicon-minus-sign glyphicon-action-remove"></span>
												</div>
											</div>
										</template>
									</div>
								</div>
								<div v-if="node.addMode=='reuse'">
									<div class="form-group">
										<label class="col-sm-4 control-label">{{$t('cluster.clusterName')}}</label>
										<div class="col-sm-6">
											<input type="text" v-model="cluster.name" disabled class="form-control">
										</div>
									</div>
									<div class="form-group">
										<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.keypair')}}</label>
										<div class="col-sm-6">
											<textarea type="text" v-model="node.addNode.privateKey" class="form-control" :class="{'input-error':$createNode.keypair&&$createNode.keypair.invalid&&$createNode.keypair.touched}" v-validate:keypair="{required:true}"></textarea>
											<span class="form-error" v-show="$createNode.keypair.touched">
												<span v-show="$createNode.keypair.required">{{$t('common.keypair')+$t('formError.required')}}</span>
											</span>
										</div>
									</div>
									<div class="form-group">
										<label class="col-sm-4 control-label">{{$t('node.networkAdapter')}}</label>
										<div class="col-sm-6">
											<input type="text" v-model="node.addNode.privateNicName" class="form-control">
										</div>
									</div>
									<div class="form-group">
										<label class="col-sm-4 control-label">
											<span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.node')}}<span @click="pushNode()" style="border: none;box-shadow:none;cursor:pointer;position:relative;top:5px;" class="glyphicon glyphicon-plus-sign glyphicon-action-add">
											</span>
										</label>
									</div>
									<div style="margin:0 -15px;">
										<template v-for="item in node.addNode.nodes" track-by="$index">
											<div class="form-group" style="margin-left:0px;width:100%;background:#F0F0F0;padding:15px 0px;margin-bottom:0px;">
												<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('node.ipaddress')+($index+1)}}</label>
												<div class="col-sm-6">
													<input type="text"  v-model="item.ip" class="form-control" :class="{'input-error':$createNode['ip'+($index+1)]&&$createNode['ip'+($index+1)].invalid&&$createNode['ip'+($index+1)].touched}" :field="'ip'+($index+1)" v-validate="{required:true,pattern:'/^$|^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)($|(?!\\.$)\\.)){4}$/'}">
													<span class="form-error" v-show="$createNode['ip'+($index+1)].touched">
														<span v-show="$createNode['ip'+($index+1)].required">{{$t('node.ipaddress')+($index+1)+$t('formError.required')}}</span>
														<span v-show="$createNode['ip'+($index+1)].pattern">{{$t('node.ipaddress')+($index+1)+$t('formError.pattern')}}</span>
													</span>
												</div>
											</div>
											<div class="form-group" style="margin-left: 0px;width:100%;background:#F0F0F0;padding-bottom:15px;">
												<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.sshUser')+($index+1)}}</label>
												<div class="col-sm-6">
													<input type="text" v-model="item.sshUser" class="form-control" :class="{'input-error':$createNode['sshuser'+($index+1)]&&$createNode['sshuser'+($index+1)].invalid&&$createNode['sshuser'+($index+1)].touched}" :field="'sshuser'+($index+1)" v-validate="{required:true,pattern:'/^$|^[a-zA-Z_](([a-zA-Z0-9_-]{0,30})|([a-zA-Z0-9_-]{0,29}[$]))$/'}" >
													<span class="form-error" v-show="$createNode['sshuser'+($index+1)].touched">
														<span v-show="$createNode['sshuser'+($index+1)].required">{{$t('common.sshUser')+($index+1)+$t('formError.required')}}</span>
														<span v-show="$createNode['sshuser'+($index+1)].pattern">{{$t('common.sshUser')+($index+1)+$t('formError.pattern')}}</span>
													</span>
												</div>
												<div class="col-sm-1" style="padding:0">
													<span v-show="node.addNode.nodes.length!=1" @click="popNode($index)" style="border:none;box-shadow:none;cursor:pointer;position:relative;top:-16px;" class="glyphicon glyphicon-minus-sign glyphicon-action-remove"></span>
												</div>
											</div>
										</template>
									</div>
								</div>
							</div>
							<div v-if="cluster.type=='customized'">
								<div class="form-group">
									<label class="col-sm-4 control-label">{{$t('cluster.clusterName')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="cluster.name" disabled class="form-control">
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.keypair')}}</label>
									<div class="col-sm-6">
										<textarea class="form-control" v-model="node.addNode.privateKey" :class="{'input-error':$createNode.keypair&&$createNode.keypair.invalid&&$createNode.keypair.touched}" v-validate:keypair={required:true}></textarea>
										<span class="form-error" v-show="$createNode.keypair.touched">
											<span v-show="$createNode.keypair.required">{{$t('common.keypair')+$t('formError.required')}}</span>
										</span>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label">{{$t('node.networkAdapter')}}</label>
									<div class="col-sm-6">
										<input type="text" v-model="node.addNode.privateNicName" class="form-control">
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label">
										<span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.node')}}<span @click="pushNode()" style="border: none;box-shadow:none;cursor:pointer;position:relative;top:5px;" class="glyphicon glyphicon-plus-sign glyphicon-action-add">
									</span></label>
								</div>
								<div style="margin:0 -15px;">
									<template v-for="item in node.addNode.nodes" track-by="$index">
										<div class="form-group" style="margin-left:0px;width:100%;background:#F0F0F0;padding:15px 0px;margin-bottom:0px;">
											<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('node.ipaddress')+($index+1)}}</label>
											<div class="col-sm-6">
												<input type="text"  v-model="item.ip" class="form-control" :class="{'input-error':$createNode['ip'+($index+1)]&&$createNode['ip'+($index+1)].invalid&&$createNode['ip'+($index+1)].touched}" :field="'ip'+($index+1)" v-validate="{required:true,pattern:'/^$|^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)($|(?!\\.$)\\.)){4}$/'}">
												<span class="form-error" v-show="$createNode['ip'+($index+1)].touched">
													<span v-show="$createNode['ip'+($index+1)].required">{{$t('node.ipaddress')+($index+1)+$t('formError.required')}}</span>
													<span v-show="$createNode['ip'+($index+1)].pattern">{{$t('node.ipaddress')+($index+1)+$t('formError.pattern')}}</span>
												</span>
											</div>
										</div>
										<div class="form-group" style="margin-left: 0px;width:100%;background:#F0F0F0;padding-bottom:15px;">
											<label class="col-sm-4 control-label"><span style="font-size:10px;color:#EA402E" class="glyphicon glyphicon-asterisk" aria-hidden="true"></span>{{$t('common.sshUser')+($index+1)}}</label>
											<div class="col-sm-6">
												<input type="text" v-model="item.sshUser" class="form-control" :class="{'input-error':$createNode['sshuser'+($index+1)]&&$createNode['sshuser'+($index+1)].invalid&&$createNode['sshuser'+($index+1)].touched}" :field="'sshuser'+($index+1)" v-validate="{required:true,pattern:'/^$|^[a-zA-Z_](([a-zA-Z0-9_-]{0,30})|([a-zA-Z0-9_-]{0,29}[$]))$/'}" >
												<span class="form-error" v-show="$createNode['sshuser'+($index+1)].touched">
													<span v-show="$createNode['sshuser'+($index+1)].required">{{$t('common.sshUser')+($index+1)+$t('formError.required')}}</span>
													<span v-show="$createNode['sshuser'+($index+1)].pattern">{{$t('common.sshUser')+($index+1)+$t('formError.pattern')}}</span>
												</span>
											</div>
											<div class="col-sm-1" style="padding:0">
												<span v-show="node.addNode.nodes.length!=1" @click="popNode($index)" style="border:none;box-shadow:none;cursor:pointer;position:relative;top:-16px;" class="glyphicon glyphicon-minus-sign glyphicon-action-remove"></span>
											</div>
										</div>
									</template>
								</div>
								<div class="form-group">
									<label class="col-sm-4 control-label">{{$t('common.tag')}}<span @click="pushLabel()" style="border: none;box-shadow:none;cursor:pointer;position:relative;top:5px;" class="glyphicon glyphicon-plus-sign glyphicon-action-add"></span></label>
								</div>
								<div style="margin: 0 -15px;">
									<template v-for="item in node.label" track-by="$index">
										<div class="form-group" style="margin-left:0px;width:100%;background:#F0F0F0;padding:15px 0px;margin-bottom:0px;">
											<label class="col-sm-4 control-label">Key{{$index+1}}</label>
											<div class="col-sm-6">
												<input type="text" v-model="item.key" class="form-control">
											</div>
										</div>
										<div class="form-group" style="margin-left: 0px;width:100%;background:#F0F0F0;padding-bottom:15px;">
											<label class="col-sm-4 control-label">Value{{$index+1}}</label>
											<div class="col-sm-6">
												<input type="text" v-model="item.value" class="form-control">
											</div>
											<div class="col-sm-1" style="padding:0" v-show="node.label.length!=1">
												<span @click="popLabel($index)" style="border:none;box-shadow:none;cursor:pointer;position:relative;top:-16px;" class="glyphicon glyphicon-minus-sign glyphicon-action-remove"></span>
											</div>
										</div>
									</template>
								</div>
							</div>
						</form>
					</validator>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" :disabled="$createNode.invalid" @click="create">{{$t('common.create')}}</button>
					<button type="button" class="btn btn-default" @click="close">{{$t('common.cancel')}}</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import {
		getcluster
	} from '../../vuex/getters'
	import {
		setCurrentPage,
		setErrorsInfo,
		setErrors
	} from '../../vuex/actions'
	module.exports = {
		ready: function() {
			$('#createData').modal({
				backdrop: 'static',
				show: true
			});
			let self=this;
			$('#createData').on('hidden.bs.modal',function(){
				self.$dispatch('close');
			})
		},
		data: function(){
			return {
				node:{
					addMode: "reuse",
					addNumber: 1,
					clusterId: this.cluster._id,
					label: [{}],
					addNode: {
						privateKey: "",
						privateNicName:"",
						nodes: [{
							ip: "",
							sshUser: ""
						}]
					}
				}
			}
		},
		methods: {
			close: function() {
				$('#createData').modal('toggle');
			},
			create: function() {
				_.each(this.node.label, function(item) {
					if (item.key && item.value) {
						this.node.nodeAttribute += item.key + ':' + item.value + ';';
					}
				});
				this.node.label = null;
				if (this.node.addMode == 'reuse' || this.cluster.type == 'customized') {
					this.node.addNumber = this.node.addNode.nodes.length;
				}else{
					this.node.addNumber=parseInt(this.node.addNumber)
				};
				this.$http.post('/cluster/'+this.node.clusterId+'/hosts',
					this.node
				).then(function(){
					this.setCurrentPage(1)
				},function(err){
					this.setErrorsInfo(err.data)
					this.setErrors(true)
				})
				this.close()
			},
			pushLabel:function(){
				this.node.label.push({});
			},
			popLabel : function(index) {
				this.node.label.splice(index, 1);
			},
			popNode : function(index) {
				this.node.addNode.nodes.splice(index, 1);
			},
			pushNode : function() {
				this.node.addNode.nodes.push({});
			}
		},
		validators: {
		},
		vuex: {
			getters: {
				cluster: getcluster
			},
			actions:{
				setCurrentPage,
				setErrorsInfo,
				setErrors
			}
		},
		watch: {
			'node.addMode':function(nv,ov){
				this.node.label = [{}];
				this.node.addNode = {
					privateNicName:"",
					privateKey: "",
					nodes: [{
						ip: "",
						sshUser: ""
					}]
				};
				this.node.addNumber = 1;
			}
		}
	}
</script>
