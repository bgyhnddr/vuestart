export default function (check) {
    var permissions = window.state.userInfo.permissions
    if (permissions.some(o => o == "admin")) {
        return true
    }
    else {
        check = check ? check : []
        return permissions.some((o) => {
            return check.some(p => p == o)
        })
    }
}