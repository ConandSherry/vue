<template>
	<div style="text-align: center;margin-top: 12px;margin-bottom:12px;">
		<div class="button_type" @click="jump('first')">{{$t('directive.pagination.first')}}</div>
		<div class="button_type" @click="jump('before')">{{$t('directive.pagination.previous')}}</div>
		<div :class="[choose[0]?'choose':'no_choose']" @click="jump(-4)" v-if="length>=(middle-4)">{{middle-4}}</div>
		<div :class="[choose[1]?'choose':'no_choose']" @click="jump(-3)" v-if="length>=(middle-3)">{{middle-3}}</div>
		<div :class="[choose[2]?'choose':'no_choose']" @click="jump(-2)" v-if="length>=(middle-2)">{{middle-2}}</div>
		<div :class="[choose[3]?'choose':'no_choose']" @click="jump(-1)" v-if="length>=(middle-1)">{{middle-1}}</div>
		<div :class="[choose[4]?'choose':'no_choose']" @click="jump(0)" v-if="length>=(middle)">{{middle}}</div>
		<div :class="[choose[5]?'choose':'no_choose']" @click="jump(1)" v-if="length>=(middle+1)">{{middle+1}}</div>
		<div :class="[choose[6]?'choose':'no_choose']" @click="jump(2)" v-if="length>=(middle+2)">{{middle+2}}</div>
		<div :class="[choose[7]?'choose':'no_choose']" @click="jump(3)" v-if="length>=(middle+3)">{{middle+3}}</div>
		<div :class="[choose[8]?'choose':'no_choose']" @click="jump(4)" v-if="length>=(middle+4)">{{middle+4}}</div>
		<div :class="[choose[9]?'choose':'no_choose']" @click="jump(5)" v-if="length>=(middle+5)">{{middle+5}}</div>
		<div class="button_type" @click="jump('next')">{{$t('directive.pagination.next')}}</div>
		<div class="button_type" @click="jump('end')">{{$t('directive.pagination.last')}}</div>
		<div style="display:inline-block;margin-left:20px;font-size:12px;">{{$t('directive.pagination.total')}} {{total}} {{$t('directive.pagination.record')}}</div>
	</div>
</template>
<script>
	import {
		getCurrentPage,
		getTotalPage,
		getTotalRecord
	} from '../../vuex/getters'
	import {
		setCurrentPage
	} from '../../vuex/actions'
	module.exports = {
		ready: function() {
			this.cal();
		},
		data: function() {
			return {
				choose: new Array(10),
				middle: 5
			};
		},
		vuex: {
			getters: {
				present: getCurrentPage,
				length: getTotalPage,
				total: getTotalRecord
			},
			actions: {
				setCurrentPage
			}
		},
		watch: {
			present: 'cal'
		},
		methods: {
			cal: function() {
				if(this.present < 5 || this.present > this.length - 5) {
					if(this.present < 5) {
						this.middle = 5;
						let po = this.choose.indexOf(true);
						this.choose.$set(po, false);
						this.choose.$set(this.present - 1, true);
					} else {
						if(this.length > 10) {
							this.middle = this.length - 5;
							let po = this.choose.indexOf(true);
							this.choose.$set(po, false);
							this.choose.$set(this.present - (this.length - 5) + 4, true);
						} else {
							let po = this.choose.indexOf(true);
							this.choose.$set(po, false);
							this.choose.$set(this.present - 1, true);
						}
					}
				} else {
					this.middle = this.present;
					var po = this.choose.indexOf(true);
					this.choose.$set(po, false);
					this.choose.$set(4, true);
				}
			},
			jump: function(type) {
				let po = this.choose.indexOf(true);
				switch(type) {
					case "first":
						if(this.total == 0) {
							return
						} else {
							if(this.present != 1) {
								this.choose[po] = false;
								this.choose[0] = true;
								this.middle = 5;
							} else return;
							break;
						}
					case "before":
						if(this.total == 0) {
							return
						} else {
							if(this.present != 1) {
								if(this.middle > 5) {
									if(po > 4 && this.middle == (this.length - 5)) {
										this.choose[po] = false;
										this.choose[po - 1] = true;
									} else
										this.middle--;
								} else {
									if(po != 0) {
										this.choose[po] = false;
										this.choose[po - 1] = true;
									}
								}
							} else return;
							break;
						}
					case "next":
						if(this.total == 0) {
							return
						} else {
							if(this.present != this.length) {
								if(this.length >= 10) {
									if(this.middle < (this.length - 5)) {
										if(po < 4 && this.middle == 5) {
											this.choose[po] = false;
											this.choose[po + 1] = true;
										} else
											this.middle++;
									} else {
										if(po + 1 < 10) {
											this.choose[po] = false;
											this.choose[po + 1] = true;
										}
									}
								} else {
									if(po != this.length - 1) {
										this.choose[po] = false;
										this.choose[po + 1] = true;
									} else return;
								}
							} else return;
							break;
						}
					case "end":
						if(this.total == 0) {
							return
						} else {
							if(this.present != this.length) {
								this.choose[po] = false;
								if(this.length > 10) {
									this.middle = this.length - 5;
									this.choose[9] = true;
								} else {
									this.choose[this.length - 1] = true;
								}
							} else return;
							break;
						}
					default:
						if(this.length > 10) {
							if(po == 4) {
								if(this.middle + type >= 5 && this.middle + type < this.length - 5) {
									this.middle = this.middle + type;
									if(this.present == this.middle) return;
								} else {
									if(this.middle + type < 5) {
										this.choose[this.middle - 1 + type] = true;
										this.middle = 5;
									} else {
										this.choose[type - this.length + 9 + this.middle] = true;
										this.middle = this.length - 5;
									}
									if(this.choose.lastIndexOf(true) != this.choose.indexOf(true)) {
										this.choose[po] = false;
									} else return;
								}
							}
							if(po < 4) {
								if(type < 0) {
									this.choose[type + 4] = true;
								} else {
									this.choose[4] = true;
									this.middle = type + 5;
								}
								if(this.choose.lastIndexOf(true) != this.choose.indexOf(true)) {
									this.choose[po] = false;
								} else return;
							}
							if(po > 4) {
								if(type < 0) {
									this.choose[4] = true;
									this.middle = this.middle + type;
								} else {
									this.choose[type + 4] = true;
								}
								if(this.choose.lastIndexOf(true) != this.choose.indexOf(true)) {
									this.choose[po] = false;
								} else return;
							}
						} else {
							this.choose[type + 4] = true;
							if(this.choose.lastIndexOf(true) != this.choose.indexOf(true)) {
								this.choose[po] = false;
							} else return;
						}
						break;
				};
				this.setCurrentPage(this.choose.indexOf(true) + this.middle - 4)
			}
		}
	}
</script>