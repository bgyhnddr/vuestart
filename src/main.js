import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import { configRouter } from './vue-router/route-config'
import { disableHistoryBack } from './extend/disable-history-back'
import { dateformat } from './extend/date-format'

import timei from './extend/vue-resource-timeout'
import authCallback from './extend/auth-callback'

Vue.use(require('vue-resource'))
Vue.http.interceptors.push(timei)
Vue.http.interceptors.push(authCallback)
dateformat()
disableHistoryBack()

window.state = {
    userInfo: { name: "", permissions: [] },
    showLoginModal: false,
    quotation_change: false
}

window.actions = {
        logout: function() {
            window.state.userInfo = { name: "", permissions: [] }
        }
    }
    /* eslint-disable no-new */
Vue.use(VueRouter)

const router = new VueRouter({
    saveScrollPosition: true,
    transitionOnLoad: true
})

configRouter(router)

router.beforeEach((tran) => {
    tran.next();
})

router.start(App, 'app');