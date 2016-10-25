var Vue = require('vue')
export function get(url, params, timeout) {
    return new Promise(function(resolve, reject) {
        Vue.http.get(url, {
            _timeout: timeout ? 5000 : undefined,
            params,
            onTimeout: (request) => {
                reject("timeout")
            }
        }).then(function(res) {
            if (res.ok) {
                if (res.body) {
                    resolve(res.body)
                } else {
                    reject("error")
                }
            } else {
                reject(res.body)
            }
        }).catch(function(e) {
            if (e.body) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            } else {
                reject("unknown error")
            }
        })
    })
}

export function post(url, params, timeout) {
    return new Promise(function(resolve, reject) {
        Vue.http.post(url, params, {
            _timeout: timeout ? 5000 : undefined,
            onTimeout: (request) => {
                reject("timeout")
            }
        }).then(function(res) {
            if (res.ok) {
                resolve(res.body)
            } else {
                reject(res.body)
            }
        }).catch(function(e) {
            if (e.body) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            } else {
                reject("unknown error")
            }
        })
    })
}