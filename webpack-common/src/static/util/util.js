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
//export function getQueryString(name) {
//    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
//    var r = window.location.search.substr(1).match(reg);
//    if (r!=null) return r[2];
//    return null;
//}
export const getQueryString = function (name) {
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
 */
export const getUrlParams = function () {
    function getByName(name) {
        const reg = new RegExp(`(^|&|\\?)${name}=([^&]*)(&|$)`, 'i');
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
    [...arguments].forEach((name) => {
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
export const getMobileOperatingSystem = function () {
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
export const append = function (parent, text) {
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
 * @param parent [type: jq对象] [必要，一般是body或其他顶层元素]
 * @param text [type: string] [必要，toast的文案，必须为字符串，最好不要带dom元素]
 * @param showTime [type: number] [可选，要显示的时间，毫秒数]
 * @param hideTime [type: number] [可选，要淡出隐藏的时间，毫秒数]
 * @param styleObj [type: object] [可选，自定义toast的样式；若不想自定义，可传空对象{}]
 * @param styleObj2 [type: object] [可选，自定义.my-toast-text的样式；若不想自定义，可传空对象{}]
 * 注：需要配合css样式，可引入my-toast.css文件
 */
export const myToastFn = function (text, styleObj = {color: '#000'}, styleObj2 = {display: 'flex'}, showTime = 3000, hideTime = 1000) {
    var temp = document.createElement('div');
    // 处理后续使用$('.my-toast')会获取到多个元素的问题，添加一个带时间戳的类名
    var timestampClass = 'toast' + new Date().getTime()
    //console.log(timestampClass);
    var myToastHtml = `<div class="my-toast ${timestampClass}">
    <div class="my-toast-text">
        ${text}
    </div>
</div>`
    //temp.classList.add('my-toast')
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
    var $myToast = $(`.${timestampClass}`)
    var $myToastText = $myToast.find('.my-toast-text')
    // 自定义样式
    $myToast.css(styleObj)
    $myToastText.css(styleObj2)
    //console.log('$myToast：',$myToast) // 有个问题，就是一旦产生多个.my-toast，下面代码就会对这些.my-toast都进行处理，因此要使用时间戳区别它们
    $myToast.show() // 先立即显示，再用fadeIn延迟显示的时间
    $myToast.fadeIn(showTime, function () {
        $myToast.fadeOut(hideTime, function () { // fadeOut必须配合fadeIn（不知道jq会不会更方便些）
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
export const myToastFn2 = function (myToast, canToast, styleObj = {color: '#000'}, showTime = 3000, hideTime = 1000) {
    //if (!canToast) { // 这种在引入该方法时会报错，因为一开始还无法找到canToast这个变量
    if (!canToast.value) {
        console.log('不可点击');
        return
    }
    //canToast = false
    canToast.value = false // 变为不可点击状态
    myToast.css(styleObj) // 自定义样式
    //var showTime1 = showTime || 3000
    myToast.show() // 先立即显示，再用fadeIn延迟显示的时间
    myToast.fadeIn(showTime, function () {
        myToast.fadeOut(hideTime, function () { // fadeOut必须配合fadeIn（不知道jq会不会更方便些）
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
export const autoReload = function (reloadTime, callback) {
    $(function () {
        var $reload
        if ($('#reload').length != 0) {
            // 如果本来就存在这个元素，就不用创建了
            $reload = $('#reload')
            //console.log('已有reload');
            $reload.css({
                position: 'fixed',
                top: '-1000px',
                left: '-500px',
                color: 'transparent'
            })

        } else {
            console.log('新建reload');
            $reload = $('<div id="reload"></div>')
            $reload.html('Reload...')
            $reload.css({
                position: 'fixed',
                top: '-1000px',
                left: '-500px',
                color: 'transparent'
            })
            $('body').append($reload)
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
    var $reload = $(`<div class="${timestampClass}">Reload...</div>`)
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
 * @param UTCTime [type: number] [从1970至今的毫秒数，可直接Date.now()获取]
 * @param timeZone  [type: number] [时区；默认为0时区]
 * @param dateFn  [type: string] [Date对象的某个获取UTC时间的方法，获取当前时区的某项时间数据；默认getUTCFullYear]
 * @returns {*} [返回对应时间数据]
 */
export const getDateTime =  function (UTCTime, timeZone = 0, dateFn = 'getUTCFullYear') {
    var date = new Date(UTCTime + 3600000 * timeZone) // 获取某个时区的当前时间，之后用这个变量结合UTC的几个方法去获取该时区当前的年月日时分等即可
    //var localDate = date[dateFn]() // 根据世界时，获取到年月日时分等其中一项数据，该数据就是该时区当前的时间数据
    return date[dateFn]()
}

/**
 * cutImg不能能压缩图片，只是裁剪了图片
 * @param fileObj [type: object] [比如e.target.files[0]]
 * @param callback [type: fn] [回调函数，比如调用上传接口]
 */
export const cutImg = function (fileObj, callback) {
    if (typeof (FileReader) === 'undefined') {
        console.log('当前浏览器内核不支持base64图标压缩');
        //调用上传方式不压缩
        directTurnIntoBase64(fileObj, callback);
    } else {
        try {
            console.log('开始压缩');
            let reader = new FileReader();
            reader.onload = function (e) {
                let image = document.createElement('img');
                image.onload = function () {
                    let square = 700;   //定义画布的大小，也就是图片压缩之后的像素
                    let canvas = document.createElement('canvas');
                    let context = canvas.getContext('2d');
                    let imageWidth = 0; //压缩图片的大小
                    let imageHeight = 0;
                    let offsetX = 0;
                    let offsetY = 0;

                    canvas.width = square;
                    canvas.height = square;
                    context.clearRect(0, 0, square, square);

                    if (this.width > this.height) {
                        imageWidth = Math.round(square * this.width / this.height);
                        imageHeight = square;
                        offsetX = -Math.round((imageWidth - square) / 2);
                    } else {
                        imageHeight = Math.round(square * this.height / this.width);
                        imageWidth = square;
                        offsetY = -Math.round((imageHeight - square) / 2);
                    }
                    context.drawImage(this, offsetX, offsetY, imageWidth, imageHeight);
                    var data = canvas.toDataURL('image/jpeg');
                    //压缩完成执行回调
                    callback(data);
                }
                image.src = e.target.result // 必须赋值给src属性，比如img的onload都不执行
            };
            reader.readAsDataURL(fileObj);
        } catch (e) {
            console.log('压缩失败');
            //调用直接上传方式  不压缩
            directTurnIntoBase64(fileObj, callback);
        }
    }
}

/**
 * directTurnIntoBase64不对图片进行压缩，直接转成base64
 * @param fileObj
 * @param callback
 */
export const directTurnIntoBase64 = function (fileObj, callback) {
    let r = new FileReader();
    // 转成base64
    r.onload = function () {
        //变成字符串
        let base64 = r.result;
        callback(base64);
    }
    r.readAsDataURL(fileObj);    //转成Base64格式
}

/**
 * compress能压缩图片
 * @param fileObj [type: object] [比如e.target.files[0]]
 * @param obj [type: object] [比如传入{quality:0.7}，设置压缩后的质量]
 * @param callback [type: fn] [回调函数，比如调用上传接口]
 */
export const compress = function (fileObj, obj, callback) {
    console.log('fileObj',fileObj);
    if (!fileObj) return
    if (fileObj.size/1024 > 1025) {
        // 大于1M，进行压缩上传
        try {
            console.log('开始压缩');
            let reader = new FileReader();
            reader.onload = function (e) {
                let image = document.createElement('img');
                image.onload = function () {
                    let that = this;
                    // 默认按比例压缩
                    let w = that.width,
                        h = that.height,
                        scale = w / h;
                    w = obj.width || w;
                    h = obj.height || (w / scale);
                    let quality = 0.7;  // 默认图片质量为0.7
                    //生成canvas
                    let canvas = document.createElement('canvas');
                    let ctx = canvas.getContext('2d');
                    // 创建属性节点
                    let anw = document.createAttribute("width");
                    anw.nodeValue = w;
                    let anh = document.createAttribute("height");
                    anh.nodeValue = h;
                    canvas.setAttributeNode(anw);
                    canvas.setAttributeNode(anh);
                    ctx.drawImage(that, 0, 0, w, h);
                    // 图像质量：小于0.3的话，可能就开始失真严重了
                    if(obj.quality && obj.quality <= 1 && obj.quality > 0){
                        quality = obj.quality;
                    }
                    // quality = obj.quality;
                    // quality值越小，所绘制出的图像越模糊
                    let base64 = canvas.toDataURL('image/jpeg', quality);
                    //压缩完成执行回调
                    callback(base64);
                }
                image.src = e.target.result // 必须赋值给src属性，比如img的onload都不执行
            };
            reader.readAsDataURL(fileObj);
        } catch (e) {
            console.log('压缩失败');
            // 不压缩
            directTurnIntoBase64(fileObj, callback);
        }

    } else {
        // 小于1M不压缩
        console.log('小于1M不压缩');
        directTurnIntoBase64(fileObj, callback);
    }
}

/**
 * photoCompress会获取到图片的base64，然后去调用canvasDataURL对图片进行压缩
 * @param file [type: object] [文件(类型是图片格式)]
 * @param w  [type: object] [文件压缩的后宽度，宽度越小，字节越小，这里其实是对象，比如{quality:0.7}，设置压缩后的质量]
 * @param callback [type: fn] [回调函数，比如调用上传接口]
 * 注：quality被限制最小为0.3了，因为小于0.3的话，图片就开始失真了！
 */
export const photoCompress = function (file, w, callback){
    console.log('file',file);
    if (!file) {
        console.log('file有问题，不是对象吧？');
        return
    }
    let ready = new FileReader();
    /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
    ready.readAsDataURL(file);
    ready.onload = function(){
        let path = this.result;
        canvasDataURL(path, w, callback)
    }
}

/**
 * canvasDataURL会去压缩图片
 * @param path [type: string] [是一个base64的字符串，这里一般会由photoCompress函数传入]
 * @param obj [type: object] [比如传入{quality:0.7}，设置压缩后的质量]
 * @param callback  [type: fn] [回调函数，比如调用上传接口]
 * @param errorCallback  [type: fn] [回调函数，因图片太大而获取图片失败的情况]
 */
const canvasDataURL = function (path, obj, callback, errorCallback){
    console.log('开始压缩');
    let img = new Image();
    img.src = path;
    img.onload = function(){
        let that = this;
        // 默认按比例压缩
        let w = that.width,
            h = that.height,
            scale = w / h;
        w = obj.width || w;
        h = obj.height || (w / scale);
        let quality = 0.7;  // 默认图片质量为0.7
        //生成canvas
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        // 创建属性节点
        let anw = document.createAttribute("width");
        anw.nodeValue = w;
        let anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        // 图像质量：quality值越小，所绘制出的图像越模糊，小于0.3的话，可能就开始失真严重了
        if(obj.quality && obj.quality <= 1 && obj.quality > 0){
            quality = obj.quality;
        }
        console.log('quality:', quality);
        let base64 = canvas.toDataURL('image/jpeg', quality)
        // 回调函数返回base64的值
        callback(base64);

        // // 判断压缩后的图片是否超过1M：由于后台现在能控制限制为10M，所以就不用大于1M再次压缩了，超过10M再压吧？
        // let size = convertBase64UrlToBlob(base64).size
        // console.log('size',size);
        // if (size/1024 > 1024 && quality >= 0.3) {
        //   // 如果压缩后还是大于1M，那就再压缩：发现不能使用之前压缩后获得的base64去压缩，没效果，所以要重新传入quality
        //   let newQua = (quality * 10 - 2) / 10 // js还是不要使用浮点数计算了
        //   canvasDataURL(path, {
        //     quality: newQua
        //   }, callback)
        // } else if (size/1024 > 1024) {
        //   // todo:quality小于0.3了，证明图片太大，可以在这里告知用户图片太大了！
        //   // alert('获取失败，图片太大了！')
        //   errorCallback && errorCallback()
        // } else {
        //   // 回调函数返回base64的值
        //   callback(base64);
        // }
    }
}


/**
 * convertBase64UrlToBlob将base64的图片url数据转换为Blob
 * @param dataUrl [用url方式表示的base64图片数据]
 */
export const convertBase64UrlToBlob = function (dataUrl){
    let arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

/**
 * dataURLtoFile将base64的图片url数据转换为原来的File对象
 * @param dataUrl [用url方式表示的base64图片数据]
 */
export const dataURLtoFile = function (dataUrl, filename='file') {
    let arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

// 放在对象中export，可以直接import Util from './path/util.js'
export default {
    getQueryString,
    getUrlParams,
    getMobileOperatingSystem,
    append,
    myToastFn,
    myToastFn2,
    autoReload,
    autoReload2,
    getDateTime,
    cutImg,
    directTurnIntoBase64,
    compress,
    convertBase64UrlToBlob,
    photoCompress,
    canvasDataURL,
    dataURLtoFile,
}