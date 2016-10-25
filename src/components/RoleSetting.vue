<template>
    <div v-if="checkPermission()">
        <button @click="addRole" class="btn btn-default">add role</button>
        <div style="position:relative">
            <spinner size="md" text="loading..."></spinner>
            <vue-strap-table :err-msg.sync="errMsg" :data.sync="data" :get-data-event="getData" :columns.sync="columns"></vue-strap-table>
        </div>
        <modal :show.sync="showRoleModel" effect="fade" width="400">
            <div slot="modal-header" class="modal-header">
                <h4 class="modal-title">
                    role
                </h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <alert :type="alertType">
                    {{alertText}}
                </alert>
                <bs-input v-if="!edit" :value.sync="submitData.code" label="code"></bs-input>
                <bs-input v-else :value.sync="submitData.code" label="code" readonly></bs-input>
                <bs-input :value.sync="submitData.name" label="名稱" required></bs-input>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="showRoleModel=false">close</button>
                <button :disabled="submitting" type="button" class="btn btn-success" @click="submitRole">confirm</button>
            </div>
        </modal>
        <modal width="100%" :show.sync="showRolePermissionModel" effect="fade">
            <div slot="modal-header" class="modal-header">
                <h4 class="modal-title">
                    role-permission
                </h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <role-permission-setting :role="role"></role-permission-setting>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="showRolePermissionModel=false">close</button>
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
    import RolePermissionSetting from './RolePermissionSetting'
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
            bsInput,
            RolePermissionSetting
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
                    eventName: "editRolePermission",
                    tag: "button",
                    class: "btn-xs",
                    text: "edit role-permission"
                }, {
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
                showRoleModel: false,
                showRolePermissionModel: false,
                data: {},
                role: "",
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
            addRole() {
                for (var i in this.submitData) {
                    this.submitData[i] = ""
                }
                this.edit = false
                this.showRoleModel = true
            },
            submitRole() {
                if (this.valid()) {
                    var that = this
                    that.submitting = true
                    RBAC.submitRole(that.submitData).then(function(result) {
                        that.submitting = false
                        that.$broadcast("refreshData")
                        that.showRoleModel = false
                        that.serverMsg = ""
                    }).catch(function(err) {
                        that.submitting = false
                        that.serverMsg = err
                    })
                }
            },
            editRole(code, name) {
                this.submitData.code = code
                this.submitData.name = name
                this.edit = true
                this.showRoleModel = true
            },
            deleteRole(code) {
                if (window.confirm("confirm to delete" + code + "?")) {
                    var that = this
                    RBAC.deleteRole({
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
                this.editRole(row.code, row.name)
            },
            "delete": function(row) {
                this.deleteRole(row.code)
            },
            "getData": function(pageNum, countPerPage, filterKey, append) {
                let that = this
                that.$broadcast('show::spinner')
                RBAC.getRoles(pageNum, countPerPage, filterKey).then(function(result) {
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
            },
            'editRolePermission': function(row) {
                this.showRolePermissionModel = true
                this.role = row.code
            }
        },
        ready() {
            this.$broadcast("refreshData")
        }
    }
</script>