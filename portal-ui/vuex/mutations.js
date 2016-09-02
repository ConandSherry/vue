export default {
	SETDATA(state, data) {
			state.data = data
		},
		SETPaginationTotalRecords(state, data) {
			state.pagination.totalRecord = data
		},
		SETPaginationTotalpage(state, data) {
			state.pagination.totalPage = data
		},
		SETCurrentPage(state, data) {
			state.pagination.currentPage = data
		},
		SETAddress(state, data) {
			state.http.address = data
		},
		SETParams(state, data) {
			state.http.params = data
		},
		SETselectedIndex(state,data){
			state.selectedIndex=data
		},
		SETerrorsInfo(state,data){
			state.errors.info=data
		},
		SETerrors(state,data){
			state.errors.show=data
		},
		SETcluster(state,data){
			state.cluster=data
		}
}
