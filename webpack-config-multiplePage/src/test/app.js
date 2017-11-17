import Router from '../static/util/router';

import index from './components/index'; // 引入对应页面的js文件，.js可以省略，如果刚好有index.js，也可以不用写
import activity1 from './components/activity1';


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