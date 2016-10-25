<template>
    <div v-if="checkPermission()">
        <navbar type="default">
            <a slot="brand" class="navbar-brand">RBAC</a>
            <li v-if="checkPermission()">
                <a v-link="{ path: '/admin/RBACManagement/User' }">User</a>
            </li>
            <li v-if="checkPermission()">
                <a v-link="{ path: '/admin/RBACManagement/Role' }">Role</a>
            </li>
            <li v-if="checkPermission()">
                <a v-link="{ path: '/admin/RBACManagement/Permission' }">Permission</a>
            </li>
        </navbar>
        <router-view></router-view>
    </div>
</template>

<script>
    import {
        navbar
    } from 'vue-strap'
    import checkPermission from '../extend/check-permission'

    export default {
        components: {
            navbar
        },
        methods: {
            checkPermission
        }
    }
</script>