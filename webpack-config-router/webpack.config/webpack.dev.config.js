/**
 * 这里是开发环境的配置
 * @type {merge|exports|module.exports}
 */
const path = require('path'); // 即使common里面有引入path了，但在这里还是必须引入，不然就报错!
const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');


module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: { // 开发环境时查看代码的工具，也就不用每次都生成dist文件夹了；
        contentBase: path.join(__dirname, "../dist"), // 指定静态资源的路径
        //contentBase: './dist', // 好像不写contentBase属性也没区别？
        compress: true, // 所有来自 dist/ 目录的文件都做 gzip 压缩和提供为服务
        port: 8070, // 改变服务器的端口号
        host: "192.168.50.95", // 修改host配置，让服务器外部可访问（这样手机里就能访问了，但在不同电脑上，需要修改为不同的IP地址）
    },
});

