export function setCurrentPage(store, num) {
	store.dispatch('SETCurrentPage', num);
	queryData.call(this, store)
}
export function resetData(store){
	store.dispatch('SETDATA', {});
}
export function queryData(store) {
	let url="";
	if(store.state.http.params){
		for (let key in store.state.http.params){
			url+="&"+key+"="+store.state.http.params[key];
		}
	}
	let self=this;
	this.$http.get("/" + store.state.http.address + "?count=true&skip=" + (store.state.pagination.currentPage - 1) * store.state.pagination.perPage + "&limit=" + store.state.pagination.perPage+url).then(
		function(suc) {
			let data = suc.json();
			store.dispatch('SETDATA', data.data);
			store.dispatch('SETPaginationTotalRecords', data.count)
			store.dispatch('SETPaginationTotalpage', Math.ceil(data.count / store.state.pagination.perPage))
		},
		function(err) {
			setErrorsInfo.call(self,store,err.data)
			setErrors.call(self,store,true)
		}
	)
}
export function setAddress(store, addr) {
	store.dispatch('SETAddress', addr);
}

export function setParams(store,data){
	store.dispatch('SETParams',data)
}

export function setSelectedIndex(store,data){
	store.dispatch('SETselectedIndex',data)
}

export function setErrorsInfo(store,error,title){
	if(_.isUndefined(error)|| error == null){
		error = {"code":"Web.ServiceUnavailable"};
	}else if(_.isString(error)){
		error = {"code":"S500"};
	}else if(error.code==''){
        error = {"code":"Web.UnreachableServer"};
	}
	if(error.code == 401|| error.code == 404|| error.code == 405|| error.code == 409|| error.code == 500|| error.code == 502){
		error.code='S'+error.code;
	}
	if(error.code == 400 && error.data['type'] == "RepositoryAlreadyPresent") {
		error = {"code":"repositoryAlreadyPresent"};
	}
	error.title = title || "common.failed";
	if(!store.state.errors.show){
		store.dispatch('SETerrorsInfo',error)
	}
}

export function setErrors(store,data){
	store.dispatch('SETerrors',data)
}

export function setCluster(store,data){
	store.dispatch('SETcluster',data);
	switch (store.state.http.address) {
		case 'logs':
            store.state.http.params.clusterid=store.state.cluster._id;
			break;
        case 'network':
            store.state.http.params.clientAddr=store.state.cluster.endPoint;
            store.state.http.params.cluster_id=store.state.cluster._id;
            break;
		default:
			if(store.state.http.address.indexOf('cluster')!='-1'||!store.state.http.address){
				store.state.http.address="cluster/"+store.state.cluster._id+"/hosts"
			}
			setParams.call(this,store,{});
	};
	if(store.state.http.address)setCurrentPage.call(this,store,1)
}
