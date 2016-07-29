var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var gulpDel = require('del');
var gulpInject = require('gulp-inject');
var gulpConcat = require('gulp-concat');
var gulpTs = require('gulp-typescript');
var gulpRename = require('gulp-rename');
var gulpElectron  = require('gulp-atom-electron');
var gulpSymdest = require('gulp-symdest');
var gulpSass = require('gulp-sass');


var tsProject = {
    target: 'ES6',
    module: 'commonjs',
    declaration: true,
    noExternalResolve: false,
    experimentalDecorators: true,
    outDir: 'dist/frontend/app'
};


/****************************** CLEAN ******************************/

gulp.task('private:clean', function(done) {
    gulpDel.sync(['dist/**/*', 'packaged-app/**/*'], { force: true });
    done();
});


/****************************** VENDORS ******************************/

// ANGULAR
gulp.task('private:copy-vendor-angular2', function() {
    return gulp.src('node_modules/@angular/**/*').pipe(gulp.dest('dist/frontend/vendor/@angular'));
});
gulp.task('private:copy-vendor-angular2-in-memory-web-api', function() {
    return gulp.src('node_modules/angular2-in-memory-web-api/**/*').pipe(gulp.dest('dist/frontend/vendor/angular2-in-memory-web-api'));
});

// RXJS
gulp.task('private:copy-vendor-rxjs', function() {
    return gulp.src('node_modules/rxjs/**/*').pipe(gulp.dest('dist/frontend/vendor/rxjs'));
});

// BOOTSTRAP
gulp.task('private:copy-vendor-bootstrap-css', function() {
    return gulp.src('node_modules/bootstrap/dist/css/**/*.min.css').pipe(gulp.dest('dist/frontend/vendor/css'));
});
gulp.task('private:copy-vendor-bootstrap-font', function() {
    return gulp.src('node_modules/bootstrap/dist/font/*').pipe(gulp.dest('dist/frontend/vendor/font'));
});
gulp.task('private:copy-vendor-bootstrap-js', function() {
    return gulp.src('node_modules/bootstrap/dist/**/*').pipe(gulp.dest('dist/frontend/vendor/js'));
});
gulp.task('private:copy-vendor-bootstrap', function (done) {
    gulpSequence(
        [
            'private:copy-vendor-bootstrap-css',
            'private:copy-vendor-bootstrap-font',
            'private:copy-vendor-bootstrap-js'
        ],
        done
    );
});

// SYSTEM JS
gulp.task('private:copy-vendor-system', function() {
    return gulp.src([
        "node_modules/core-js/client/shim.min.js",
        "node_modules/zone.js/dist/zone.min.js",
        "node_modules/reflect-metadata/Reflect.js",
        "node_modules/systemjs/dist/system.js"
    ]).pipe(gulp.dest('dist/frontend/vendor/systemjs'));
});

// BUILDS
gulp.task('private:build-vendor-css', function() {
    return gulp.src('dist/frontend/vendor/css/**/*.css')
        .pipe(gulpConcat('all-styles.css'))
        .pipe(gulp.dest('dist/frontend/vendor/css'));
});
gulp.task('private:build-vendor-js', function() {
    return gulp.src(['dist/frontend/vendor/systemjs/**/*.js', 'dist/frontend/vendor/js/**/*.js'])
        .pipe(gulpConcat('all-scripts.js'))
        .pipe(gulp.dest('dist/frontend/vendor/js'));
});

gulp.task('private:build-vendor', function (done) {
    gulpSequence(
        [
            'private:copy-vendor-angular2',
            'private:copy-vendor-angular2-in-memory-web-api',
            'private:copy-vendor-rxjs',
            'private:copy-vendor-bootstrap',
            'private:copy-vendor-system'
        ],
        [
            'private:build-vendor-css',
            'private:build-vendor-js'
        ],
        done
    );
});


/****************************** APP ******************************/

gulp.task('private:copy-templates', function() {
    return gulp.src('src/app/**/*.html')
        .pipe(gulp.dest('dist/frontend/app'));
});

gulp.task('private:copy-fonts', function() {
    return gulp.src('src/app/fonts/**/*')
        .pipe(gulp.dest('dist/frontend/css/fonts'));
});

gulp.task('private:copy-app-main-file', function() {
    return gulp.src('src/main.js')
        .pipe(gulp.dest('dist'));
});

gulp.task('private:copy-sys-config', function() {
    return gulp.src('src/systemjs.config.js')
        .pipe(gulp.dest('dist/frontend'));
});

gulp.task('private:build-app-ts', function() {
    var tsResult = gulp.src('src/app/**/*.ts').pipe(gulpTs(tsProject));

    /*var project = gulpTs.createProject('tsconfig.json', {
        typescript: require('typescript')
    });
    var tsResult = project.src().pipe(gulpTs(project));*/
    return tsResult.js.pipe(gulp.dest('dist/frontend/app'));
});

gulp.task('private:build-app-sass', function () {
    return gulp.src('src/app/**/*.scss')
        .pipe(gulpSass.sync().on('error', gulpSass.logError))
        .pipe(gulpConcat('styles.css'))
        .pipe(gulp.dest('dist/frontend/css'));
});

gulp.task('private:build-html', function() {
    var sources = gulp.src([
        'dist/frontend/vendor/js/all-scripts.js',
        'dist/frontend/vendor/css/all-styles.css',
        'dist/frontend/css/styles.css'
    ]);

    return gulp.src('src/index.html')
        .pipe(gulpInject(sources, { ignorePath: 'dist/frontend', addRootSlash: false }))
        .pipe(gulp.dest('dist/frontend'));
});

gulp.task('private:copy-app-package-file', function(){
    return gulp.src('src/app.package.json')
        .pipe(gulpRename('package.json'))
        .pipe(gulp.dest('dist'));
});


/****************************** PACKAGE ******************************/

gulp.task('private:package-app', function(done) {
    var platforms = [
        //{ platform: 'darwin', slug: 'osx' },
        { platform: 'win32', slug: 'windows' },
        //{ platform: 'linux', slug: 'linux' },
    ];

    platforms.map(function(p) {
        gulp.src(['dist/**/*'])
            .pipe(gulpElectron({
                version: '1.0.0',
                platform: p.platform
            }))
            .pipe(gulpSymdest('packaged-app/CashFlow-' + p.slug));
    });

    done();
});


/****************************** PUBLIC TASKS ******************************/

gulp.task('build-base', function (done) {
    gulpSequence(
        'private:clean',
        'private:build-vendor',
        'private:copy-app-package-file',
        'build-app',
        done
    );
});

gulp.task('build-app', function (done) {
    gulpSequence(
        'private:copy-templates',
        'private:copy-fonts',
        'private:copy-app-main-file',
        'private:copy-sys-config',
        'private:build-app-ts',
        'private:build-app-sass',
        'private:build-html',
        done
    );
});

gulp.task('build-app-light', function (done) {
    gulpSequence(
        'private:copy-templates',
        'private:build-app-ts',
        'private:build-app-sass',
        done
    );
});

gulp.task('build-app:watch', function () {
    gulp.watch('src/**/*', ['build-app-light']);
});

gulp.task('build-package', function (done) {
    gulpSequence(
        'build-base',
        'build-app',
        'private:copy-app-package-file',
        'private:package-app',
        done
    );
});
