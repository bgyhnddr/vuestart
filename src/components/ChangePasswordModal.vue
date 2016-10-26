<template>
	<div>
		<modal :show.sync="show" effect="fade" width="400">
			<div slot="modal-header" class="modal-header">
				<h4 class="modal-title">
					change password
				</h4>
			</div>
			<div slot="modal-body" class="modal-body">
				<alert :type="alertType">
					{{alertText}}
				</alert>
				<bs-input :value.sync="submitData.password" label="password" type="password"></bs-input>
				<bs-input :value.sync="submitData.newPassword" label="new password" type="password"></bs-input>
				<bs-input :value.sync="submitData.repeatPassword" label="repeat password" type="password"></bs-input>
			</div>
			<div slot="modal-footer" class="modal-footer">
				<button type="button" class="btn btn-default" @click="show=false">close</button>
				<button v-if="valid()" type="button" class="btn btn-success" @click="submit">submit</button>
			</div>
		</modal>
	</div>
</template>

<script>
    import {
        modal,
        alert,
        input as bsInput
    } from 'vue-strap'
    import authAPI from '../api/auth'

    export default {
        data() {
            return {
                serverMsg: "",
                submitData: {
                    password: "",
                    newPassword: "",
                    repeatPassword: ""
                }
            }
        },
        components: {
            modal,
            bsInput,
            alert
        },
        props: {
            show: {
                type: Boolean,
                default: false
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
                if (!this.submitData.password) {
                    returnText = "password require"
                } else if (!this.submitData.newPassword) {
                    returnText = "new password require"
                } else if (this.submitData.repeatPassword != this.submitData.newPassword) {
                    returnText = "repeat password incorrect"
                } else {
                    returnText = "OK"
                }
                return returnText
            }
        },
        methods: {
            valid() {
                return this.submitData.password && this.submitData.newPassword && this.submitData.newPassword == this.submitData.repeatPassword
            },
            submit() {
                var that = this
                if (that.valid()) {
                    that.$broadcast('show::spinner')
                    authAPI.changePassword(that.submitData).then(function() {
                        that.show = false
                    }).catch(function(err) {
                        console.log(err)
                        that.serverMsg = err
                    })
                }
            }
        },
        ready() {
            this.submitData = {
                password: "",
                newPassword: "",
                repeatPassword: ""
            }
        }
    }
</script>