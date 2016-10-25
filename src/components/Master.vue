<template>
	<main-header></main-header>
	<router-view></router-view>
</template>

<script>
    import MainHeader from './MainHeader'
    import {
        dropdown,
        navbar
    } from 'vue-strap'
    import authAPI from '../api/auth'

    export default {
        data() {
            return {
                state: window.state
            }
        },
        components: {
            MainHeader
        },
        ready() {
            var vm = this;
            authAPI.getUser()
                .then((userInfo) => {
                    if (userInfo.name) {
                        vm.state.userInfo = userInfo
                    } else {
                        return Promise.reject()
                    }
                })
                .catch((err) => {
                    window.actions.logout()
                    vm.state.showLoginModal = true
                })
        }
    }
</script>