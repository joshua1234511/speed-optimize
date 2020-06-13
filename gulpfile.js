'use strict';


//=======================================================
// Include gulp
//=======================================================
let gulp = require('gulp');

//=======================================================
// Include Our Plugins
//=======================================================
let critical     = require('critical');
let puppeteer    = require('puppeteer');
let fs           = require('fs');
let notify       = require('gulp-notify');
let notifier     = require('node-notifier');
var concat       = require('gulp-concat');
var minifyCSS    = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var uncss        = require('gulp-uncss');
const minify     = require('gulp-minify');

// Critical CSS
gulp.task('critical-css', async () => {
  critical.generate({
    base: 'dist/',
    src: 'https://www.fernandesjoshua.com/',
    css: ['dist/css/main.css'],
    dest: 'css/critical/default-critical.css',
    width: 1300,
    height: 900,
    minify: true,
    timeout: 90000
  });
  critical.generate({
    base: 'dist/',
    src: 'https://www.fernandesjoshua.com/blog/happy-international-womens-day',
    css: ['dist/css/main.css'],
    dest: 'css/critical/article.css',
    width: 1300,
    height: 900,
    minify: true,
    timeout: 90000
  });
  critical.generate({
    base: 'dist/',
    src: 'https://www.fernandesjoshua.com/event/getting-started-drupal-commerce',
    css: ['dist/css/main.css'],
    dest: 'css/critical/events.css',
    width: 1300,
    height: 900,
    minify: true,
    timeout: 90000
  });
  critical.generate({
    base: 'dist/',
    src: 'https://www.fernandesjoshua.com/contact',
    css: ['dist/css/main.css'],
    dest: 'css/critical/page.css',
    width: 1300,
    height: 900,
    minify: true,
    timeout: 90000
  });
  critical.generate({
    base: 'dist/',
    src: 'https://www.fernandesjoshua.com/product/buddha-statue',
    css: ['dist/css/main.css'],
    dest: 'css/critical/product.css',
    width: 1300,
    height: 900,
    minify: true,
    timeout: 90000
  });
  critical.generate({
    base: 'dist/',
    src: 'https://www.fernandesjoshua.com/video/getting-started-drupal-post-workshop-summary',
    css: ['dist/css/main.css'],
    dest: 'css/critical/videos.css',
    width: 1300,
    height: 900,
    minify: true,
    timeout: 90000
  });

});

// Critical css secondary approach
gulp.task('css-critical', async ()  => {
  const URL = 'https://www.fernandesjoshua.com/';
  let criticalCSS = '';

  const browser = await puppeteer.launch({
      headless: true,
      args: [`--window-size=1440,900`],
      defaultViewport: null
  });
  const page = await browser.newPage();

  await page.coverage.startCSSCoverage();
  await page.goto(URL, {waitUntil: 'load'})

  const cssCoverage = await page.coverage.stopCSSCoverage();

  for (const entry of cssCoverage) {
      for (const range of entry.ranges) {
      criticalCSS += entry.text.slice(range.start, range.end) + "\n"
      }
  }

  await page.close();
  await browser.close();

  require('fs').writeFileSync('dist/css/critical/critical.css', criticalCSS);
});

gulp.task('uncss', function() {
  return gulp.src([
      'css/base/**/*.css',
      'css/components/**/*.css',
      'css/theme/**/*.css',
      'css/custom/**/*.css'],  {base: 'css/'}) 
    .pipe(uncss({
      html: [
        'https://www.fernandesjoshua.com/',
        'https://www.fernandesjoshua.com/blog/happy-international-womens-day',
        'https://www.fernandesjoshua.com/event/getting-started-drupal-commerce',
        'https://www.fernandesjoshua.com/video/getting-started-drupal-post-workshop-summary',
        'https://www.fernandesjoshua.com/contact',
        'https://www.fernandesjoshua.com/product/buddha-statue'
      ]
    }))
    .pipe(gulp.dest(['dist/css/']));
});

gulp.task('compress_js', function() {
  gulp.src(['js/*.js', 'js/*.mjs'],  {base: 'js/'})
    .pipe(minify())
    .pipe(gulp.dest(['dist/js']));
});


gulp.task('combine_css', () => {
  return gulp.src([
    'dist/css/base/**/*.css',
    'dist/css/components/**/*.css',
    'dist/css/theme/**/*.css',
    'dist/css/custom/**/*.css'])
    .pipe(minifyCSS())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('dist/css'));
});


gulp.task('default', gulp.series('uncss', 'compress_js', 'combine_css', 'critical-css', 'css-critical'), () => {
  notifier.notify({ title: 'Build', message: 'Done' });
});
