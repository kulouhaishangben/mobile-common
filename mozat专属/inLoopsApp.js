/**
 * Created by Administrator on 2017/8/18 0018.
 * 这些方法是用于loops APP内部webview的，内部webview可以通过这些方法去进行埋点、打开APP中某个界面；
 * 地址：https://confluence.rings.tv/pages/viewpage.action?pageId=4325642
 * 注：这些方法都修改为大部分移动端浏览器可以使用的方法了。
 * 比如：模板字符串从安卓4.4、IOS8开始支持；
 */


/**
 * 创建iframe，基本所有API的调用都是将url传递给该函数。
 */
function iframeInsert(url) {

    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'loopsmozat://' + url);
    console.log(url);
    iframe.style.height = 0;
    iframe.style.width = 0;
    iframe.style.position = 'absolute';
    iframe.style.zIndex = -1000;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    // after 1000ms. remove the iframe to make it looks clean.
    setTimeout(function() {
        document.body.removeChild(iframe)
    }, 1000);
}

/**
 * 打开手机的APP Store的接口
 * @param iosId [写死为1085411495，除非后续修改了]
 * @param androidId [写死为mozat.rings.loops]
 */
function openAppStore() {
    iframeInsert('util/openAppStore?iosId=1085411495&androidId=mozat.rings.loops');
}

/**
 * 埋点的方法
 * @param id  [type: Number]  [埋点工程师规定的一个固定数字]
 * @param params [type: Object] [传入后台需要的参数，比如{ host_id : 主播id }]
 * 通过Object.assign合并成一个对象：比如{ id: 14123, ts: 时间戳, host_id: 主播id }；
 * 注：安卓5.*与IOS8.*都还不支持Object.assign的，因此要进行Polyfill；不过loops应用中是支持的，还好。
 */
function di(id, params) {
    var paramsCopy = params || {}
    // single statistical point in JSON format
    // 由于安卓不支持Object.assign，所以先为Object对象添加该方法（即进行Polyfill）
    if (typeof Object.assign != 'function') {
        Object.assign = function(target) {
            'use strict';
            if (target == null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            target = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source != null) {
                    for (var key in source) {
                        if (Object.prototype.hasOwnProperty.call(source, key)) {
                            target[key] = source[key];
                        }
                    }
                }
            }
            return target;
        };
    }
    const point = Object.assign({}, {
        id: id,
        ts: Date.now()
    }, paramsCopy); //我擦，uc里面，竟然是这里出错了。查询了下，安卓竟然没有支持Object.assign
    const url = 'util/statistical?point=' + JSON.stringify(point);
    console.log('埋点链接：'+ url);
    iframeInsert(url);
    console.log('埋点完毕');
}

/**
 * 跳转用户的个人主页
 * @param hostId [type: Number]
 * 调用general/openChannelprofile?uid=uid这个接口
 */
function openChannelprofile(hostId) {
    const url = 'general/openChannelprofile?uid=' + hostId
    console.log('跳转个人主页的链接：' + url);
    iframeInsert(url)
}


/**
 * 做出提示
 * @param text [type: String]
 */
function toast(text) {
    const encodeText = encodeURI(text)
    const url = 'util/showShortTip?tipText=' + encodeText;
    iframeInsert(url);
}

/**
 *  打开APP中的某个界面
 * @param pageName  [type: String]
 * @param unlockType [type: Number] [-1: default, 0:  ‘all’, 1: ‘broadcaster’, 2: ‘looper ’]
 * 注：只有当 pageName == "mytitle"时需要设置unlockType；且一般传入-1
 * pageName的取值为下面中的某一个：{mydiamond, home(即live tab), mylevel,leaderboard,mytitle,topup,myprofile,upcoming}
 * 使用方式：openAppPage('mytitle', -1)
 */
function openAppPage(pageName, unlockType) {
    const url = 'util/openAppPage?pageName='+ pageName +'&unlockType=' + unlockType;
    iframeInsert(url);
}

/**
 * 这个方法是打开某个视频？？或某个直播间？Tomi说是直播间
 * @param sid [type: String]  [直播间的id，为何是string，不是number？写错了？]
 * @param cid [type: String]  [Tomi说这个是当前用户的userId]
 */
function openVideo(sid, cid) {
    const url = 'broadcast/openVideo?cid=' + cid + '&sid=' + sid;
    iframeInsert(url);
}

/**
 * 打开APP内部的另一个web页面
 * @param url
 * @param title [页面的title]
 * 注：可不传页面title，不传title的话，一开始跳转页面的title是undefined；
 * 使用方式：openURL('https://www-test.loopslive.com/web-loops/sign-in/', 'Get Free Coins')
 */
function openURL(url, title) {
    const encodeUrl = encodeURI(url)
    const encodeTitle = encodeURI(title)
    const iframeURL = 'util/openUrl?url='+ encodeUrl + '&title=' + encodeTitle;
    iframeInsert(iframeURL);
}

/**
 * 关闭当前的web页面
 */
function closeWebviewPage() {
    iframeInsert('general/closeWindow')
}

/**
 * 去直播
 * 需要配合openAppPage，去跳转到home界面；
 * 或者配合closeWebviewPage，直接关闭当前web页面，这个感觉比用openAppPage更好。
 */
function goLive() {
    iframeInsert('broadcast/goLive')
    closeWebviewPage()
}

/**
 * 跳转到反馈建议的页面
 */
function openFeedbackPage() {
    iframeInsert('general/feedback')
}


/**
 * 关注某个用户
 * @param uid [type: Number] [用户id]
 */
function followUser(uid) {
    const url = 'account/follow?uid=' + uid
    iframeInsert(url)
}

/**
 * 取消关注某个用户
 * @param uid [type: Number] [用户id]
 * 注：该接口在预发布环境中测试时，总是没有效果，所以不知道正式环境中有没用；
 * 如果没用，就使用openChannelprofile去打开用户的个人主页
 */
function unfollowUser(uid) {
    const url = 'account/unfollow?uid=' + uid
    iframeInsert(url)
}


/**
 * 跳转用户的Replay列表界面（往期直播列表）
 * @param hostId [type: Number]
 * 调用broadcast/openReplayList?uid=xxx这个接口
 */
function openReplayList(hostId) {
    const url = 'broadcast/openReplayList?uid=' + hostId
    console.log('跳转用户的Replay列表界面的链接：' + url);
    iframeInsert(url)
}


