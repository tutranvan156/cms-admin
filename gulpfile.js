(function () {
  var gulp = require('gulp');
  var zip = require('gulp-zip');
  var replace = require('gulp-replace');
  var UglifyJS = require("uglify-js");
  var CleanCSS = require('clean-css');
  var DateFormat = require('dateformat');
  var exec = require('child_process').exec;
  // var dtsGenerator = require('dts-generator').default;

  var toString = Object.prototype.toString;

  var fs = require('fs-extra');
  var pathApp = __dirname + '/';
  var pathBuild = getPath('build/');
  var deployPath = '';

  var buildName = 'cmsadmin';
  var dirCustomers = 'customers';
  var zipName = buildName + '.zip';

  var profileFile = 'cmsadmin.profile';
  var buildTimeKey = '{__BUILD_TIME__}';

  // gulp.task('definitions', function(done) {
  //   dtsGenerator({
  //     name: buildName,
  //     baseDir: 'js/inet',
  //     project:  pathApp,
  //     out: 'typing/' + buildName + '.d.ts'
  //   });
  // });

  gulp.task('minify-css', function () {
    getFiles(getPath('css'), function (path) {
      var data = readFile(path);
      var minified = new CleanCSS().minify(data).styles;
      path = path.replace('/css/', '/build/css/');
      fs.ensureFileSync(path);
      writeFile(path, minified);
    });
  });

  gulp.task('inet-lib.compile', function () {
    var target = getPathBuild('js/inet/lib'),
        source = getPath('js/inet');
    compileSource(source, target);
  });

  gulp.task('jquery-plugins.compile', function () {
    var target = getPathBuild('js/jquery/plugins'),
        source = getPath('js/jquery/plugins');
    compileSource(source, target, '#MODULE', false);
  });

  gulp.task('bootstrap-plugins.compile', function () {
    var target = getPathBuild('js/bootstrap/plugins'),
        source = getPath('js/bootstrap/plugins');
    compileSource(source, target, '#MODULE', false);
  });

  gulp.task('ace-plugins.compile', function () {
    var target = getPathBuild('js/ace'),
        source = getPath('js/ace');
    compileSource(source, target, '#MODULE', false);
  });

  gulp.task('buildProfile', function () {
    return gulp.src([pathApp + '/' + profileFile])
        .pipe(replace(buildTimeKey, new Date().valueOf()))
        .pipe(gulp.dest(pathBuild));
  });

  gulp.task('zip-customers', ['buildProfile'], function () {
    var dirs = fs.readdirSync(getPath('/' + dirCustomers));
    fs.removeSync(dirCustomers + '/**/' + zipName);
    dirs.forEach(function (item) {
      var folder = dirCustomers + '/' + item + '/';
      gulp.src([
        '{css/**,font/**,images/**,message/**,page/**,widget/**,js/jquery/**/*.min.js,js/ace/**/*.min.js,js/bootstrap/**/*.min.js,js/storage/*.min.js,js/inet/lib/*.min.js,js/tinymce/**/*.*,**/*-lang-*.js}',
        'build/**'])
          .pipe(gulp.dest(folder + 'build')).on('end', function () {

        gulp.src([folder + 'widget/**']).pipe(gulp.dest(folder + 'build/widget')).on('end', function () {
          gulp.src([folder + 'build/**'])
              .pipe(zip(zipName))
              .pipe(gulp.dest(folder)).on('end', function () {
            fs.removeSync(folder + 'build');
          });
        });
      });
    });
  });

  gulp.task('zip', ['zip-customers'], function () {
    return gulp.src([
      '{css/**,font/**,images/**,message/**,page/**,widget/**,js/jquery/**/*.min.js,js/ace/**/*.min.js,js/bootstrap/**/*.min.js,js/storage/*.min.js,js/inet/lib/*.min.js,js/tinymce/**/*.*,**/*-lang-*.js}',
      'build/**'])
        .pipe(zip(zipName))
        .pipe(gulp.dest('build'));
  });

  gulp.task('deploy', ['clean', 'inet-lib.compile', 'jquery-plugins.compile', 'bootstrap-plugins.compile','ace-plugins.compile', 'zip'], function () {
    if(!deployPath) {
      console.log("Deploy folder path (deployPath) is not defined");
    } else {
      copy(pathBuild + zipName, deployPath + zipName);
      //console.log("Deployed module to:", deployPath);
    }
  });

  // The default task (called when you run `gulp` from cli)
  gulp.task('default', ['deploy'], function (cb) {
  });

  // gulp.task('deploy-theme', ['clean', 'inet-lib.compile']);

  gulp.task('clean', function () {
    fs.removeSync('build');
    var dirs = fs.readdirSync(getPath('/' + dirCustomers));
    dirs.forEach(function (item) {
      var folder = dirCustomers + '/' + item + '/';
      fs.removeSync(folder + zipName);
      fs.removeSync(folder + 'build');
    });
  });

  /**
   * Copy file or folder without error
   * @param from
   * @param to
   */
  function copy(from, to) {
    fs.copy(from, to, function (err) {
      console.log("Copy: " + from + '\nTo:   ' + to);
      if (err) return console.error(err);
      console.log('==== SUCCESS ====');
    });
  }

  /**
   *
   * @param {String} path
   * Path sources folder
   * @param {String} target
   * Path target after compile
   * @param {String} [pattern]
   * Pattern to get file name. Ex: #PACKAGE|#MODULE|pattern:<file_name_build>
   * @param {Boolean} [hasSub]
   * Has sub package
   */
  function compileSource(path, target, pattern, hasSub) {
    var code = {};
    fs.mkdirsSync(target);
    pattern = pattern || '#PACKAGE';
    pattern += ':\\s*[^\\n\\s]+';
    pattern = new RegExp(pattern);

    var module = new RegExp('#MODULE:\\s*[^\\n\\s]+');

    var isSubDir = hasSub === undefined ? true : hasSub;

    getFiles(path, function (path) {
      if (!/.js$/i.test(path))
        return;
      var data = readFile(path),
          pkg = getPackageName(data, pattern),
          name = getFileNameBuild(data, module);

      if (pkg) {
        if (code[pkg] === undefined)
          code[pkg] = {};
      }

      if (name) {
        if (code[pkg][name] === undefined)
          code[pkg][name] = '';
        code[pkg][name] += data;
      }
    });
    for (var pkg in code) {
      if (code.hasOwnProperty(pkg) && toString.apply(code[pkg]) === '[object Object]') {
        for (var name in code[pkg]) {
          if (code[pkg].hasOwnProperty(name)) {
            var filePath = target + '/' + name;
            if (isSubDir) {
              fs.mkdirsSync(target + '/' + pkg);
              filePath = target + '/' + pkg + '/' + name;
            }

            try {
              var content = code[pkg][name]; // UglifyJS.minify(code[pkg][name], {fromString: true}).code;
              if (name === 'config.min.js')
                content = 'var buildTime="' + (DateFormat(new Date(), 'yyyymmdd.HHMM')) + '";' + content;
              writeFile(filePath, content);
            } catch (e) {
              console.log('Minify error: ', filePath);
              console.log('With error: ', e);
              writeFile(filePath, code[pkg][name]);
            }
          }
        }
      }
    }
    code = null;
  }

  function getFiles(path, callback) {
    var files = fs.readdirSync(path);
    files.forEach(function (file) {
      var __path = path + '/' + file;
      if (isPathFile(__path)) {
        callback && callback(__path);
      } else if (isPathDirectory(__path)) {
        getFiles(__path, callback);
      }
    });
  }

  function getPackageName(data, pkg) {
    if (!data)
      return;
    var packageName = data.match(pkg);
    if (!packageName)
      return;
    var name = packageName[0].split(':')[1].trim();
    if (!name)
      return;
    return name;
  }

  function getFileNameBuild(data, module) {
    if (!data)
      return;
    var moduleName = data.match(module);
    if (!moduleName)
      return;
    var name = moduleName[0].split(':')[1].trim();
    if (name) {
      name += '.min.js';
      return name;
    }
  }

  function isPathFile(path) {
    return fs.lstatSync(path).isFile();
  }

  function isPathDirectory(path) {
    return fs.lstatSync(path).isDirectory();
  }

  function readFile(path) {
    return fs.readFileSync(path, 'utf8');
  }

  function writeFile(file, data) {
    fs.writeFile(file, data);
  }

  function getPath(path) {
    return pathApp + path;
  }

  function getPathBuild(path) {
    return pathBuild + path;
  }
})();
