<template>
	<div class="vue-strap-table">
		<div class="table-responsive">
			<div v-show="hasFilter">
				<div class="col-sm-6">
					<bs-input :value.sync="filterKey" @keyup.enter="getData" placeholder="keyword" type="text">
						<span slot="after" class="input-group-btn">
                            <button type="button" @click="getData" class="btn btn-primary">search</button>
                            <button type="button" @click="clearFilter" class="btn btn-default">clear</button>
                        </span>
					</bs-input>
				</div>
			</div>
			<table class="table table-hover table-condensed">
				<thead>
					<tr>
						<th v-for="column of columns | filterBy undefiend in 'hide'">
							{{ column.header }}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row of data.list">
						<td v-for="column of columns | filterBy undefiend in 'hide'">
							<template v-if="column.type == undefined || column.type == 'string'">
								<template v-if="column.format">{{ column.format(row[column.bind],row) }}</template>
								<template v-else>{{ row[column.bind] }}</template>
							</template>
							<template v-if="column.type == 'action'">
								<template v-for="item in column.items">
									<template v-if="item.tag=='button'">
										<button v-if="item.filter?item.filter(row):true" @click="action(item.eventName,row)" class="{{item.class}} btn btn-default">{{item.text}}</button>
									</template>
								</template>
							</template>
							<template v-if="column.type == 'index'">
								{{$parent.$index+1}}
							</template>
						</td>
					</tr>
				</tbody>
			</table>
			<button type="button" v-if="data.end===false" class="btn btn-default" @click="addData">more...</button>
			<div v-if="errMsg">
				{{errMsg}}
			</div>
		</div>
	</div>
</template>
<script>
    import {
        input as bsInput
    } from 'vue-strap'

    export default {
        components: {
            bsInput
        },
        props: {
            pageNum: {
                type: Number,
                default: 0
            },
            countPerPage: {
                type: Number,
                default: 5
            },
            hasFilter: {
                type: Boolean,
                default: true
            },
            filterKey: {
                type: String,
                default: ""
            },
            columns: {
                type: Array
            },
            getDataEvent: {
                type: String,
                default: 'getData',
                require: true
            },
            data: {
                type: Object,
                default: {
                    end: true,
                    list: []
                },
                towWay: true
            },
            errMsg: {
                type: String,
                default: ""
            }
        },
        methods: {
            hideHeader(obj) {
                return !obj.hide
            },
            getData() {
                this.pageNum = 0
                this.errMsg = ""
                this.$dispatch(this.getDataEvent, this.pageNum, this.countPerPage, this.filterKey)
            },
            addData() {
                let that = this
                this.errMsg = ""
                this.pageNum += 1
                this.$dispatch(this.getDataEvent, this.pageNum, this.countPerPage, this.filterKey, true)
            },
            action(event, row) {
                this.$dispatch(event, row)
            },
            clearFilter() {
                this.filterKey = ""
                this.getData()
            }
        },
        events: {
            'refreshData': function() {
                this.getData()
            }
        }
    }
</script>
<style>
	.vue-strap-table {
		position: relative;
	}
</style>