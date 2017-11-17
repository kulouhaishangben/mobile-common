import $ from 'n-zepto'
//import '../static/css/common.css'
//import _ from 'lodash'
import './css/style.css'
import art from './art-file/1.art'

console.log(11);
var html = art({
    text: '哈哈哈',
    //coinDataTop3: boardPreData
}) // 我擦，原来是要获取到art方法的返回值，这个返回值才是我们需要的模板代码！
console.log(html);
$('#app').html(html)