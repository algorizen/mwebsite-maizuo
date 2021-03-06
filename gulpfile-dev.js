const gulp = require('gulp')
const server = require('gulp-webserver')
const sass = require('gulp-sass')
const webpack = require('webpack-stream')
const watch = require('gulp-watch')
const proxy = require('http-proxy-middleware');

// CommonJS规范做JS模块化
gulp.task('packjs', () => {
  return gulp.src('./src/scripts/**/*.js')
    .pipe(webpack({
      mode: 'development',
      entry: {
        app: ['@babel/polyfill', './src/scripts/app.js']
      },
      output: {
        filename: 'app.js'
      },
      module: {
        rules: [{
            test: /\.html$/,
            use: ['string-loader']
          },
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/plugin-transform-runtime']
              }
            }
          }
        ]
      }
    }))
    .pipe(gulp.dest('./dev/scripts'))
})

// 编译sass
gulp.task('packscss', () => {
  return gulp.src('./src/styles/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dev/styles'))
})

// 启动一个web-server
gulp.task('server', () => {
  return gulp.src('./dev')
    .pipe(server({
      host: 'localhost',
      port: 8989,
      livereload: true,
      middleware: [
        proxy('/v4', {
          target: 'https://m.maizuo.com',
          changeOrigin: true,

        })
      ]
    }))
})

// copy index.html
gulp.task('copyhtml', () => {
  return gulp.src('./src/*.html')
    .pipe(gulp.dest('./dev/'))
})

// copy iconfonts
gulp.task('copyicons', () => {
  return gulp.src('./src/iconfonts/**/*')
    .pipe(gulp.dest('./dev/iconfonts'))
})

// copy libs
gulp.task('copylibs', () => {
  return gulp.src('./src/libs/**/*')
    .pipe(gulp.dest('./dev/libs'))
})

// copy mock
gulp.task('copymock', () => {
  return gulp.src('./src/mock/**/*')
    .pipe(gulp.dest('./dev/mock'))
})

// copy images
gulp.task('copyimages', () => {
  return gulp.src('./src/images/**/*')
    .pipe(gulp.dest('./dev/images'))
})

// 文件修改 watch
gulp.task('watch', () => {
  // gulp.watch('./src/*.html', ['copyhtml'])
  watch('./src/*.html', () => {
    gulp.start(['copyhtml']);
  })
  // gulp.watch('./src/styles/**/*', ['packscss'])
  watch('./src/styles/**/*', () => {
    gulp.start(['packscss']);
  })
  watch('./src/libs/**/*', () => {
    gulp.start(['copylibs']);
  })
  // gulp.watch('./src/scripts/**/*', ['packjs'])
  watch('./src/scripts/**/*', () => {
    gulp.start(['packjs']);
  })
})

// default task
gulp.task('default', ['packscss', 'packjs', 'copyhtml', 'copyicons', 'copylibs', 'copyimages', 'server', 'watch'], () => {
  console.log('all works!')
})