/**
 * 一些通用的方法
 */


/**
 * get URL Params，即获取url里的query string
 *
 * USAGE:
 * let paramName = getQueryString('paramName');
 *
 * @returns string|null
 */
//export function getQueryString(name) {
//    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
//    var r = window.location.search.substr(1).match(reg);
//    if (r!=null) return r[2];
//    return null;
//}
function getQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)", "i")
    // 判断window.location.search是否有值，避免url中"?"前面有"#"，导致window.location.search为空字符串
    //var r = window.location.search ? window.location.search.substr(1).match(reg) : window.location.hash.split("?")[1].match(reg)
    var r
    if (window.location.search) {
        r = window.location.search.substr(1).match(reg)
        //console.log('window.location.search：',window.location.search);
        //console.log('window.location.search match：',r);
    } else {
        r = window.location.hash.split("?")[1] ? window.location.hash.split("?")[1].match(reg) : null
        //console.log('window.location.search：',window.location.search);
        //console.log('queryString：',window.location.hash.split("?"));
        //console.log('queryString match：',r);
    }

    if (r != null) return r[2];
    return null;
}

/**
 * get URL Params
 *
 * USAGE:
 * let paramName = getUrlParams('paramName');
 * let { param1, param2 } = getUrlParams('param1', 'params2');
 *
 * @returns {Object, Array}
 * 注：该方法比getQueryString更强大，可一次获取多个query；而且是使用href获取到整个url，所以更安全。
 * arguments在安卓4.4中还不支持，因此可能有兼容问题
 */
function getUrlParams() {
    function getByName(name) {
        //const reg = new RegExp(`(^|&|\\?)${name}=([^&]*)(&|$)`, 'i');
        const reg = new RegExp("(^|&|\\?)" + name + "=([^&]*)(&|$)", "i");
        const param = window.location.href.substring(1).match(reg);
        if (param !== null) {
            return param[2];
        }
        return undefined;
    }

    if (arguments.length === 1) {
        return getByName(arguments[0]) || {};
    }
    let result = {};
    //[...arguments].forEach((name) => {
    //    result[name] = getByName(name);
    //});
    // 将上面的修改为ES5语法的
    var arr = [];
    arr.forEach.call(arguments, function (name) {
        result[name] = getByName(name);
    });
    return result;
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
 * @param styleObj [type: object] [可选，自定义toast的样式；若不想自定义，可传空对象{}]
 * 注：需要配合css样式，可引入my-toast.css文件
 */
function myToastFn(text, styleObj, styleObj2, showTime, hideTime) {
    var temp = document.createElement('div');
    // 处理后续使用$('.my-toast')会获取到多个元素的问题，添加一个带时间戳的类名
    var timestampClass = 'toast' + new Date().getTime()
    //console.log(timestampClass);
    var myToastHtml = '<div class="my-toast ' + timestampClass + '"><div class="my-toast-text">' + text + '</div></div>'
    temp.innerHTML = myToastHtml;
    // 防止元素太多 进行提速
    var frag = document.createDocumentFragment();
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    //parent.appendChild(frag);
    //parent.append(frag);
    $('body').append(frag);

    // 写动画，最后删掉整个元素
    var showTime1 = showTime || 3000
    var hideTime1 = hideTime || 1000
    var $myToast = $('.' + timestampClass)
    var $myToastText = $myToast.find('.my-toast-text')
    // 自定义样式
    $myToast.css(styleObj)
    $myToastText.css(styleObj2)
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
 * @param styleObj [type: object] [可选，自定义toast的样式；在自配的路由项目中zIndex总为1，因此可传这个参数去修改；如果不想自定义，可传空对象{}]
 * 注：为了起到限制作用，canToast必须为对象，且格式为canToast = { value: true }
 * 注：该方法就只操作一个toast，因此需要一个标记变量来限制。
 */
function myToastFn2 (myToast, canToast, styleObj, showTime, hideTime) {
    //if (!canToast) { // 这种在引入该方法时会报错，因为一开始还无法找到canToast这个变量
    if (!canToast.value) {
        console.log('不可点击');
        return
    }
    //canToast = false
    canToast.value = false // 变为不可点击状态
    var showTime1 = showTime || 3000
    var hideTime1 = hideTime || 1000
    myToast.css(styleObj) // 自定义样式
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
 * 注： 每次都要$('#reload').css('top', '-1000px') // 防止一些手机以为transition已经执行完毕，不继续执行
 */
function autoReload(reloadTime, callback) {
    $(function () {
        var $reload
        if ($('#reload').length != 0) {
            // 如果本来就存在这个元素，就不用创建了
            $reload = $('#reload')
            //console.log('已有reload');
            $reload.css({
                position: 'fixed',
                top: '-1000px',
                color: 'transparent'
            })

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

/**
 * autoReload2定时刷新功能，可以自定义要刷新整个页面，或者某个部分；
 * @param reloadTime [type: number] [自动刷新的时间，毫秒数]
 * @param callback [type: func] [回调函数，自定义刷新的内容]
 * 注：与autoReload函数的区别是每次都生成一个新的元素，最后删除这个元素；
 */
export const autoReload2 = function (reloadTime, callback) {
    // 处理后续使用$('.my-toast')会获取到多个元素的问题，添加一个带时间戳的类名
    var timestampClass = 'reload' + new Date().getTime()
    //console.log(timestampClass);
    var $reload = $('<div>Reload...</div>')
    $reload.addClass(timestampClass)
    $reload.css({
        position: 'fixed',
        top: '-1000px',
        left: '-500px',
        color: 'transparent'
    })

    //parent.append($reload);
    $('body').append($reload);

    // 写动画，最后删掉整个元素
    $reload.animate({
        top: '-900px'
    }, reloadTime, 'linear', function () {
        //console.log('准备删除');
        $reload.remove()
        callback && callback()
    })
}


/**
 * getDateTime函数可以获取指定时区的某项时间数据；
 * @param UTCTime [type: number] [从1970至今的毫秒数，可直接Date.now()获取] [为了避免获取到的不是同一时间点的情况，因此不在函数中直接获取]
 * @param timeZone  [type: number] [时区；默认为0时区]
 * @param dateFn  [type: string] [Date对象的某个获取UTC时间的方法，获取当前时区的某项时间数据；默认getUTCFullYear]
 * @returns {*} [返回对应时间数据]
 */
const getDateTime =  function (UTCTime, timeZone, dateFn) {
    var timeZoneCopy = timeZone || 0
    var dateFnCopy = dateFn || 'getUTCFullYear'
    var date = new Date(UTCTime + 3600000 * timeZoneCopy) // 获取某个时区的当前时间，之后用这个变量结合UTC的几个方法去获取该时区当前的年月日时分等即可
    //var localDate = date[dateFnCopy]() // 根据世界时，获取到年月日时分等其中一项数据，该数据就是该时区当前的时间数据
    return date[dateFnCopy]()
}

/**
 * getCurrDateOfTimeZone：获取某个时区的当前时间：以【用户系统时间为基准】，计算出相对于【用户系统时间】的【另一个时区目前的时间】；
 * ->缺点：会受到【用户系统时间】的影响，从而可能导致活动时间计算不准确！
 * ->不要用该函数获取服务器时间，无法准确获取服务器时间，因为用户系统时间如果乱修改，就会干扰到；
 * ->如果要获取服务器时间，请用xhr的方式获取响应头的Date属性；再通过getConventionalDate进行转换；
 * @param localDate [type: Date对象] [比如new Date()，或new Date(服务器时间)]
 * @param offset [type: number] [默认0时区，东时区是负数，西时区是正数，比如东八区是-8，这是因为getTimezoneOffset获取的偏移值是东区为负数，西区为正数，因此东八区是-8]
 * @returns {Date}
 */
function getCurrDateOfTimeZone(localDate, offset) {
    // 利用Date对象得到本地时间
    localDate = localDate || new Date();
    // 由于getTimezoneOffset获取的偏移值是东区为负数，西区为正数，因此东八区是-8
    offset = offset || 0; // 默认0时区
    // if (offset === 0) {
    //     offset = 0; // 0时区
    // } else {
    //     offset = offset || -8; // 默认是东八区
    // }

    let localTime = localDate.getTime(); //通过调用Data()对象的getTime()方法，即可显示1970年1月1日后到此时时间之间的毫秒数。
    // 接下来，通过Data()对象的getTimezoneOffset()方法来找出当地时间偏移值。
    // 在缺省情况下，此方法以分钟显示时区偏移值结果，因此在早先的计算中要将此值转换成毫秒。
    let localOffset = localDate.getTimezoneOffset() * 60000; // 转为毫秒数
    // console.log('localDate.getTimezoneOffset()',localDate.getTimezoneOffset());
    // 然后将当前时间与时区偏移量相加，得到国际标准时间（用毫秒表示的，因为后面还需要计算，所以这里不做转换），
    // 然后与你想要知道的时区的偏移量再进行相加，得到那个时区的时间，然后再利用Date对象将其转换为时间字符串。
    let utcTime = localTime + localOffset; //得到国际标准时间
    // console.log('utcTime',utcTime);
    let calcTime = utcTime + (3600000 * (0 - offset)); // 得到【所需时区】的毫秒数
    return new Date(calcTime);
    // let nd = new Date(calcTime);
    // document.write('指定时区时间是：' + nd.toLocalString());
}

/**
 * getConventionalDate：计算出活动的约定日期，不受【用户系统时间/时区】的影响；
 * ->比如getConventionalDate(new Date('2019/11/23 00:00:00'), -8)，
 * ->代表活动约定以东八区时间为准，该函数就计算出以东八区时间为准的'2019/11/23 00:00:00'；
 * ->再比如getConventionalDate(new Date(xhr获取的服务器时间), 活动约定的时区)，这样就能获取当前准确的服务器时间，然后可以跟其他约定日期进行比较；
 * @param conventionalDate [type: Date对象] [比如new Date('2019/11/23 00:00:00')]
 * @param offset [type: number] [默认东八区，东时区是负数，西时区是正数，比如东八区是-8，这是因为getTimezoneOffset获取的偏移值是东区为负数，西区为正数，因此东八区是-8]
 * @returns {Date}
 */
function getConventionalDate(conventionalDate, offset) {
    // 由于getTimezoneOffset获取的偏移值是东区为负数，西区为正数，因此东八区是-8
    if (offset === 0) {
        offset = 0; // 0时区
    } else {
        offset = offset || -8; // 默认是东八区
    }

    let localTime = conventionalDate.getTime(); //通过调用Data()对象的getTime()方法，即可显示1970年1月1日后到此时时间之间的毫秒数。
    // 接下来，通过Data()对象的getTimezoneOffset()方法来找出当地时间偏移值。
    // 在缺省情况下，此方法以分钟显示时区偏移值结果，因此在早先的计算中要将此值转换成毫秒。
    let localOffset = conventionalDate.getTimezoneOffset();
    // console.log('conventionalDate.getTimezoneOffset()',conventionalDate.getTimezoneOffset());
    // 计算约定时区与本地时区的时差
    let calcOffsetTime = (offset * 60 - localOffset) * 60000;
    // 然后本地时间+时差，就是【所需时区】的毫秒数
    let calcTime = localTime + calcOffsetTime; //得到【所需时区】的毫秒数
    // console.log('calcTime',calcTime);
    return new Date(calcTime);
}

// getServeDate：通过xhr获取服务器时间：用这种方式确实能获取到服务器时间的，但需要通过getConventionalDate转换，否则会受到【用户系统时区】的影响；
//->但其实更好是让后台返回服务器的当前【时间戳】，就不怕new Date()转换时受到【用户系统时区】的影响！
function getServeDate(opts={}) {
    // 用axios的方式获取，也可通过jquery的$.ajax进行获取，原理一样的；
    axios({
        // url: 'https://test-bbc-other.iauto360.cn/frontpage/Double12/vueAct/rotaryTable.html',
        url: window.location.href,
    }).then((res) => {
        let dateStr = res.request.getResponseHeader('Date') // 当前服务器时间
        let date = new Date(res.request.getResponseHeader('Date'))
        // let date = new Date('Thu, 21 Nov 2019 08:06:25 GMT')
        // let date = new Date('2019/11/23 00:00:00')
        // 根据该服务器时间，获取活动约定时区(opts.offset)当前的时间，比如东八区-8，
        // 然后就能跟其他用getConventionalDate转换的活动约定日期进行比较了！
        let offset = -8;
        if (opts.offset === 0) {
            offset = 0
        } else {
            offset = opts.offset || -8;
        }
        let currActDate = getConventionalDate(date, offset)
        console.log('服务器时间', dateStr);
        console.log('服务器时间-日',date.getDate());
        console.log('服务器时间-时',date.getHours());
        console.log('服务器时间-分',date.getMinutes());
        console.log('服务器时间-秒',date.getSeconds());
        console.log('服务器时间-毫秒数',date.getTime());
        console.log('活动约定时区此时的时间-毫秒数',currActDate.getTime());
        console.log('活动约定时区此时的时间-日',currActDate.getDate());
        console.log('活动约定时区此时的时间-时',currActDate.getHours());

        opts.success && opts.success(currActDate);

    }).catch((err) => {
        console.log('服务器时间-进入catch',err);
        opts.error && opts.error(err);
    });
}

const Util = {
    getQueryString: getQueryString,
    getUrlParams: getUrlParams,
    getMobileOperatingSystem: getMobileOperatingSystem,
    append: append,
    myToastFn: myToastFn,
    myToastFn2: myToastFn2,
    autoReload: autoReload,
    autoReload2: autoReload2,
    getDateTime: getDateTime,
}
