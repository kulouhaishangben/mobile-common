//import _ from 'lodash'
import './static/css/common.css'
import './css/style.css'
import logo from './images/loops_logo_256.png'
import banner from './images/banner.png' // 即使static不在同一个文件夹里面，webpack也会自动去转换路径的

import zp from 'n-zepto' // zepto的话，可以下载这个n-zepto；导出时，可以随意给变量名，方便！
//import jq from '../static/lib/js/jquery.js' // 也可以直接手动下载后引入，导出时，可以随意给变量名，方便！

import { getQueryString } from './static/util/util.js'
import { iframeInsert, di } from './static/util/inLoopsApp.js'


import art from './art-file/1.art' // art其实是一个函数，所以可以接收参数，然后渲染页面

// 直接写字符串，而没有通过import引入，那webpack是不会进行处理的；
// 但还好这些数据一般是从服务器发送回来，是一个url，也没必要让webpack进行处理！
var boardPreData = [
    {
        count: '---',
        reward_amount: '---',
        rank: 3,
        profile: {
            user_name: '---',
            avatar: './static/images/loops_logo_256.png',
        },
    },
    {
        count: '---',
        reward_amount: '---',
        rank: 1,
        profile: {
            user_name: '---',
            avatar: './static/loops_logo_256.png',
        },
    },
    {
        count: '---',
        reward_amount: '---',
        rank: 2,
        profile: {
            user_name: '---',
            avatar: './static/loops_logo_256.png',
        },
    },

]

var html = art({
    text: '哈哈哈',
    coinDataTop3: boardPreData
}) // 我擦，原来是要获取到art方法的返回值，这个返回值才是我们需要的模板代码！
console.log(html);
zp('#app').html(html)

var sa = getQueryString('v')
console.log(sa);

