/**
 * 配置路由；
 * 也可以在这里引入公共包，可作用于所有活动页面；
 * 建议要放在比较靠前的css文件在这里引入；
 * 注：util与inLoopsApp在这里引入后无法共享全局，原因还未知；
 */
import './static/css/common.css'
//import './static/css/my-toast.css'
//import './static/lib/swiper/swiper-3.4.2.min.css'

//import * as Util from './static/util/util.js'
//import * as InLoopsApp from './static/util/inLoopsApp.js'

import Router from './static/util/router';
import index from './components/index';
import activity1 from './components/activity1';

// vconsole总是全局，因此直接放这里吧
//import './static/vconsole.min.js'
//import VConsole from 'vconsole'
//var vConsole = new VConsole();

new Router([
    {
        path: '/index',
        render: index
    },
    {
        path: '/activity1',
        render: activity1
    },
], '/index');//第二个参数表示默认路径