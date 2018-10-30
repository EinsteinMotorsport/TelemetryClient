module.exports = function (grunt) {

    grunt.initConfig({
        uglify: {
            development: {
                options: {
                    sourceMap: true,
                    mangle: true
                },

                files: {
                    'dist/app.min.js': ['src/js/**/*.js']
                }
            },

            production: {
                options: {
                    sourceMap: false,
                    mangle: true,
                    compress: {
                        properties: true,
                        dead_code: true,
                        drop_debugger: true,
                        conditionals: true,
                        comparisons: true,
                        booleans: true,
                        unused: true,
                        if_return: true,
                        join_vars: true,
                        drop_console: true
                    }
                },

                files: {
                    'dist/app.min.js': ['src/js/**/*.js']
                }
            }
        },
        less: {
            development: {
                files: {
                    'dist/style.min.css': 'src/**/*.less'
                }
            },
            production: {
                files: {
                    'dist/style.min.css': 'src/**/*.less'
                }
            }
        },
        watch: {
            files: ['src/**/*.js', 'src/**/*.less'],
            task: ['uglify:development', 'less:development'],
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('js', ['uglify:development']);
    grunt.registerTask('production', ['uglify:production', 'less:production']);
    grunt.registerTask('default', ['uglify:development', 'less:development', 'watch']);
};