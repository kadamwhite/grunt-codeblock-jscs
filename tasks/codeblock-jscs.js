'use strict';

var JSCS = require( 'jscs' );
var tokenizeMarkdown = require( 'tokenize-markdown' );
var grunt = require( 'grunt' );
var _ = require( 'lodash' );
var chalk = require( 'chalk' );

/**
 * Use Grunt to load a file from the file system
 *
 * @param  {String} fileName The file name to load
 * @return {Object}          An object representing the file and its contents
 */
function readfile( fileName ) {
  // Read the file and return an object with the file's name & contents
  return {
    name: fileName,
    contents: grunt.file.read( fileName )
  };
}

/**
 * Take in an object with a file's name & contents, and return an object
 * containing the tokenized and filtered markdown tokens
 *
 * (options object is specified first because it will be bound as the first
 * argument within the .map() function chain in the task definition)
 *
 * @param {Object} options             An options object for filtering tokens
 * @param {String|RegExp} options.lang RegEx or String specifying language(s)
 *                                     that should be included in results
 * @param {Object} fileObj             An object describing a file
 * @param {String} fileObj.name        The path (filename) of the file
 * @param {String} fileObj.contents    The contents of the file, as a string
 * @return {Object} An object { file: 'fileName', tokens: tokenObjectArray }
 */
function tokenizeFile( options, fileObj ) {
  // Convert to tokens using the specified language filter parameters
  var tokens = tokenizeMarkdown.fromString( fileObj.contents, {
    type: 'code',
    lang: options.lang
  });

  // Map results into an object defining the tokens for this file
  return {
    file: fileObj.name,
    tokens: tokens
  };
}

/**
 * Reducer function to run JSCS against each file's tokens and aggregate any errors
 *
 * @param  {JSCS}   checker A JSCS Checker instance
 * @param  {Array}  errors  Reducer memo array, collecting any JSCS results objects
 * @param  {Object} fileObj The item defining the tokens for a given file
 * @return {Array} An array of aggregated JSCS results objects
 */
function reduceToJSCSErrors( checker, errors, fileObj ) {

  // For each code file, run JSCS and see if it fails.
  fileObj.tokens.forEach(function evaluateToken( snippet ) {
    var results = checker.checkString( snippet.text );

    if ( ! results.isEmpty() ) {
      errors.push({
        file: fileObj.file,
        errorCollection: results
      });
    }
  });

  return errors;
}

// Export the task definition
module.exports = function( grunt ) {
  var desc = 'Run JSCS against code snippets within Markdown slides.';

  grunt.registerMultiTask( 'codeblock-jscs', desc, function codeBlockJSCSTask() {
    var done = this.async();

    // Get any configured options, defaulting the search paths to any markdown
    // files below the working directory other than those in node_modules
    var options = this.options({
      lang: /(js|javascript)/,
      force: false
    });

    // If force is true, report JSCS errors but dont fail the task
    var force = options.force;
    delete options.force;

    var checker = new JSCS();
    checker.registerDefaultRules();

    // If any options were provided, pass them in
    if ( options.jscsOptions ) {
      checker.configure( _.extend( options.jscsOptions, {
        // Disable certain JSCS rules that don't make sense in the context
        // of inline code blocks
        requireLineFeedAtFileEnd: null
      }));
    } else {
      // Allow the use of a preset
      if ( options.preset ) {
        checker.configure({
          preset: options.preset,
          // Disable certain JSCS rules that don't make sense in the context
          // of inline code blocks
          requireLineFeedAtFileEnd: null
        });
      } else {
        // Warn that no configuration was provided (JSCS doesn't have the
        // "defaults" that JSHint does, since it's all opinions-based)
        console.warn( 'Warning: No options provided & no preset specified!' );
        return;
      }
    }

    // Disable certain JSCS rules that don't make sense in the context of code blocks
    checker.configure({
      requireLineFeedAtFileEnd: null
    });

    var errorCount = 0;

    function renderFileReport( resultsForFile, file ) {
      // Append the title of the file
      console.log( '\n' + chalk.underline( file ) );

      function renderTokenReport( tokenResults ) {
        var errorCollection = tokenResults.errorCollection;
        return errorCollection.getErrorList().map(function( error ) {
          // Increment the counter
          errorCount = errorCount + 1;

          // Use JSCS to format the error
          return errorCollection
            .explainError( error, true )
            // Remove the filename from the output
            .replace( /at.*\n/, chalk.styles.bold.close + '\n' )
            // Prepend 2 spaces to each error
            .replace( /^/, '  ' ) + '\n';
        }).join( '\n' );
      }

      var fileReport = resultsForFile
        .map( renderTokenReport )
        // Crude "flatten" action
        .join( '\n' )
        .split( '\n' )
        .map(function indent( text ) {
          return '  ' + text;
        })
        .join( '\n' );

      console.log( fileReport );
    }

    // Expand the fileSrc glob to a file names list
    var results = grunt.file.expand( this.filesSrc )
      // Load each file into memory
      .map( readfile )
      // Convert each file to Markdown tokens
      .map( tokenizeFile.bind( null, options ) )
      // Process each files' tokens with JSCS and return a unified error list
      // (use .bind to pass the checker instance)
      .reduce( reduceToJSCSErrors.bind( null, checker ), [] );

    // Group by file to simplify and clean up the reporter's output
    var resultsByFile = _.groupBy( results, 'file' );

    // console.log( resultsByFile );
    // Render each file's errors (no custom reporters this time)
    _.forEach( resultsByFile, renderFileReport )

    // If no errors occurred, we're green
    var noErrors = ! errorCount;

    var eventType;

    if ( noErrors ) {
      eventType = 'success';
    } else {
      eventType = force ? 'forced' : 'error';
    }

    // Emit an event (used exclusively for testing)
    grunt.event.emit( 'codeblock-jscs', eventType, results );

    // End the task: Fail if errors were logged, unless force was set
    done( noErrors || force );
  });
};
