'use strict'

var gulp = require('gulp')
var gutil = require('gulp-util')
var del = require('del')
var uglify = require('gulp-uglify')
var gulpif = require('gulp-if')
var exec = require('child_process').exec

var notify = require('gulp-notify')

var buffer = require('vinyl-buffer')
var argv = require('yargs').argv
// sass
var sass = require('gulp-sass')
var postcss = require('gulp-postcss')
var autoprefixer = require('autoprefixer-core')
var sourcemaps = require('gulp-sourcemaps')
// BrowserSync
var browserSync = require('browser-sync')
// js
var watchify = require('watchify')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
// image optimization
var imagemin = require('gulp-imagemin')
// linting
var standard = require('gulp-standard')
// testing/mocha
var mocha = require('gulp-mocha')

// gulp build --production
var production = !!argv.production
// determine if we're doing a build
// and if so, bypass the livereload
var build = argv._.length ? argv._[0] === 'build' : false
var watch = argv._.length ? argv._[0] === 'watch' : true

// ----------------------------
// Error notification methods
// ----------------------------
var beep = function () {
  var os = require('os')
  var file = 'gulp/error.wav'
  if (os.platform() === 'linux') {
    // linux
    exec('aplay ' + file)
  } else {
    // mac
    console.log('afplay ' + file)
    exec('afplay ' + file)
  }
}
var handleError = function (task) {
  return function (err) {
    beep()

    notify.onError({
      message: task + ' failed, check the logs..',
      sound: false
    })(err)

    gutil.log(gutil.colors.bgRed(task + ' error:'), gutil.colors.red(err))
  }
}
// --------------------------
// CUSTOM TASK METHODS
// --------------------------
var tasks = {
  // --------------------------
  // Delete build folder
  // --------------------------
  clean: function (cb) {
    del(['build/'], cb)
  },
  // --------------------------
  // Copy static assets
  // --------------------------
  assets: function () {
    return gulp.src('./client/assets/**/*')
      .pipe(gulp.dest('build/assets/'))
  },
  favicon: function () {
    return gulp.src('./client/favicon.ico')
      .pipe(gulp.dest('build/'))
  },
  forge: function () {
    return gulp.src('./node_modules/mtos/node_modules/node-forge/js/**/*')
      .pipe(gulp.dest('build/forge/'))
  },
  // --------------------------
  // HTML
  // --------------------------
  // html templates (when using the connect server)
  templates: function () {
    gulp.src('client/**/*.html')
      .pipe(gulp.dest('build/'))
  },
  // --------------------------
  // SASS (libsass)
  // --------------------------
  sass: function () {
    return gulp.src('./client/scss/*.scss')
      // sourcemaps + sass + error handling
      .pipe(gulpif(!production, sourcemaps.init()))
      .pipe(sass({
        sourceComments: !production,
        outputStyle: production ? 'compressed' : 'nested'
      }))
      .on('error', handleError('SASS'))
      // generate .maps
      .pipe(gulpif(!production, sourcemaps.write({
        'includeContent': false,
        'sourceRoot': '.'
      })))
      // autoprefixer
      .pipe(gulpif(!production, sourcemaps.init({
        'loadMaps': true
      })))
      .pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
      // we don't serve the source files
      // so include scss content inside the sourcemaps
      .pipe(sourcemaps.write({
        'includeContent': true
      }))
      // write sourcemaps to a specific directory
      // give it a file and save
      .pipe(gulp.dest('build/css'))
  },
  // --------------------------
  // Browserify
  // --------------------------
  browserify: function () {
    var bundler = browserify('./client/js/index.js', {
      debug: !production,
      cache: {}
    })
    if (watch) {
      bundler = watchify(bundler)
    }
    var rebundle = function () {
      return bundler.bundle()
        .on('error', handleError('Browserify'))
        .pipe(source('build.js'))
        .pipe(gulpif(production, buffer()))
        .pipe(gulpif(production, uglify({ mangle: false })))
        .pipe(gulp.dest('build/js/'))
    }
    bundler.on('update', rebundle)
    return rebundle()
  },
  // --------------------------
  // linting
  // --------------------------
  standard: function () {
    return gulp.src([
      'gulpfile.js',
      './client/js/index.js',
      './client/js/**/*.js'
    ])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true
    }))
  },
  // --------------------------
  // Optimize asset images
  // --------------------------
  optimize: function () {
    return gulp.src('./client/assets/**/*.{gif,jpg,png,svg}')
      .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        // png optimization
        optimizationLevel: production ? 3 : 1
      }))
      .pipe(gulp.dest('./client/assets/'))
  },
  // --------------------------
  // Testing with mocha
  // --------------------------
  test: function () {
    return gulp.src('./client/**/*test.js', {read: false})
      .pipe(mocha({
        'ui': 'bdd',
        'reporter': 'spec'
      })
    )
  }

}

gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: './build'
    },
    port: process.env.PORT || 3000
  })
})

gulp.task('reload-sass', ['sass'], function () {
  browserSync.reload()
})
gulp.task('reload-js', ['browserify'], function () {
  browserSync.reload()
})
gulp.task('reload-templates', ['templates'], function () {
  browserSync.reload()
})

// --------------------------
// CUSTOMS TASKS
// --------------------------
gulp.task('clean', tasks.clean)
// for production we require the clean method on every individual task
var req = build ? ['clean'] : []
// individual tasks
gulp.task('templates', req, tasks.templates)
gulp.task('assets', req, tasks.assets)
gulp.task('favicon', req, tasks.favicon)
gulp.task('forge', req, tasks.forge)
gulp.task('sass', req, tasks.sass)
gulp.task('browserify', req, tasks.browserify)
gulp.task('standard', tasks.standard)
gulp.task('optimize', tasks.optimize)
gulp.task('test', tasks.test)

// --------------------------
// DEV/WATCH TASK
// --------------------------
gulp.task('watch', ['assets', 'favicon', 'forge', 'templates', 'sass', 'browserify', 'browser-sync'], function () {

  // --------------------------
  // watch:sass
  // --------------------------
  gulp.watch('./client/scss/**/*.scss', ['reload-sass'])

  // --------------------------
  // watch:js
  // --------------------------
  gulp.watch('./client/js/**/*.js', ['standard', 'reload-js'])
  gulp.watch('./mtos/**/*.js', ['reload-js'])

  // --------------------------
  // watch:html
  // --------------------------
  gulp.watch('./**/*.html', ['reload-templates'])

  gutil.log(gutil.colors.bgGreen('Watching for changes...'))
})

// build task
gulp.task('build', [
  'clean',
  'templates',
  'assets',
  'favicon',
  'forge',
  'sass',
  'browserify'
])

gulp.task('default', ['watch'])

// gulp (watch) : for development and livereload
// gulp build : for a one off development build
// gulp build --production : for a minified production build
