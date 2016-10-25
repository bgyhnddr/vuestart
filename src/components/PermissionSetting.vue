<template>
    <div v-if="checkPermission()">
        <button @click="addPermission" class="btn btn-default">add permission</button>
        <div style="position:relative">
            <spinner size="md" text="loading..."></spinner>
            <vue-strap-table :err-msg.sync="errMsg" :data.sync="data" :get-data-event="getData" :columns.sync="columns"></vue-strap-table>
        </div>
        <modal :show.sync="showPermissionModel" effect="fade" width="400">
            <div slot="modal-header" class="modal-header">
                <h4 class="modal-title">
                    permission
                </h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <alert :type="alertType">
                    {{alertText}}
                </alert>
                <bs-input v-if="!edit" :value.sync="submitData.code" label="code"></bs-input>
                <bs-input v-else :value.sync="submitData.code" label="code" readonly></bs-input>
                <bs-input :value.sync="submitData.name" label="name"></bs-input>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="showPermissionModel=false">close</button>
                <button :disabled="submitting" type="button" class="btn btn-success" @click="submitPermission">confirm</button>
            </div>
        </modal>
    </div>
</template>
<script>
    import VueStrapTable from './extend/vue-strap-table'
    import {
        spinner,
        modal,
        alert,
        input as bsInput
    } from 'vue-strap'
    import RBAC from '../api/RBAC'
    import checkPermission from '../extend/check-permission'

    export default {
        props: {
            selectable: {
                type: Boolean,
                default: false
            },
            selectEvent: {
                type: String,
                default: 'select'
            }
        },
        components: {
            VueStrapTable,
            spinner,
            modal,
            alert,
            bsInput
        },
        data() {
            let columns = [{
                "header": "code",
                "bind": "code"
            }, {
                "header": "name",
                "bind": "name"
            }, {
                "header": "action",
                "type": "action",
                "items": [{
                    eventName: "edit",
                    tag: "button",
                    class: "btn-xs",
                    text: "edit"
                }, {
                    eventName: "delete",
                    tag: "button",
                    class: "btn-xs",
                    text: "delete"
                }]
            }]
            if (this.selectable) {
                columns.unshift({
                    "header": "",
                    "type": "action",
                    "items": [{
                        eventName: this.selectEvent,
                        tag: "button",
                        class: "btn-xs",
                        text: "choose"
                    }]
                })
            }
            return {
                submitting: false,
                getData: "getData",
                submitData: {
                    code: "",
                    name: ""
                },
                edit: false,
                showPermissionModel: false,
                data: {},
                serverMsg: "",
                columns: columns,
                errMsg: ""
            }
        },
        computed: {
            alertType() {
                return this.valid() ? "success" : "warning"
            },
            alertText() {
                if (this.serverMsg) {
                    return this.serverMsg;
                }
                let returnText = "please input";
                if (!this.valid()) {
                    returnText = "please input"
                }
                return returnText
            }
        },
        methods: {
            checkPermission,
            valid() {
                return this.submitData.code && this.submitData.name
            },
            addPermission() {
                for (var i in this.submitData) {
                    this.submitData[i] = ""
                }
                this.edit = false
                this.showPermissionModel = true
            },
            submitPermission() {
                if (this.valid()) {
                    var that = this
                    that.submitting = true
                    RBAC.submitPermission(that.submitData).then(function(result) {
                        that.submitting = false
                        that.$broadcast("refreshData")
                        that.showPermissionModel = false
                        that.serverMsg = ""
                    }).catch(function(err) {
                        that.submitting = false
                        that.serverMsg = err
                    })
                }
            },
            editPermission(code, name) {
                this.submitData.code = code
                this.submitData.name = name
                this.edit = true
                this.showPermissionModel = true
            },
            deletePermission(code) {
                if (window.confirm("confirm to delete：" + code + "?")) {
                    var that = this
                    RBAC.deletePermission({
                        code: code
                    }).then(function(result) {
                        that.$broadcast("refreshData")
                    }).catch(function(err) {
                        window.alert(err)
                    })
                }
            }
        },
        events: {
            "edit": function(row) {
                this.editPermission(row.code, row.name)
            },
            "delete": function(row) {
                this.deletePermission(row.code)
            },
            "getData": function(pageNum, countPerPage, filterKey, append) {
                let that = this
                that.$broadcast('show::spinner')
                RBAC.getPermissions(pageNum, countPerPage, filterKey).then(function(result) {
                    that.$broadcast('hide::spinner')
                    if (append) {
                        that.data.end = result.end
                        that.data.list = that.data.list.concat(result.list)
                    } else {
                        that.data = result
                    }
                }).catch(function(err) {
                    that.errMsg = err
                    that.$broadcast('hide::spinner')
                })
            }
        },
        ready() {
            this.$broadcast("refreshData")
        }
    }
</script>