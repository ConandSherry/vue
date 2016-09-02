export function exportoperateType(state) {
	return state.data.length&&state.data.map(item => item.operateType)||[]
}
export function exportID(state){
	return state.data.length&&state.data.map(item => item._id)||[]
}
export function exporthostId(state){
	return state.data.length&&state.data.map(item => item.hostId)||[]
}
export function exportMasterNode(state){
	return state.data.length&&state.data.map(item => item.isMasterNode)||[]
}
export function exporttags(state){
	return state.data.length&&state.data.map(item => item.tag)||[]
}
export function exporttask(state){
	return state.data.length&&state.data.map(item => item.task)||[]
}
export function exportcpu(state){
	return state.data.length&&state.data.map(item => item.cpu)||[]
}
export function exportIp(state){
	return state.data.length&&state.data.map(item => item.ip)||[]
}
export function exportPrivateIp(state){
	return state.data.length&&state.data.map(item => item.privateIp)||[]
}
export function exportmemory(state){
	return state.data.length&&state.data.map(item => item.memory)||[]
}
export function exportSlaveNode(state){
	return state.data.length&&state.data.map(item => item.isSlaveNode)||[]
}
export function exportShareNode(state){
	return state.data.length&&state.data.map(item => item.isSharedNode)||[]
}
export function exportname(state){
	return state.data.length&&state.data.map(item => item.name)||[]
}
export function exporthostname(state){
	return state.data.length&&state.data.map(item => item.hostName)||[]
}
export function exportusername(state){
	return state.data.length&&state.data.map(item => item.username)||[]
}
export function exportemail(state){
	return state.data.length&&state.data.map(item => item.email)||[]
}
export function exportcompany(state){
	return state.data.length&&state.data.map(item => item.company)||[]
}
export function exportupdatedTime(state){
	return state.data.length&&state.data.map(item => item.time_update)||[]
}
export function exporttype(state) {
	return state.data.length&&state.data.map(item => item.type)||[]
}
export function exportaddress(state){
	return state.data.length&&state.data.map(item => item.address)||[]
}
export function exportpubkeyValue(state){
	return state.data.length&&state.data.map(item => item.pubkeyValue)||[]
}
export function exportregistry(state){
	return state.data.length&&state.data.map(item => item.registry)||[]
}
export function exportsecure(state){
	return state.data.length&&state.data.map(item => item.secure)||[]
}
export function exportisuse(state){
	return state.data.length&&state.data.map(item => item.isuse)||[]
}
export function exportisUse(state){
	return state.data.length&&state.data.map(item => item.isUse)||[]
}
export function exportuserName(state) {
	return state.data.length&&state.data.map(item => item.userName)||[]
}
export function exporttimecreate(state) {
	return state.data.length&&state.data.map(item => item.time_create)||[]
}
export function exportcomments(state) {
	return state.data.length&&state.data.map(item => item.comments)||[]
}
export function exportstatus(state) {
	return state.data.length&&state.data.map(item => item.status)||[]
}
export function exportnetworkname(state) {
	return state.data.length&&state.data.map(item => item.network.name)||[]
}
export function exportnetworkiprange(state) {
	return state.data.length&&state.data.map(item => item.network.ipRange[0])||[]
}
export function exportnetworksubnet(state) {
	return state.data.length&&state.data.map(item => item.network.subnet[0])||[]
}
export function exportnetworkgateway(state) {
	return state.data.length&&state.data.map(item => item.network.gateway[0])||[]
}
export function exportnetworkdriver(state) {
	return state.data.length&&state.data.map(item => item.network.driver)||[]
}
