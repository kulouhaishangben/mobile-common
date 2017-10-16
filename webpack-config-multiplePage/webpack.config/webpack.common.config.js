const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过这个插件，能替换原来的index.html，然后在dist中生成一个新的index.html
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 清理文件的插件
const webpack = require('webpack');
const config = require('./config.js');

let entries = {} // 入口对象
let plugins = [] // 插件数组
// 将不同活动文件夹下的index.js添加到入口对象中
config.allPath.forEach(v => {
    let childPath = v.replace(/.*\/src\/(.*)\//, '$1');
    let childPathAnother = childPath + 'Another'
    entries[childPath] = [v + 'index.js'];
    //entries[childPathAnother] = [v + 'another.js'];
    //let childPathCommon = childPath + 'common'
    // 使用HtmlWebpackPlugin生成对应的html文件
    plugins.push(
        new HtmlWebpackPlugin({
            // favicon: config.srcPath + '/favicon.ico',
            filename: childPath + '/index.html',
            template: v + '/index.html',
            inject:true,
            //minify:{    //压缩HTML文件
            //    removeComments:true,    //移除HTML中的注释
            //    collapseWhitespace:true    //删除空白符与换行符
            //},
            // chunks: ["runtime", "vendor", childPath], // 需要引入的chunk，不配置就会引入所有页面的资源
            chunks: ["vendor", childPath], // 需要引入的chunk，不配置就会引入所有页面的资源
            // chunks: ['nZepto', 'loash' ,childPath], // 需要引入的chunk，不配置就会引入所有页面的资源

        })
    )
});
 //将公共包（这里是供应商包）也放进入口对象中
entries['vendor'] = ['lodash', 'n-zepto'];
// 为了将这些供应商包分别打包，所以要分别添加到入口对象中
// 发现引入非npm方式下载的资源，打包后有可能出现报错情况，而且公共包的位置也无法调整，因此还是换回vendor
//entries['loash'] = ['lodash']
//entries['nZepto'] = ['n-zepto']

// 将CommonsChunkPlugin插件抽离公共代码的设置添加到plugins
plugins.push(
   //new webpack.HashedModuleIdsPlugin(), // 将使用模块的路径，而不是数字标识符作为基准，这样在主要的js文件中引入js文件或移动引包代码的位置都不会改变通用js包的名称了。
   new webpack.optimize.CommonsChunkPlugin({
       name: 'vendor',
       filename: 'js/common/vendor.js', // 设置公共包输出后的名称，不要hash，让公共包名称一直不变，这样也同样能利用缓存机制
   })
   //new webpack.optimize.CommonsChunkPlugin({
   //    name: 'runtime' // 这行是实现不变的js包放在chunk 文件中，且必须在vendor的下面
   //})
//)
// 将公共包分别打包到独立的js文件中吧，更适合多页面且独立的活动项目
// plugins.push(
//     new webpack.optimize.CommonsChunkPlugin({
//         //name: ["chunk",'loash','nZepto'],//对应于上面的entry的key，chunk能将主要js中相同的代码打包到一个公共包
//         names: ['loash','nZepto'],//对应于上面的entry的key，这样做可以将公共js包分别独立的打包出来！
//         //minChunks: 2
//         filename: 'js/common/[name].js',// 设置公共包输出后的名称，不要hash，让公共包名称一直不变，这样也同样能利用缓存机制
//     })
// )


module.exports = {
    entry: entries,
    plugins: plugins,
    output: {
        //filename: 'bundle.js',
        //filename: '[name].[chunkhash].js', // [name]就是指代entry对象里面的key；[chunkhash]可以写一个hash，而且只有在js文件被修改时，才会改变hash，客户端才会重新请求，而不是使用缓存
        //filename: path.posix.join('static', 'js/[name].[chunkhash].js'), // 这样写，可以将js文件都放在dist/static/js文件夹里面
        filename:  'js/[name].[chunkhash:7].js', // 这样写，也可以将js文件都放在dist/js文件夹里面
        path: path.resolve(__dirname, 'dist'),
        //publicPath: "/",
    },
    //resolve: {
    //    alias: {// 直接写路径会报错，所以要借助path.resolve
    //        //jq: "jquery", // 报错
    //        jq: path.resolve(__dirname, './node_modules/jquery/dist/jquery.js'),
    //        //static: './src/static/images', // 这样写会报错的！所以要使用path.resolve
    //        static: path.resolve(__dirname, './src/static/images'),
    //
    //    }
    //},
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/, // 忽略这两个文件夹
                use: {
                    loader: 'babel-loader', // 编译ES6语法
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.css$/, // 以 .css 结尾的全部文件，都将被提供给 style-loader 和 css-loader。
                use: [
                    {
                        loader: 'style-loader',
                        options: {

                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            //minimize: true, // 压缩css代码
                        }
                    }
                ]
            },
            //{
            //    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, // 处理图片
            //    use: [
            //        {
            //            loader: 'file-loader',
            //            options: {
            //                name: path.posix.join('static', 'images/[name].[hash:7].[ext]') // 将打包后的图片文件放在dist/static/images文件夹中，并且名称中只拼接hash的前7位
            //            },
            //        }
            //
            //    ]
            //},
            {
                test: /\.(png|jpe?g|gif|svg|mp4)(\?.*)?$/, // 处理图片
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000, // 在文件大小（单位 byte）低于指定的限制时，可以返回一个 DataURL(即base64格式，将图片文件嵌入到html文档中，就不用再去服务器请求了)(有时候这种处理反而导致项目各大)
                            //name: path.posix.join('static', 'images/[name].[hash:7].[ext]') // 将打包后的图片文件放在dist/static/images文件夹中，并且名称中只拼接hash的前7位
                            name: '[path][name].[hash:7].[ext]', // 这样设置，会从src开始写路径，这样就能区分不同模块的图片了
                            //outputPath: 'images/', // 设置这个，会添加一个顶层文件夹，本来是src，变成images/src
                            publicPath: '../' // 这样设置能处理多个活动项目放不同文件夹后，图片的引入路径问题
                        },
                    }

                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/, // 处理文字
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            //name: path.posix.join('static', 'images/[name].[hash:7].[ext]') // 将打包后的图片文件放在dist/static/images文件夹中，并且名称中只拼接hash的前7位
                            name: '[path][name].[hash:7].[ext]',
                            publicPath: '../' // 这样设置能处理多个活动项目放不同文件夹后，图片的引入路径问题
                        },
                    }

                ]
            },
            {
                test: /\.(ogg|mp4)(\?.*)?$/, // 处理视频
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000, // 在文件大小（单位 byte）低于指定的限制时，可以返回一个 DataURL(即base64格式，将图片文件嵌入到html文档中，就不用再去服务器请求了)(有时候这种处理反而导致项目各大)
                            //name: path.posix.join('static', 'images/[name].[hash:7].[ext]') // 将打包后的图片文件放在dist/static/images文件夹中，并且名称中只拼接hash的前7位
                            name: '[path][name].[ext]', // 这样设置，会从src开始写路径，这样就能区分不同模块的图片了
                            //outputPath: 'images/', // 设置这个，会添加一个顶层文件夹，本来是src，变成images/src
                            publicPath: '../' // 这样设置能处理多个活动项目放不同文件夹后，图片的引入路径问题
                        },
                    }

                ]
            },
            //{
            //    test: require.resolve('zepto'),
            //    use: [
            //        {
            //            loader: 'exports-loader?window.Zepto!script-loader' // 奇怪，这里报解析语法错误
            //        }
            //    ]
            //
            //},
            {
                test: /\.art$/, //这是编译art-template这个模板引擎的，这样就可以解析格式为.art的文件了
                use: [
                    {
                        loader: 'art-template-loader'
                    }
                ]
            }

        ]
    },
};
