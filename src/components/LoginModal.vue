<template>
	<div @keyup.enter="submitLogin">
		<spinner class="login_loading_zindex" size="md" text="loading..."></spinner>
		<modal class="login_zindex" backdrop="false" :show.sync="state.showLoginModal" effect="fade" width="400">
			<div slot="modal-header" class="modal-header">
				<h4 class="modal-title">
					Login
				</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<alert :type="alertType">
					{{alertText}}
				</alert>
				<div class="form-group">
					<label class="control-label">account</label>
					<input v-el:account v-model="loginInfo.account" class="form-control"  type="text">
                </div>
				<bs-input :value.sync="loginInfo.password" label="password" type="password"></bs-input>
			</div>
			<div slot="modal-footer" class="modal-footer">
				<button type="button" class="btn btn-success" @click="submitLogin">login</button>
			</div>
		</modal>
	</div>
</template>

<script>
    import {
        modal,
        alert,
        spinner,
        input as bsInput
    } from 'vue-strap'
    import authAPI from '../api/auth'

    export default {
        data() {
            return {
                state: window.state,
                serverMsg: "",
                loginInfo: {
                    account: "",
                    password: ""
                }
            }
        },
        components: {
            modal,
            bsInput,
            alert,
            spinner
        },
        computed: {
            alertType() {
                return this.valid() ? "success" : "warning"
            },
            alertText() {
                if (this.serverMsg) {
                    return this.serverMsg;
                }
                let returnText = "please login";
                if (!this.loginInfo.account && !this.loginInfo.password) {
                    returnText = "need account and password"
                } else if (!this.loginInfo.account) {
                    returnText = "account not exists"
                } else if (!this.loginInfo.password) {
                    returnText = "password incorrect"
                }
                return returnText
            }
        },
        methods: {
            valid() {
                return this.loginInfo.account && this.loginInfo.password
            },
            submitLogin() {
                var that = this
                if (that.valid()) {
                    that.$broadcast('show::spinner')
                    authAPI.login(that.loginInfo).then(function(result) {
                        that.state.userInfo = result
                        that.state.showLoginModal = false
                        that.$broadcast('hide::spinner')
                    }).catch(function(err) {
                        console.log(err)
                        that.serverMsg = err
                        that.$broadcast('hide::spinner')
                    })
                }
            }
        },
        watch: {
            'state.showLoginModal': function(val) {
                this.$els.account.focus()
            }
        },
        ready() {
            this.$els.account.focus()
        }
    }
</script>
<style>
    .login_zindex {
        z-index: 10000000 !important;
    }
    
    .login_loading_zindex {
        z-index: 10000001 !important;
    }
</style>