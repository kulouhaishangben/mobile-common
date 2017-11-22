module.exports = {
    //parser: 'sugarss', // sugarss is a indent-based syntax like Sass or Stylus.（翻译：语法类似sass）（也要下载插件的，不要了）
    plugins: {
        'postcss-import': {},
        //'postcss-cssnext': {}, // 能添加兼容前缀，也能配合css-modules，还有CSS语法超集；（会进行计算，比如将rem进行计算，但是又不准确，所以）
        'autoprefixer': {}, // autoprefixer能添加兼容前缀，要去package.json中编辑"browserslist" ，确定要添加哪些浏览器的兼容性前缀；
        'cssnano': {} // cssnano是PostCSS的CSS优化和分解插件。cssnano采用格式很好的CSS，并通过许多优化，以确保最终的生产环境尽可能小。
    }

    // 使用cssnano后，发现无法正常解析css文件中的图片，奇怪。
    // 不使用css modules后，发现用cssnano是可以正常解析图片的，原因还未知（可能是两者难以共融？）
}
