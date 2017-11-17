import $ from 'n-zepto' // zepto的话，可以下载这个n-zepto；导出时，可以随意给变量名，方便！

import '../../../static/css/common.css'
import './index.css'
import _ from 'lodash'
import logo from './images/loops_logo_256.png'
//import banner from 'static/banner.png' // 直接写static，跳过了images文件夹，是因为在配置文件中设置了alias.static: path.resolve(__dirname, './src/static/images'),
//import banner from './static/images/banner.png'
import banner from './images/activity1/banner.png' // 即使static不在同一个文件夹里面，webpack也会自动去转换路径的
//import $ from './static/js/zepto.min.js' // 不行，zepto本身没有CMD模块化，不能直接引入使用，会报错

//import Swiper from 'swiper'
//import $ from 'jquery' // 导出时，可以随意给变量名，方便！那就不一定要使用$了
//import $ from 'zepto'
//import $ from 'n-zepto' // zepto的话，可以下载这个n-zepto；导出时，可以随意给变量名，方便！
//import jq from './static/js/jquery.js' // 也可以直接手动下载后引入，导出时，可以随意给变量名，方便！

//import template from './static/js/index.js'
//import template from 'art-template' // 奇怪，通过npm下载的，引入后会报错；不过即使不引入，也可以成功执行的！应该是插件内部处理好了，但也导致不能分配到公共js文件中。
//import template from 'art-template2'
//import express from 'express'
import art from './index.art' // art其实是一个函数，所以可以接收参数，然后渲染页面

//console.log($('body'));
//console.log(jq('body'));
//console.log(zp2('body'));


// 必须export一个函数出去，让router的render可以正常运行，不然总是报错，阻碍路由的跳转
export default function activity1() {
    var boardPreData = [
        {
            count: '---',
            reward_amount: '---',
            rank: 3,
            profile: {
                user_name: '---',
                avatar: './images/loops_logo_256.png',
            },
        },
        {
            count: '---',
            reward_amount: '---',
            rank: 1,
            profile: {
                user_name: '---',
                avatar: './images/loops_logo_256.png',
            },
        },
        {
            count: '---',
            reward_amount: '---',
            rank: 2,
            profile: {
                user_name: '---',
                avatar: './images/loops_logo_256.png', // 直接写字符串，而没有通过import引入，那webpack是不会进行处理的；但还好这些数据一般是从服务器发送回来，是一个url，也没必要让webpack进行处理！
            },
        },

    ]
//var coinTOP3PreHtml = template('coinTopThreeItem', { coinDataTop3: boardPreData })
//zp('.top-three').html(coinTOP3PreHtml)


//art({ coinDataTop3: boardPreData }) // 编译失败了，但也没报错
    var html = art({
        text: '哈哈哈',
        coinDataTop3: boardPreData
    }) // 我擦，原来是要获取到art方法的返回值，这个返回值才是我们需要的模板代码！
    console.log(html);
    $('#app').html(html)
}


