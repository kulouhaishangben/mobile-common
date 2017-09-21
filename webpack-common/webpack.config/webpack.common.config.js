const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过这个插件，能替换原来的index.html，然后在dist中生成一个新的index.html
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 清理文件的插件
const webpack = require('webpack');




module.exports = {
    //entry: './src/index.js',
    entry: {
        index: './src/index.js',
        //print: './src/print.js',
        //another: './src/another.js', // 后续build后能生成以./src/another.js为基准的js文件，跟index就区分开了，也就可以写多页面了。
        vendor: [ // 利用缓存机制，将基本不变的js包（比如JQd等通用包）放在chunk 文件中，减少客户端每次打开页面都请求这些包
            //'lodash', // 写在这里就一定会打包到公共js文件了，不管index.js中有没引入！
            'n-zepto',
            //'jquery',
            //'./src/static/js/jquery.js', // 这样写也可以找到该插件，然后打包到公共的js文件里面
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({ // 设置dist中的index.html要按照那个html文件去编译
            filename: 'index.html',
            template: 'index.html',
            inject: true, // 设置true的话，会将js资源都放在body元素的底部
            //hash: true, // 为引入的js、css文件添加hash值，有利于清除缓存
            //chunks: ["index", "vendor"], // 通过chunks可以指定该html要引入哪些js文件；但奇怪的是，这里设置vendor后，页面会报错
            //excludeChunks : ['another'], // 排除某些js文件
        }),
        //new HtmlWebpackPlugin({ // 如果要生成多个html页面，则要多次调用该方法
        //    filename: 'test.html',
        //    template: 'test.html',
        //}),

        // 利用缓存机制，将基本不变的js包（比如JQd等通用包）放在chunk 文件中，减少客户端每次打开页面都请求这些包
        new webpack.HashedModuleIdsPlugin(), // 将使用模块的路径，而不是数字标识符作为基准，这样在主要的js文件中引入js文件或移动引包代码的位置都不会改变通用js包的名称了。
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        //new webpack.optimize.CommonsChunkPlugin({ // 这种是只将指定的入口文件中公共的插件打包；但如果运行了vendor，那这里是不会执行的
        //    name: 'common',
        //    chunks: ["index", "another"] // 如果index与another中都引用vendor中的js插件，那common也就等于vendor啦
        //}),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime' // 这行是实现不变的js包放在chunk 文件中，且必须在vendor的下面
        }),

        //new webpack.ProvidePlugin({ // 在这里可以全局添加插件，并修改插件使用时的变量名（好像要npm下载的插件才行？）
        //    $: 'n-zepto',
        //    zepto: 'n-zepto'
        //})
    ],
    output: {
        //filename: 'bundle.js',
        //filename: '[name].[chunkhash].js', // [name]就是指代entry对象里面的key；[chunkhash]可以写一个hash，而且只有在js文件被修改时，才会改变hash，客户端才会重新请求，而不是使用缓存
        //filename: path.posix.join('static', 'js/[name].[chunkhash].js'), // 这样写，可以将js文件都放在dist/static/js文件夹里面
        filename:  'js/[name].[chunkhash].js', // 这样写，也可以将js文件都放在dist/js文件夹里面
        path: path.resolve(__dirname, 'dist'),
        //publicPath: "/",
    },
    //resolve: {
    //    alias: {// 给文件或文件夹起别名，直接写路径会报错，所以要借助path.resolve
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
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, // 处理图片
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000, // 在文件大小（单位 byte）低于指定的限制时，可以返回一个 DataURL(即base64格式，将图片文件嵌入到html文档中，就不用再去服务器请求了)(有时候这种处理反而导致项目各大)
                            name: path.posix.join('static', 'images/[name].[hash:7].[ext]') // 将打包后的图片文件放在dist/static/images文件夹中，并且名称中只拼接hash的前7位
                        },
                    }

                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/, // 处理图片
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: path.posix.join('static', 'images/[name].[hash:7].[ext]') // 将打包后的图片文件放在dist/static/images文件夹中，并且名称中只拼接hash的前7位
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
