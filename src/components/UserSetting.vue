<template>
    <div v-if="checkPermission()">
        <button @click="addUser" class="btn btn-default">add user</button>
        <div style="position:relative">
            <spinner size="md" text="loading..."></spinner>
            <vue-strap-table :err-msg.sync="errMsg" :data.sync="data" :get-data-event="getData" :columns="columns"></vue-strap-table>
        </div>
        <modal :show.sync="showUserModel" effect="fade" width="400">
            <div slot="modal-header" class="modal-header">
                <h4 class="modal-title">
                    user
                </h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <alert :type="alertType">
                    {{alertText}}
                </alert>
                <bs-input :value.sync="account" label="account"></bs-input>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="showUserModel=false">close</button>
                <button :disabled="submitting" type="button" class="btn btn-success" @click="submitAddAccount">create</button>
            </div>
        </modal>
        <modal width="100%" :show.sync="showUserRoleModel" effect="fade">
            <div slot="modal-header" class="modal-header">
                <h4 class="modal-title">
                    user-role
                </h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <user-role-setting :user="user"></user-role-setting>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="showUserRoleModel=false">close</button>
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
    import UserRoleSetting from './UserRoleSetting'
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
            UserRoleSetting
        },
        data() {
            let columns = [{
                "header": "account",
                "bind": "account"
            }, {
                "header": "password",
                "bind": "password"
            }, {
                "header": "action",
                "type": "action",
                "items": [{
                    eventName: "editUserRole",
                    tag: "button",
                    class: "btn-xs",
                    text: "edit user-role"
                }, {
                    eventName: "reset",
                    tag: "button",
                    class: "btn-xs",
                    text: "reset password"
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
                account: "",
                showUserModel: false,
                data: {},
                serverMsg: "",
                showUserRoleModel: false,
                user: "",
                columns: columns,
                errMsg: ""
            }
        },
        computed: {
            alertType() {
                return this.account ? "success" : "warning"
            },
            alertText() {
                if (this.serverMsg) {
                    return this.serverMsg;
                }
                let returnText = "plase input";
                if (!this.account) {
                    returnText = "plase input"
                }
                return returnText
            }
        },
        methods: {
            checkPermission,
            addUser() {
                this.account = ""
                this.showUserModel = true
            },
            submitAddAccount() {
                if (this.account) {
                    var that = this
                    that.submitting = true
                    RBAC.addUser({
                        account: that.account
                    }).then(function(result) {
                        that.$broadcast("refreshData")
                        that.showUserModel = false
                        that.submitting = false
                    }).catch(function(err) {
                        that.serverMsg = err
                        that.submitting = false
                    })
                }
            },
            resetPassword(account) {
                if (window.confirm("confirm to reset：" + account + "'s password?")) {
                    var that = this
                    RBAC.resetPassword({
                        account: account
                    }).then(function(result) {
                        that.$broadcast("refreshData")
                    }).catch(function(err) {
                        window.alert(err)
                    })
                }
            },
            deleteUser(account) {
                if (window.confirm("confirm to delete：" + account + "?")) {
                    var that = this
                    RBAC.deleteUser({
                        account: account
                    }).then(function(result) {
                        that.$broadcast("refreshData")
                    }).catch(function(err) {
                        window.alert(err)
                    })
                }
            }
        },
        events: {
            "delete": function(row) {
                this.deleteUser(row.account)
            },
            "getData": function(pageNum, countPerPage, filterKey, append) {
                let that = this
                that.$broadcast('show::spinner')
                RBAC.getUsers(pageNum, countPerPage, filterKey).then(function(result) {
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
            'reset': function(row) {
                this.resetPassword(row.account)
            },
            'editUserRole': function(row) {
                this.showUserRoleModel = true
                this.user = row.account
            }
        },
        ready() {
            this.$broadcast("refreshData")
        }
    }
</script>