/*global module:false require:true*/
var path = require('path');

module.exports = function(grunt) {

  // Load tasks
  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.loadNpmTasks('grunt-shell-completion');

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * https://github.com/AF83/koalab\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'af83; Licensed MIT */'
    },
    clean: ["docs", "tmp/*", "public/*.css", "public/*.js"],
    lint: {
      files: ['grunt.js']
    },
    coffeelint: {
      files: ['assets/**/*.coffee']
    },
    coffee: {
      compile: {
        files: {
          "tmp/app.js": [
            "assets/app.coffee",
            "assets/source.coffee",
            "assets/helpers/*.coffee",
            "assets/models/*.coffee",
            "assets/collections/*.coffee",
            "assets/views/*.coffee"
          ]
        }
      }
    },
    handlebars: {
      compile: {
        options: {
          wrapped: true,
          namespace: "JST",
          processName: function(filename) {
            return path.basename(filename, ".hbs");
          }
        },
        files: {
          "tmp/templates.js": ["assets/templates/*.hbs"]
        }
      }
    },
    copy: {
      vendor: {
        files: {
          "public/": "assets/vendor/*"
        }
      },
      js: {
        files: {
          "public/": "assets/js/*"
        }
      }
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', 'tmp/app.js', 'tmp/templates.js'],
        dest: 'public/koalab.js'
      }
    },
    min: {
      dist: {
        src: [
          '<banner:meta.banner>',
          'assets/vendor/keymaster.js',
          'assets/vendor/json2.js',
          'assets/vendor/handlebars.runtime.js',
          'assets/vendor/lodash.js',
          'assets/vendor/backbone.js',
          'assets/vendor/backbone.shortcuts.js',
          '<config:concat.dist.dest>'
        ],
        dest: 'public/koalab.min.js'
      },
      zepto: {
        src: ['assets/vendor/zepto.js'],
        dest: 'public/zepto.min.js'
      }
    },
    uglify: {},
    stylus: {
      compile: {
        files: {
          'public/koalab.css': 'assets/css/*.styl'
        }
      }
    },
    mincss: {
      dist: {
        files: {
          'public/koalab.min.css': ['assets/vendor/*.css', 'public/koalab.css']
        }
      }
    },
    watch: {
      files: ['<config:coffeelint.files>', 'assets/templates/*.hbs', 'assets/css/*.styl'],
      tasks: 'coffeelint stylus handlebars coffee concat'
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint coffeelint clean stylus handlebars coffee copy concat mincss min');

};
