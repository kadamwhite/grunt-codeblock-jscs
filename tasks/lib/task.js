'use strict';

var _ = require( 'lodash' );
var util = require( './util' );
var getChecker = require( './checker' ).getChecker;

var DEFAULT_OPTIONS = {
  lang: /(js|javascript)/,
  force: false
};

function codeBlockJSCSTask( grunt ) {
  /* jshint validthis:true*/
  var done = this.async();

  // Get any configured options, defaulting the search paths to any markdown
  // files below the working directory other than those in node_modules
  var options = this.options( DEFAULT_OPTIONS );

  // If force is true, report JSCS errors but dont fail the task
  var force = options.force;
  delete options.force;

  var checker;

  try {
    checker = getChecker( options );
  } catch ( err ) {
    // console.error( err );
    done( false );
  }

  // Expand the fileSrc glob to a file names list
  var results = grunt.file.expand( this.filesSrc )
    // Load each file into memory
    .map( util.readFile )
    // Convert each file to Markdown tokens
    .map( util.tokenizeFile.bind( null, options ) )
    // Process each files' tokens with JSCS and return a unified error list
    // (use .bind to pass the checker instance)
    .reduce( util.tokenListToErrorList.bind( null, checker ), [] );

  // Group by file to simplify and clean up the reporter's output
  // Render each file's errors (no custom reporters this time)
  _.forEach( _.groupBy( results, 'file' ), util.renderFileReport );

  // If no errors occurred, we're green
  var noErrors = ! results.length;

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
}

module.exports = {
  codeBlockJSCSTask: codeBlockJSCSTask
};
