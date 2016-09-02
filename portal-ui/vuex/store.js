import Vuex from 'vuex'
import mutations from './mutations'
Vue.use(Vuex)
const state = {
	loading:0,
	data: {},
	selectedIndex: 0,
	pagination: {
		currentPage: 1,
		perPage: 10,
		totalPage: 1,
		totalRecord: 0
	},
	http: {
		address: '',
		params: {}
	},
	errors:{
		show:false,
		info:{}
	},
	cluster: {
		status:"RUNNING",
		type:"amazonec2"
	}
}
export default new Vuex.Store({
	state,
	mutations
})
