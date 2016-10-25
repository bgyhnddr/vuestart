<template>
    <div v-if="checkPermission()">
        <button @click="addRolePermission" class="btn btn-default">add role-permission</button>
        <div style="position:relative">
            <spinner size="md" text="loading..."></spinner>
            <vue-strap-table :err-msg.sync="errMsg" :data.sync="data" :get-data-event="getData" :columns.sync="columns"></vue-strap-table>
        </div>
        <div :class="{'in':showRolePermissionModel}" class="modal fade" :style="{zIndex:(showRolePermissionModel?undefined:-1)}"
            style="display:block;overflow-y:auto;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">
                            role-permission
                        </h4>
                    </div>
                    <div class="modal-body">
                        <label>{{submitData.permission_name}}</label>
                        <button type="button" class="btn btn-default" @click="showPermissionModel=true">choose permission</button>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" @click="showRolePermissionModel=false">close</button>
                        <button :disabled="submitting" type="button" class="btn btn-success" @click="submitRolePermission">confirm</button>
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
        <div :class="{'in':showPermissionModel}" class="modal fade" :style="{zIndex:(showPermissionModel?undefined:-1)}" style="display:block;overflow-y:auto;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">
                            add permission
                        </h4>
                    </div>
                    <div class="modal-body">
                        <permission-setting :selectable="selectable"></permission-setting>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" @click="showPermissionModel=false">close</button>
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
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
    import PermissionSetting from './PermissionSetting'
    import checkPermission from '../extend/check-permission'

    export default {
        props: {
            role: {
                type: String,
                require: true
            }
        },
        watch: {
            'role': function(val) {
                this.$broadcast("refreshData")
            }
        },
        components: {
            VueStrapTable,
            spinner,
            modal,
            alert,
            bsInput,
            PermissionSetting
        },
        data() {
            return {
                selectable: true,
                submitting: false,
                getData: "getData",
                submitData: {
                    id: "",
                    permission_code: "",
                    permission_name: ""
                },
                showRolePermissionModel: false,
                showPermissionModel: false,
                data: {},
                serverMsg: "",
                columns: [{
                    "header": "role",
                    "bind": "role_name"
                }, {
                    "header": "permission",
                    "bind": "permission_name"
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
                }],
                errMsg: ""
            }
        },
        methods: {
            checkPermission,
            addRolePermission() {
                for (var i in this.submitData) {
                    this.submitData[i] = ""
                }
                this.showRolePermissionModel = true
            },
            submitRolePermission() {
                var that = this
                that.submitting = true
                RBAC.submitRolePermission({
                    role_code: that.role,
                    permission_code: that.submitData.permission_code,
                    id: that.submitData.id
                }).then(function(result) {
                    that.submitting = false
                    that.$broadcast("refreshData")
                    that.showRolePermissionModel = false
                    that.serverMsg = ""
                }).catch(function(err) {
                    that.submitting = false
                    that.serverMsg = err
                })
            },
            editRolePermission(row) {
                this.submitData.id = row.id
                this.submitData.permission_code = row.permission_code
                this.submitData.permission_name = row.permission_name
                this.showRolePermissionModel = true
            },
            deleteRolePermission(row) {
                if (window.confirm("confirm to delete：" + row.permission_name + "?")) {
                    var that = this
                    RBAC.deleteRolePermission({
                        id: row.id
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
                this.editRolePermission(row)
            },
            "delete": function(row) {
                this.deleteRolePermission(row)
            },
            "getData": function(pageNum, countPerPage, filterKey, append) {
                let that = this
                that.$broadcast('show::spinner')
                RBAC.getRolePermissions(that.role, pageNum, countPerPage, filterKey).then(function(result) {
                    that.$broadcast('hide::spinner')
                    var list = result.list.map((o) => {
                        if (o.permission) {
                            o.permission_name = o.permission.name
                        }
                        if (o.role) {
                            o.role_name = o.role.name
                        }
                        return o
                    })

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
            "select": function(row) {
                this.submitData = {
                    permission_code: row.code,
                    permission_name: row.name
                }
                this.showPermissionModel = false
            }
        },
        ready() {
            this.$broadcast("refreshData")
        }
    }
</script>