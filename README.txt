这是一个移动端的公共模板与样式，很简易的。

在webpack-common文件夹中，有一个用webpack构建的项目，一般需要让项目自动化一些的话，就使用这个webpack-common里面的代码去构建吧。


注意：在webpack.dev.config.js中，在devServer对象里设置了host属性：
（1）host: "192.168.50.165", // 修改host配置，让服务器外部可访问（这样手机里就能访问了）
（2）但在不同电脑上，需要修改为不同的IP地址！！