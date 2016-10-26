<template>
	<navbar type="default">
		<!-- Brand as slot -->
		<a slot="brand" href="/" title="Home" class="navbar-brand">
        GetStart
        </a>
		<li v-if="checkPermission()">
			<a v-link="{ path: '/admin/RBACManagement' }">RBAC</a>
		</li>
		<dropdown slot="right" v-if="state.userInfo.name" :text="state.userInfo.name">
			<li><a @click="changePassword=true">change password</a></li>
			<li><a @click="submitLogout">Logout</a></li>
		</dropdown>
		<li v-else slot="right">
			<a @click="showModal">Login</a>
		</li>
	</navbar>
	<login-modal></login-modal>
    <change-password-modal :show.sync="changePassword"></change-password-modal>
</template>

<script>
    import {
        dropdown,
        navbar
    } from 'vue-strap'
    import LoginModal from './LoginModal'
    import ChangePasswordModal from './ChangePasswordModal'
    import authAPI from '../api/auth'
    import checkPermission from '../extend/check-permission'
    require('bootstrap3/dist/css/bootstrap.css')

    export default {
        data() {
            return {
                state: window.state,
                changePassword: false
            }
        },
        components: {
            navbar,
            dropdown,
            LoginModal,
            ChangePasswordModal
        },
        methods: {
            showModal() {
                this.state.showLoginModal = true
            },
            checkPermission,
            submitLogout() {
                var vm = this;
                authAPI.logout().then(function() {
                    window.actions.logout()
                });
            }
        }
    }
</script>