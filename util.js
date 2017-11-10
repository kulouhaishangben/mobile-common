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


/**
 * myToastFn会生成一个toast，并且有淡入淡出效果（依赖zepto的fade），最后会删除这个生成的toast；
 * @param parent [type: jQ对象] [必要，一般是body或其他顶层元素]
 * @param text [type: string] [必要，toast的文案，必须为字符串，最好不要带dom元素]
 * @param showTime [type: number] [可选，要显示的时间，毫秒数]
 * @param hideTime [type: number] [可选，要淡出隐藏的时间，毫秒数]
 * 注：需要配合css样式，可引入my-toast.css文件
 */
function myToastFn (parent, text, showTime, hideTime) {
    var temp = document.createElement('div');
    // 处理后续使用$('.my-toast')会获取到多个元素的问题，添加一个带时间戳的类名
    var timestampClass = 'toast' + new Date().getTime()
    //console.log(timestampClass);
    var myToastHtml = '<div class="my-toast ' + timestampClass + '"><div class="my-toast-text">' + text + '</div></div>'
    temp.classList.add('my-toast')
    temp.innerHTML = myToastHtml;
    // 防止元素太多 进行提速
    var frag = document.createDocumentFragment();
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    //parent.appendChild(frag);
    parent.append(frag);

    // 写动画，最后删掉整个元素
    var showTime1 = showTime || 3000
    var hideTime1 = hideTime || 1000
    var $myToast = $('.' + timestampClass)
    //console.log('$myToast：',$myToast) // 有个问题，就是一旦产生多个.my-toast，下面代码就会对这些.my-toast都进行处理
    $myToast.show() // 先立即显示，再用fadeIn延迟显示的时间
    $myToast.fadeIn(showTime1, function () {
        $myToast.fadeOut(hideTime1, function () { // fadeOut必须配合fadeIn（不知道jq会不会更方便些）
            //console.log('准备删除');
            $myToast.remove()
        })
    })
}


/**
 * myToastFn2处理.my-toast盒子的显示，需要一个标记变量来限制；
 * @param myToast [type: jq对象] [必要，要显示的toast元素]
 * @param canToast [type: object] [必要，标记变量，限制toast盒子的多次显示]
 * @param showTime [type: number] [可选，要显示的时间，毫秒数]
 * @param hideTime [type: number] [可选，要淡出隐藏的时间，毫秒数]
 * 注：为了起到限制作用，canToast必须为对象，且格式为canToast = { value: true }
 * 注：该方法就只操作一个toast，因此需要一个标记变量来限制。
 */
function myToastFn2 (myToast, canToast, showTime, hideTime) {
    //if (!canToast) { // 这种在引入该方法时会报错，因为一开始还无法找到canToast这个变量
    if (!canToast.value) {
        console.log('不可点击');
        return
    }
    //canToast = false
    canToast.value = false // 变为不可点击状态
    var showTime1 = showTime || 3000
    var hideTime1 = hideTime || 1000
    myToast.show() // 先立即显示，再用fadeIn延迟显示的时间
    myToast.fadeIn(showTime1, function () {
        myToast.fadeOut(hideTime1, function () { // fadeOut必须配合fadeIn（不知道jq会不会更方便些）
            //canToast = true
            canToast.value = true
        })
    })
}


/**
 * 定时刷新功能，可以自定义要刷新整个页面，或者某个部分；
 * @param reloadTime [type: number] [自动刷新的时间，毫秒数]
 * @param callback [type: func] [回调函数，自定义刷新的内容]
 * 注：必须依赖jquery或zepto，里面的animate也是依赖它们的；
 * 注： $('#reload').css('top', '-1000px') // 等animate执行完毕后，要添加这一行代码，防止一些手机以为transition已经执行完毕，不继续执行
 */
function autoReload(reloadTime, callback) {
    $(function () {
        var $reload
        if ($('#reload').length != 0) {
            // 如果本来就存在这个元素，就不用创建了
            $reload = $('#reload')
            //console.log('已有reload');

        } else {
            console.log('新建reload');
            $reload = $('<div id="reload"></div>')
            $reload.html('Reload...')
            $reload.css({
                position: 'fixed',
                top: '-1000px',
                color: 'transparent'
            })
            $('body').append($reload) // 父元素必须也是参数，不然总会获取不到，可能是webpack打包的原因
        }

        $reload.animate({
            top: '-900px'
        }, reloadTime, 'linear', callback)
    })
}