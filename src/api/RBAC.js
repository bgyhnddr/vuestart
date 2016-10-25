var request = require('../extend/http-request')
var path = '/service/private/RBAC/'

export default {
    getUsers(page, count, filterKey) {
        return request.get(path + 'getUsers', {
            page,
            count,
            filterKey
        })
    },
    addUser(params) {
        return request.post(path + 'addUser', params)
    },
    deleteUser(params) {
        return request.post(path + 'deleteUser', params)
    },
    resetPassword(params) {
        return request.post(path + 'resetPassword', params)
    },
    getRoles(page, count, filterKey) {
        return request.get(path + 'getRoles', {
            page,
            count,
            filterKey
        })
    },
    submitRole(params) {
        return request.post(path + 'submitRole', params)
    },
    deleteRole(params) {
        return request.post(path + 'deleteRole', params)
    },
    getPermissions(page, count, filterKey) {
        return request.get(path + 'getPermissions', {
            page,
            count,
            filterKey
        })
    },
    submitPermission(params) {
        return request.post(path + 'submitPermission', params)
    },
    deletePermission(params) {
        return request.post(path + 'deletePermission', params)
    },
    getUserRoles(user, page, count, filterKey) {
        return request.get(path + 'getUserRoles', {
            user,
            page,
            count,
            filterKey
        })
    },
    submitUserRole(params) {
        return request.post(path + 'submitUserRole', params)
    },
    deleteUserRole(params) {
        return request.post(path + 'deleteUserRole', params)
    },
    getRolePermissions(role, page, count, filterKey) {
        return request.get(path + 'getRolePermissions', {
            role,
            page,
            count,
            filterKey
        })
    },
    submitRolePermission(params) {
        return request.post(path + 'submitRolePermission', params)
    },
    deleteRolePermission(params) {
        return request.post(path + 'deleteRolePermission', params)
    }
}