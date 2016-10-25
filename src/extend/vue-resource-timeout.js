export default function(request, next) {
    var timeout;
    // 這裡改用 _timeout ，就不會觸發原本的
    if (request._timeout) {
        // 一樣綁定一個定時器，但是這裡是只要觸發了，就立即返回 response ， 並且這邊自定義了 status 和 statusText
        timeout = setTimeout(() => {
            if (request.onTimeout) request.onTimeout(request)
            request.abort()
        }, request._timeout);
    }

    next((response) => {
        clearTimeout(timeout);
    });
}