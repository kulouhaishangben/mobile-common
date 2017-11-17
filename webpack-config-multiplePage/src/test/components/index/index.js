
// 必须export一个函数出去，让router的render可以正常运行，不然总是报错，阻碍路由的跳转
export default function () {
    document.getElementById('app').innerHTML = 'Hello World'
}