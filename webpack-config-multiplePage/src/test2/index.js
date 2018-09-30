import $ from 'n-zepto'
//import '../static/css/common.css'
//import _ from 'lodash'
// import './css/style.css'
import styles from './css/style.css'
import stylesLess from './css/style.less'
import art from './art-file/1.art'

console.log('我是test1');
var html = art({
    text: '我是test1',
    //coinDataTop3: boardPreData
}) // 我擦，原来是要获取到art方法的返回值，这个返回值才是我们需要的模板代码！
console.log(html);
$('#app').html(html)


$('.hello').addClass(styles.hello)

$('#testLess').addClass(stylesLess['test-less'])
