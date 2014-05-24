module.exports = function( grunt ) {

	// Project configuration
	grunt.initConfig( {
		pkg:    grunt.file.readJSON( 'package.json' ),
		concat: {
			options: {
				stripBanners: true,
				banner: '/*! <%%= pkg.title %> - v<%%= pkg.version %>\n' +
					' * <%%= pkg.homepage %>\n' +
					' * Copyright (c) <%%= grunt.template.today("yyyy") %>;' +
					' * Licensed GPLv2+' +
					' */\n'
			},
			main: {
				src: [
					'assets/js/src/<%= fileSlug %>.js'
				],
				dest: 'assets/js/<%= fileSlug %>.js'
			}
		},
		jshint: {
			all: [
				'Gruntfile.js',
				'assets/js/src/**/*.js',
				'assets/js/test/**/*.js'
			]		
		},
		uglify: {
			all: {
				files: {
					'assets/js/<%= fileSlug %>.min.js': ['assets/js/<%= fileSlug %>.js']
				},
				options: {
					banner: '/*! <%%= pkg.title %> - v<%%= pkg.version %>\n' +
						' * <%%= pkg.homepage %>\n' +
						' * Copyright (c) <%%= grunt.template.today("yyyy") %>;' +
						' * Licensed GPLv2+' +
						' */\n',
					mangle: {
						except: ['jQuery']
					}
				}
			}
		},
		test:   {
			files: ['assets/js/test/**/*.js']
		},
		<% if ( opts.sass ) { %>
		sass:   {
			all: {
				files: {
					'assets/css/<%= fileSlug %>.css': 'assets/css/sass/<%= fileSlug %>.scss'
				}
			}
		},
		<% } %>
		<% if ( opts.autoprefixer ) { %>
		autoprefixer: {
			dist: {
				options: {
					browsers: [ 'last 1 version', '> 1%', 'ie 8' ]
				},
				files: { <% if ( opts.sass ) { %>
					'assets/css/<%= fileSlug %>.css': [ 'assets/css/<%= fileSlug %>.css' ]<% } else { %>
					'assets/css/<%= fileSlug %>.css': [ 'assets/css/source/<%= fileSlug %>.css' ]<% } %>
				}
			}
		},
		<% } %>
		cssmin: {
			options: {
				banner: '/*! <%%= pkg.title %> - v<%%= pkg.version %>\n' +
					' * <%%=pkg.homepage %>\n' +
					' * Copyright (c) <%%= grunt.template.today("yyyy") %>;' +
					' * Licensed GPLv2+' +
					' */\n'
			},
			minify: {
				expand: true,
				
				cwd: 'assets/css/',				
				src: ['<%= fileSlug %>.css'],
				
				dest: 'assets/css/',
				ext: '.min.css'
			}
		},
		watch:  {
			livereload: {
				files: ['assets/css/*.css'],
				options: {
					livereload: true
				}
			},
			styles: { <% if ( opts.sass ) { %>
				files: ['assets/css/sass/*.scss'],
				tasks: ['sass', 'autoprefixer', 'cssmin'],<% } else if ( opts.autoprefixer ) { %>
				files: ['assets/css/source/*.css'],
				tasks: ['autoprefixer', 'cssmin'],<% } else { %>
				files: ['assets/css/*.css', '!assets/css/*.min.css'],
				tasks: ['cssmin'],<% } %>
				options: {
					debounceDelay: 500
				}
			},
			scripts: {
				files: ['assets/js/src/**/*.js', 'assets/js/vendor/**/*.js'],
				tasks: ['jshint', 'concat', 'uglify'],
				options: {
					debounceDelay: 500
				}
			}
		},
		clean: {
			main: ['release/<%%= pkg.version %>']
		},
		copy: {
			// Copy the plugin to a versioned release directory
			main: {
				src:  [
					'**',
					'!node_modules/**',
					'!release/**',
					'!.git/**',
					'!.sass-cache/**',
					'!css/src/**',
					'!js/src/**',
					'!img/src/**',
					'!Gruntfile.js',
					'!package.json',
					'!.gitignore',
					'!.gitmodules'
				],
				dest: 'release/<%%= pkg.version %>/'
			}		
		},
		compress: {
			main: {
				options: {
					mode: 'zip',
					archive: './release/cmi_companion.<%%= pkg.version %>.zip'
				},
				expand: true,
				cwd: 'release/<%%= pkg.version %>/',
				src: ['**/*'],
				dest: 'cmi_companion/'
			}		
		},
		wp_readme_to_markdown: {
			readme: {
				files: {
					'readme.md': 'readme.txt'
				}
			}
		}
	} );
	
	// Load tasks
	require('load-grunt-tasks')(grunt);
	
	// Register tasks
	<% if ( opts.sass ) { %>
	grunt.registerTask( 'default', ['jshint', 'concat', 'uglify', 'sass', 'autoprefixer', 'cssmin', 'wp_readme_to_markdown' ] );
	<% } else if ( opts.autoprefixer ) { %>
	grunt.registerTask( 'default', ['jshint', 'concat', 'uglify', 'autoprefixer', 'cssmin', 'wp_readme_to_markdown' ] );
	<% } else { %>
	grunt.registerTask( 'default', ['jshint', 'concat', 'uglify', 'cssmin', 'wp_readme_to_markdown' ] );
	<% } %>
	
	grunt.registerTask( 'build', ['default', 'clean', 'copy', 'compress'] );

	grunt.util.linefeed = '\n';
};