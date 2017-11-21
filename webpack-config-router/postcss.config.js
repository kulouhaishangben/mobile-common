module.exports = {
    //parser: 'sugarss', // sugarss is a indent-based syntax like Sass or Stylus.（翻译：语法类似sass）（也要下载插件的，不要了）
    plugins: {
        'postcss-import': {},
        'postcss-cssnext': {}, // 能添加兼容前缀，也能配合css-modules
        //'cssnano': {} // cssnano是PostCSS的CSS优化和分解插件。cssnano采用格式很好的CSS，并通过许多优化，以确保最终的生产环境尽可能小。
    }

    // 使用cssnano后，发现无法正常解析css文件中的图片，奇怪。
}
