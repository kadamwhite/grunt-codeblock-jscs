module.exports = function( grunt ) {
  'use strict';

  var merge = require( 'lodash.merge' );

  // Reusable JSHintRC options
  var jshintrc = grunt.file.readJSON( '.jshintrc' );

  // Load tasks.
  require( 'load-grunt-tasks' )( grunt );

  // Load the codeblock-jscs task itself
  grunt.loadTasks( 'tasks' );

  grunt.initConfig({

    pkg: grunt.file.readJSON( 'package.json' ),

    // These definitions are used to test the output of the plugin
    'codeblock-jscs': {
      options: {
        preset: 'jquery'
      },
      passing: {
        src: [
          'tests/fixtures/input/passing.md'
        ]
      },
      failing: {
        src: [
          'tests/fixtures/input/failing.md'
        ]
      },
      filtered: {
        options: {
          // Only run blocks with language "javascript" through jscs (skip "js")
          lang: 'javascript'
        },
        src: [
          'tests/fixtures/input/failing.md'
        ]
      },
      forced: {
        options: {
          force: true
        },
        src: [
          'tests/fixtures/input/failing.md'
        ]
      },
      'with-jscs-options': {
        options: {
          // Custom JSCS configuration
          jscsOptions: {
            preset: 'jquery',
            // Disable some rules
            validateQuoteMarks: null,
            requireCamelCaseOrUpperCaseIdentifiers: null
          }
        },
        src: [
          'tests/fixtures/input/failing.md'
        ]
      }
    },

    jscs: {
      options: {
        config: '.jscsrc',
        reporter: require( 'jscs-stylish' ).path
      },
      grunt: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: 'tasks/**/*.js'
      },
      tests: {
        src: 'tests/**/*.js'
      }
    },

    jshint: {
      options: {
        reporter: require( 'jshint-stylish' )
      },
      grunt: {
        options: jshintrc,
        src: 'Gruntfile.js'
      },
      lib: {
        options: jshintrc,
        src: 'tasks/**/*.js'
      },
      tests: {
        options: merge( jshintrc, {
          globals: {
            describe: false,
            it: false,
            beforeEach: false,
            afterEach: false
          }
        }),
        src: 'tests/**/*.js'
      }
    }

  });

  grunt.registerTask( 'lint', [ 'jshint', 'jscs' ] );
  grunt.registerTask( 'default', [ 'lint' ] );
};
