const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过这个插件，能替换原来的index.html，然后在dist中生成一个新的index.html
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 清理文件的插件
const webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin"); // 独立打包css文件
const CopyWebpackPlugin = require('copy-webpack-plugin')



module.exports = {
    //entry: entries,
    //plugins: plugins,
    entry: {
        app: './src/app.js',
        vendor: [
            'n-zepto'
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            // favicon: config.srcPath + '/favicon.ico',
            filename: 'index.html',
            template: path.resolve(__dirname, '../src/index.html'),
            inject:true,
            //minify:{    //压缩HTML文件
            //    removeComments:true,    //移除HTML中的注释
            //    collapseWhitespace:true    //删除空白符与换行符
            //},
            chunks: ["runtime", "vendor", "app"], // 需要引入的chunk，不配置就会引入所有页面的资源

        }),

        new webpack.HashedModuleIdsPlugin(), // 将使用模块的路径，而不是数字标识符作为基准，这样在主要的js文件中引入js文件或移动引包代码的位置都不会改变通用js包的名称了。
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            //filename: 'js/common/vendor.[chunkhash:7].js',
            minChunks: Infinity,
            // (随着 entry chunk 越来越多，
            // 设置Infinity，保证没其它的模块会打包进 vendor chunk)
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime' // 这行是实现不变的js包放在chunk 文件中，且必须在vendor的下面
        }),
        new ExtractTextPlugin({
            //filename: '[name].[contenthash:7].css',
            //filename: path.posix.join('css', '[name].[contenthash:7].css'),// 如果打包到css文件夹中，记得在rules设置中修改publicPath，避免图片路径出错
            filename: 'css/[name].[contenthash:7].css', // 如果打包到css文件夹中，记得在rules设置中修改publicPath，避免图片路径出错
            allChunks: true
        }), // 抽出独立的css文件

        // copy custom static assets
        // 现在只用来复制json文件，让ajax可获取json文件
        new CopyWebpackPlugin([
            {
                //from: path.resolve(__dirname, '../static'),
                from: path.resolve(__dirname, '../test'),
                //to: 'static',
                to: 'test',
                ignore: ['.*']
            }
        ])
    ],
    output: {
        //filename: 'bundle.js',
        //filename: '[name].[chunkhash].js', // [name]就是指代entry对象里面的key；[chunkhash]可以写一个hash，而且只有在js文件被修改时，才会改变hash，客户端才会重新请求，而不是使用缓存
        //filename: path.posix.join('static', 'js/[name].[chunkhash].js'), // 这样写，可以将js文件都放在dist/static/js文件夹里面
        filename:  'js/[name].[chunkhash:7].js', // 这样写，也可以将js文件都放在dist/js文件夹里面
        //path: path.resolve(__dirname, 'dist'),
        path: path.resolve(__dirname, '../dist'), // 打包到项目根目录的dist中
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
                test: /\.(less|css)$/, // 以 .css 结尾的全部文件，都将被提供给 style-loader 和 css-loader。
                //include: path.resolve(__dirname, '../src/static'), // 只包含src/static里面的css文件
                use: ExtractTextPlugin.extract({ // 分离css代码
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader',
                            options: {
                                importLoaders: 2, // 如果不加入这行，css-loader后面的loader无法使用？
                            }
                        },
                        'less-loader',
                        'postcss-loader' // 使用postcss的cssnext做兼容，以及使用更新的css语法
                    ],
                    publicPath: '../' // 修改图片的路径，避免路径出错
                })
            },
            /*{
                test: /\.css$/, // 以 .css 结尾的全部文件，都将被提供给 style-loader 和 css-loader。
                exclude: path.resolve(__dirname, '../src/static'), // 不包含src/static里面的css文件
                use: ExtractTextPlugin.extract({ // 分离css代码
                    fallback: 'style-loader',
                    use: [
                        // 注：该项目已使用modules功能，就基本将local部分的样式都弄失效了，暂时找不到原因与解决方式。
                        { loader: 'css-loader',
                            options: {
                                //minimize: true, // 压缩css代码
                                modules: true, // 开启css模块化，避免每个组件的样式被污染
                                //localIdentName: '[path][name]__[local]--[hash:base64:5]', // 设置生成样式的命名规则，遇到相同选择器时，进行改名处理
                                importLoaders: 1, // 如果不加入这行，css-loader后面的loader无法使用？
                            }
                        },
                        'postcss-loader'
                    ],
                    publicPath: '../' // 修改图片的路径，避免路径出错
                })
            },*/
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, // 处理图片
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000, // 在文件大小（单位 byte）低于指定的限制时，可以返回一个 DataURL(即base64格式，将图片文件嵌入到html文档中，就不用再去服务器请求了)(有时候这种处理反而导致项目各大)
                            name: path.posix.join('images', '[name].[hash:7].[ext]') // 将打包后的图片文件放在dist/images文件夹中，并且名称中只拼接hash的前7位
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
                            name: path.posix.join('images', '[name].[hash:7].[ext]') // 将打包后的图片文件放在dist/images文件夹中，并且名称中只拼接hash的前7位
                            //name: '[path][name].[hash:7].[ext]',
                        },
                    }

                ]
            },
            {
                test: /\.(ogg|mp4)(\?.*)?$/, // 处理视频，将位置放到最顶层，防止每次都不小心复制到服务器上面
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000, // 在文件大小（单位 byte）低于指定的限制时，可以返回一个 DataURL(即base64格式，将图片文件嵌入到html文档中，就不用再去服务器请求了)(有时候这种处理反而导致项目各大)
                            name: path.posix.join('video', '[name].[ext]'),
                            //name: '[path][name].[ext]', // 这样设置，会从src开始写路径，这样就能区分不同模块的图片了
                        },
                    }

                ]
            },
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
