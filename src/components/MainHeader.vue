<template>
	<link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap.min.css">
	<navbar type="default">
		<!-- Brand as slot -->
		<a slot="brand" href="/" title="Home" class="navbar-brand">
        GetStart
        </a>
		<li v-if="checkPermission()">
			<a v-link="{ path: '/admin/RBACManagement' }">RBAC</a>
		</li>
		<dropdown slot="right" v-if="state.userInfo.name" :text="state.userInfo.name">
			<li><a @click="submitLogout">Logout</a></li>
		</dropdown>
		<li v-else slot="right">
			<a @click="showModal">Login</a>
		</li>
	</navbar>
	<login-modal></login-modal>
</template>

<script>
    import {
        dropdown,
        navbar
    } from 'vue-strap'
    import LoginModal from './LoginModal'
    import authAPI from '../api/auth'
    import checkPermission from '../extend/check-permission'

    export default {
        data() {
            return {
                state: window.state
            }
        },
        components: {
            navbar,
            dropdown,
            LoginModal
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