var exec = {
    getUsers(req, res, next) {
        var user = require('../../db/models/user')

        var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
        var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
        var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

        return Promise.all([
            user.findAll({
                where: {
                    account: {
                        $and: {
                            $not: "admin",
                            $like: "%" + filterKey + "%"
                        }
                    }
                },
                offset: page * count,
                limit: count
            }),
            user.count({
                where: {
                    account: {
                        $and: {
                            $not: "admin",
                            $like: "%" + filterKey + "%"
                        }
                    }
                }
            })
        ]).then(function(result) {
            var list = result[0]
            var rowCount = result[1]
            return {
                end: (list.length + page * count) >= rowCount,
                list: list
            }
        })
    },
    addUser(req, res, next) {
        var user = require('../../db/models/user')
        var account = req.body.account
        if (account) {
            return user.findOne({
                where: {
                    account: account
                }
            }).then(function(result) {
                if (result != null) {
                    return Promise.reject({
                        "code": "error",
                        "msg": 'account already exists'
                    })
                } else {
                    return user.create({
                        account: account,
                        password: "123"
                    })
                }
            })
        } else {
            return Promise.reject({
                "code": "error",
                "msg": 'account require'
            })
        }
    },
    resetPassword(req, res, next) {
        var user = require('../../db/models/user')
        var account = req.body.account
        if (account) {
            return user.findOne({
                where: {
                    account: account
                }
            }).then(function(result) {
                if (result == null) {
                    return Promise.reject({
                        "code": "error",
                        "msg": 'account not exists'
                    })
                } else {
                    result.password = "123"
                    return result.save()
                }
            }).then(function(result) {
                return 'success'
            })
        } else {
            return Promise.reject({
                "code": "error",
                "msg": 'account require'
            })
        }
    },
    deleteUser(req, res, next) {
        var user = require('../../db/models/user')
        var user_role = require('../../db/models/user_role')

        var account = req.body.account
        if (account && account != "admin") {
            return Promise.all([
                user_role.destroy({
                    where: {
                        user_account: account
                    }
                }),
                user.destroy({
                    where: {
                        account: account
                    }
                })
            ])
        } else {
            return "do nothing"
        }
    },
    getRoles(req, res, next) {
        var role = require('../../db/models/role')

        var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
        var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
        var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

        return Promise.all([
            role.findAll({
                where: {
                    $and: {
                        code: {
                            $not: "admin"
                        },
                        $or: {
                            code: {
                                $like: "%" + filterKey + "%"
                            },
                            name: {
                                $like: "%" + filterKey + "%"
                            }
                        }
                    }
                },
                offset: page * count,
                limit: count
            }),
            role.count({
                where: {
                    $and: {
                        code: {
                            $not: "admin"
                        },
                        $or: {
                            code: {
                                $like: "%" + filterKey + "%"
                            },
                            name: {
                                $like: "%" + filterKey + "%"
                            }
                        }
                    }
                }
            })
        ]).then(function(result) {
            var list = result[0]
            var rowCount = result[1]
            return {
                end: (list.length + page * count) >= rowCount,
                list: list
            }
        })
    },
    submitRole(req, res, next) {
        var code = req.body.code
        var name = req.body.name ? req.body.name : ""
        if (code) {
            var role = require('../../db/models/role')
            var user_role = require('../../db/models/user_role')
            var role_permission = require('../../db/models/role_permission')
            return role.upsert({
                code: code,
                name: name
            }).then(function() {
                return Promise.all([
                    user_role.update({
                        role_code: code
                    }, {
                        where: {
                            role_code: code
                        }
                    }),
                    role_permission.update({
                        role_code: code
                    }, {
                        where: {
                            role_code: code
                        }
                    })
                ])
            })
        } else {
            return Promise.reject({
                "code": "error",
                "msg": 'role code require'
            })
        }
    },
    deleteRole(req, res, next) {
        var role = require('../../db/models/role')
        var user_role = require('../../db/models/user_role')
        var role_permission = require('../../db/models/role_permission')
        var code = req.body.code
        if (code && code != "admin") {
            return Promise.all([
                user_role.destroy({
                    where: {
                        role_code: code
                    }
                }),
                role.destroy({
                    where: {
                        code: code
                    }
                }),
                role_permission.destroy({
                    where: {
                        role_code: code
                    }
                })
            ])
        } else {
            return "do noting"
        }
    },
    getPermissions(req, res, next) {
        var permission = require('../../db/models/permission')

        var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
        var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
        var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

        return Promise.all([
            permission.findAll({
                where: {
                    $and: {
                        code: {
                            $not: "admin"
                        },
                        $or: {
                            code: {
                                $like: "%" + filterKey + "%"
                            },
                            name: {
                                $like: "%" + filterKey + "%"
                            }
                        }
                    }
                },
                offset: page * count,
                limit: count
            }),
            permission.count({
                where: {
                    $and: {
                        code: {
                            $not: "admin"
                        },
                        $or: {
                            code: {
                                $like: "%" + filterKey + "%"
                            },
                            name: {
                                $like: "%" + filterKey + "%"
                            }
                        }
                    }
                }
            })
        ]).then(function(result) {
            var list = result[0]
            var rowCount = result[1]
            return {
                end: (list.length + page * count) >= rowCount,
                list: list
            }
        })
    },
    submitPermission(req, res, next) {
        var code = req.body.code
        var name = req.body.name ? req.body.name : ""
        if (code) {
            var permission = require('../../db/models/permission')
            var role_permission = require('../../db/models/role_permission')
            return permission.upsert({
                code: code,
                name: name
            }).then(function() {
                return role_permission.update({
                    permission_code: code
                }, {
                    where: {
                        permission_code: code
                    }
                })
            })
        } else {
            return Promise.reject({
                "code": "error",
                "msg": 'permission code require'
            })
        }
    },
    deletePermission(req, res, next) {
        var permission = require('../../db/models/permission')
        var role_permission = require('../../db/models/role_permission')
        var code = req.body.code
        if (code && code != "admin") {
            return Promise.all([
                permission.destroy({
                    where: {
                        code: code
                    }
                }),
                role_permission.destroy({
                    where: {
                        permission_code: code
                    }
                })
            ])
        } else {
            return "do noting"
        }
    },
    getUserRoles(req, res, next) {
        var user_role = require('../../db/models/user_role')
        var role = require('../../db/models/role')
        user_role.belongsTo(role, {
            foreignKey: 'role_code',
            targetKey: 'code',
            constraints: false
        })

        var user = req.query.user
        var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
        var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
        var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

        return Promise.all([
            user_role.findAll({
                include: [{
                    model: role
                }],
                where: {
                    $and: {
                        user_account: {
                            $and: {
                                $not: "admin",
                                $eq: user
                            }
                        },
                        role_code: {
                            $not: "admin"
                        },
                        role_code: {
                            $like: "%" + filterKey + "%"
                        }
                    }
                },
                offset: page * count,
                limit: count
            }),
            user_role.count({
                include: [{
                    model: role
                }],
                where: {
                    $and: {
                        user_account: {
                            $and: {
                                $not: "admin",
                                $eq: user
                            }
                        },
                        role_code: {
                            $not: "admin"
                        },
                        role_code: {
                            $like: "%" + filterKey + "%"
                        }
                    }
                }
            })
        ]).then(function(result) {
            var list = result[0]
            var rowCount = result[1]
            return {
                end: (list.length + page * count) >= rowCount,
                list: list
            }
        })
    },
    submitUserRole(req, res, next) {
        var id = req.body.id
        var role_code = req.body.role_code ? req.body.role_code : ""
        var user_account = req.body.user_account
        if (role_code) {
            var user_role = require('../../db/models/user_role')
            if (id) {
                return user_role.update({
                    role_code: role_code
                }, {
                    where: {
                        id: id,
                        user_account: user_account
                    }
                })
            } else {
                return user_role.create({
                    user_account: user_account,
                    role_code: role_code
                })
            }
        } else {
            return Promise.reject({
                "code": "error",
                "msg": 'role require'
            })
        }
    },
    deleteUserRole(req, res, next) {
        var user_role = require('../../db/models/user_role')

        var id = req.body.id
        if (id) {
            return user_role.destroy({
                where: {
                    id: id
                }
            }).then(function() {
                return "success"
            })
        } else {
            return "do noting"
        }
    },
    getRolePermissions(req, res, next) {
        var role_permission = require('../../db/models/role_permission')
        var role = require('../../db/models/role')
        var permission = require('../../db/models/permission')

        role_permission.belongsTo(role, {
            foreignKey: 'role_code',
            targetKey: 'code',
            constraints: false
        })

        role_permission.belongsTo(permission, {
            foreignKey: 'permission_code',
            targetKey: 'code',
            constraints: false
        })
        var role_code = req.query.role
        var filterKey = req.query.filterKey == undefined ? "" : req.query.filterKey
        var count = req.query.count == undefined ? 5 : parseInt(req.query.count)
        var page = req.query.page == undefined ? 0 : parseInt(req.query.page)

        return Promise.all([
            role_permission.findAll({
                include: [role, permission],
                where: {
                    $and: {
                        role_code: {
                            $and: {
                                $not: "admin",
                                $eq: role_code
                            }
                        },
                        permission_code: {
                            $not: "admin"
                        },
                        $or: {
                            permission_code: {
                                $like: "%" + filterKey + "%"
                            }
                        }
                    }
                },
                offset: page * count,
                limit: count
            }),
            role_permission.count({
                include: [role, permission],
                where: {
                    $and: {
                        role_code: {
                            $and: {
                                $not: "admin",
                                $eq: role_code
                            }
                        },
                        permission_code: {
                            $not: "admin"
                        },
                        $or: {
                            permission_code: {
                                $like: "%" + filterKey + "%"
                            }
                        }
                    }
                }
            })
        ]).then(function(result) {
            var list = result[0]
            var rowCount = result[1]
            return {
                end: (list.length + page * count) >= rowCount,
                list: list
            }
        })
    },
    submitRolePermission(req, res, next) {
        var id = req.body.id
        var permission_code = req.body.permission_code ? req.body.permission_code : ""
        var role_code = req.body.role_code
        if (permission_code) {
            var role_permission = require('../../db/models/role_permission')
            if (id) {
                return role_permission.update({
                    permission_code: permission_code
                }, {
                    where: {
                        id: id,
                        role_code: role_code
                    }
                })
            } else {
                return role_permission.create({
                    permission_code: permission_code,
                    role_code: role_code
                })
            }
        } else {
            return Promise.reject({
                "code": "error",
                "msg": 'permission require'
            })
        }
    },
    deleteRolePermission(req, res, next) {
        var role_permission = require('../../db/models/role_permission')

        var id = req.body.id
        if (id) {
            return role_permission.destroy({
                where: {
                    id: id
                }
            }).then(function() {
                return "success"
            })
        } else {
            return "do nothing"
        }
    }
}

module.exports = (req, res, next) => {
    var action = req.params.action
    Promise.resolve(action).then(function(result) {
        try {
            return exec[result](req, res, next)
        } catch (e) {
            console.log(e)
            res.send(e)
        }
    }).then(function(result) {
        res.send(result)
    }).catch(function(error) {
        res.status(500).send(error.toString())
    })

}