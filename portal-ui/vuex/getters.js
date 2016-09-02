export function getData(state) {
	return state.data
}
export function getSelected(state,index){
	return state.data[state.selectedIndex]
}
export function getTotalPage(state) {
	return state.pagination.totalPage
}
export function getTotalRecord(state) {
	return state.pagination.totalRecord
}
export function getCurrentPage(state) {
	return state.pagination.currentPage
}
export function getperPage(state) {
	return state.pagination.perPage
}
export function getendPoint(state){
	return state.cluster.endPoint
}
export function getparams(state){
	return state.http.params
}
export function getcluster(state){
	return state.cluster
}
export function getClusterId(state){
	return state.cluster._id
}
export function getError(state){
	return state.errors
}
export function getLoading(state){
	return state.loading
}
export function getHttpAddress(state){
	return state.http.address
}
