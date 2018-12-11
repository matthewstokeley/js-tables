module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            // @todo remove drupal
            dist: {
                src: [
                    'src/plugins/column-sorter.js',
                    'src/plugins/column-toggle.js',
                    'src/plugins/filter.js',
                    'src/plugins/pagination.js',
                    'src/table.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true, 
                eqnull: true,
                browser: true,
                reporter: 'jslint',
                reporterOutput: 'reports/jshint.xml',
                globals: {
                    jQuery: true
                },
            },
            all: ['src/**/*.js']
        },
        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['build-js'],
                options: {
                    spawn: false,
                },
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build-js', ['jshint', 'concat', 'uglify']);
    grunt.registerTask('build', ['build-js']);

};
