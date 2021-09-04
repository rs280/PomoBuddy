function getCookie(name) {
    var find = name + "=";
    var things = document.cookie.split("; ");
    for (let i = 0; i < things.length; i += 1) {
        var found = true;
        for (let j = 0; j < find.length; j += 1) {
            if (things[i][j] != find[j]) {
                found = false;
                break;
            }
        }
        if (found) return things[i].split(find)[1];
    }
    return "";
}

function addCookie(name, value) {
    var expire = "expires=Fri, 3 Jan 3000 23:59:59 GMT";
    document.cookie = `${name}=${value}; ${expire};path=/`;
}
