export function configRouter(router) {
    router.map({
        '/': {
            component: function(resolve) {
                require(['../components/Master.vue'], resolve)
            },
            subRoutes: {}
        },
        '/admin': {
            component: function(resolve) {
                require(['../components/Master.vue'], resolve)
            },
            subRoutes: {
                'RBACManagement': {
                    component: function(resolve) {
                        require(['../components/RBACManagement.vue'], resolve)
                    },
                    subRoutes: {
                        'User': {
                            component: function(resolve) {
                                require(['../components/UserSetting.vue'], resolve)
                            }
                        },
                        'Role': {
                            component: function(resolve) {
                                require(['../components/RoleSetting.vue'], resolve)
                            }
                        },
                        'Permission': {
                            component: function(resolve) {
                                require(['../components/PermissionSetting.vue'], resolve)
                            }
                        }
                    }
                }
            }
        }
    })
}