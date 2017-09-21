/**
 * 这里是生产环境的配置
 * @type {merge|exports|module.exports}
 */
//const path = require('path'); // 即使common里面有引入path了，但在这里还是必须引入，不然就报错!
const webpack = require('webpack'); // 即使common里面有引入webpack了，但在这里还是必须引入，不然就报错！
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 清理文件的插件
const merge = require('webpack-merge');
//const UglifyJSPlugin = require('uglifyjs-webpack-plugin'); // webpack3.5.5版本的已经内置了该插件
const common = require('./webpack.common.config.js');


module.exports = merge(common, {
    devtool: 'source-map', // 其实生产环境也可以生产.map文件，在出现bug时可直接调试生产版本，而且.map文件只有打开开发者调试工具后才会去下载！
    plugins: [
        new CleanWebpackPlugin(['dist']),
        //new CleanWebpackPlugin(['dist'], {
        //    //root: __dirname, // 根目录地址，其实就是webpack.config文件所在目录，因此有时需要修改下
        //    root: path.resolve(__dirname, '../dist'), // 根目录地址，通过path插件重新指定根目录地址（这样从能是绝对路径）；奇怪，最终没去清除
        //}), // 清理dist中不需要的文件

        //new webpack.optimize.UglifyJsPlugin(),// 压缩输出文件，UglifyJsPlugin是webpack自带的，开发时建议不要打开，不然不知道哪里报错~~
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true // 用于压缩生产环境打包的.map文件
        }),// 压缩输出文件，UglifyJsPlugin是webpack自带的，开发时建议不要打开，不然不知道哪里报错~~

        //new webpack.DefinePlugin({ // 设置环境变量，之后可以在代码中使用该变量判断是开发或生产环境？
        //    'process.env': {
        //      'NODE_ENV': JSON.stringify('production')
        //    }
        //})
    ]
});