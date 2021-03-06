"use-strict";

var radic = require('radic');


module.exports = function(grunt){

    grunt.loadTasks('grunt/tasks');
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    var concatJsdev = [], cleanJsdev = [];
    ['sidemenu', 'topmenu', 'packadic'].forEach(function(fileName){
        concatJsdev.push('src/assets/js/' + fileName + '.js');
        cleanJsdev.push('dev/assets/js/' + fileName + '.js');
    });

    var cfg = {
        copy: {
            fonts: {
                files: [
                    { expand: true, cwd: 'src/assets/vendor/bootstrap/fonts', src: '**', dest: 'src/assets/fonts' },
                    { expand: true, cwd: 'src/assets/vendor/font-awesome/fonts', src: '**', dest: 'src/assets/fonts' },
                ]
            }
        },
        clean: {
            jsdev: {
                src: cleanJsdev
            }
        },
        concat: {
            jsdev: {
                files: [
                    { src: concatJsdev, dest: 'dev/assets/js/theme.js' }
                ]
            }
        },
        browserify: {
            dev: {
                src: ['src/assets/js/bundles/**/*.js'],
                dest: 'dev/assets/js/bundle.js',
                options: {
                    require: ['util', 'eventemitter2']
                }
            }
        },
        sass: {
            options: {
                sourcemap: 'none'
            },
            dev: {
                files: [{
                    cwd: 'src/assets/styles',
                    expand: true,
                    src: '*.scss',
                    ext: '.css',
                    dest: 'dev/assets/styles'
                }]
            }
        },

        useminPrepare: {
            build: {
                options: {
                    root: 'dev',
                    steps: {
                        js: ['concat', 'uglifyjs'],
                        css: ['cssmin']
                    },
                    dest: 'dev'
                },
                files: {
                    src: ['dev/_includes/_layouts/*.html']
                }
            }
        },

        usemin: {
            options: {
                assetsDirs: ['dev/assets']
            },
            html: {
                src: ['dev/_includes/_layouts/*.html']
            }
        },

        packadic_src2dev: {

        },
        jekyll: {
            options: {
                config: 'dev/_config.yml',
                safe: true,
                watch: true,
                serve: true
            },
            dev: {
                options: {
                    src: 'dev',
                    drafts: true
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            styles: {
                files: ['src/assets/styles/**'],
                tasks: ['sass:dev']
            },
            bundle: {
                files: ['src/assets/js/bundle/**'],
                tasks: ['browserify:dev']
            },
            scripts: {
                files: ['src/assets/js/*.js'],
                tasks: ['concat:jsdev']
            },
            content: {
                files: ['src/**/*.{html,md,yml,json,xml}', 'src/*.{html,yml,xml,json,txt}'],
                tasks: ['packadic_src2dev']
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            serve: ['jekyll', 'watch']
        }
    };

    grunt.initConfig(cfg);

    grunt.registerTask('default', []);
    grunt.registerTask('build', ['packadic_src2dev', 'copy:fonts', 'concat:jsdev', 'sass:dev', 'browserify', 'clean:jsdev']);

    grunt.registerTask('minify', [
        'useminPrepare', // optimize all files and assets
        'concat',
        'uglify',
        'cssmin',
        'usemin'
    ]);
    grunt.registerTask('serve', ['build', 'concurrent:serve']);

};

