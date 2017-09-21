/**
 * 一些通用的方法
 */


/**
 * get URL Params，即获取url里的query string
 *
 * USAGE:
 * let paramName = getQueryString('paramName');
 *
 * @returns string
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return r[2];
    return null;
}


/**
 * 判断手机操作系统。
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *  但后续一般是使用另一个接口去跳转手机里的APP Store：iframeInsert('util/openAppStore?iosId=1085411495&androidId=mozat.rings.loops')
 * @returns {String}
 */
function getMobileOperatingSystem() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return 'Windows Phone';
    }

    if (/android/i.test(userAgent)) {
        return 'Android';
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'iOS';
    }

    return 'unknown';
}


/**
 * javascrit原生实现jquery的append()函数
 * @param parent [父元素]
 * @param text  [dom元素或string]
 */
function append(parent, text) {
    if (typeof text === 'string') {
        var temp = document.createElement('div');
        temp.innerHTML = text;
        // 防止元素太多 进行提速
        var frag = document.createDocumentFragment();
        while (temp.firstChild) {
            frag.appendChild(temp.firstChild);
        }
        parent.appendChild(frag);
    }
    else {
        parent.appendChild(text);
    }
}