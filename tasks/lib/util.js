'use strict';

var tokenizeMarkdown = require( 'tokenize-markdown' );
var grunt = require( 'grunt' );
var chalk = require( 'chalk' );

/**
 * Use Grunt to load a file from the file system
 *
 * @param  {String} fileName The file name to load
 * @return {Object}          An object representing the file and its contents
 */
function readFile( fileName ) {
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
 * Run JSCS against a file's tokens and aggregate any errors
 *
 * @param  {JSCS}   checker        A JSCS Checker instance
 * @param  {Array}  errors         The reducer function memo: an array of errors
 * @param  {Object} fileObj        The item defining the tokens for a given file
 * @param  {Array}  fileObj.tokens An array of markdown tokens
 * @param  {String} fileObj.file   The name of the file whence the tokens
 * @return {Array} An array of JSCS results objects
 */
function tokenListToErrorList( checker, errors, fileObj ) {
  // For each code file, run JSCS and see if it fails.
  fileObj.tokens.forEach(function evaluateToken( snippet ) {
    var results = checker.checkString( snippet.text );

    if ( ! results.isEmpty() ) {
      // Decorate results array with a custom propery: mildly cleaner than
      // messing with the results object's internal "private" ._properties
      results.file = fileObj.file;
      errors.push( results );
    }
  });

  return errors;
}

/**
 * Render the report for a code token's JSCS results
 *
 * @param  {Object} errorCollection A JSCS error collection object
 * @return {String} A (colorized) string describing errors within the token
 */
function renderTokenReport( errorCollection ) {
  function renderError( error ) {
    return errorCollection
      // JSCS's errorCollection provides a method to format the error report
      .explainError( error, true )
      // Remove the filename from the output
      .replace( /at.*\n/, chalk.styles.bold.close + '\n' )
      // Prepend 2 spaces to each error
      .replace( /^/, '  ' ) + '\n';
  }

  // Join together all of the individual reports for this collection
  return errorCollection.getErrorList().map( renderError ).join( '\n' );
}

/**
 * Prepent a string with two spaces (for use in indentation)
 *
 * @param  {String} text A string of text
 * @return {String} A string of text prepended with two spaces
 */
function indentText( text ) {
  return '  ' + text;
}

/**
 * Generate a report string for an entire file's token error list
 *
 * @param  {Array} resultsForFile An array of error collection objects
 * @param  {[type]} file           [description]
 * @return {[type]}                [description]
 */
function renderFileReport( resultsForFile, file ) {
  var fileReport = resultsForFile
    // Render out the report for this file's results
    .map( renderTokenReport )
    // Crude "flatten" action
    .join( '\n' ).split( '\n' )
    .map( indentText );

  // Append the title of the file
  fileReport.unshift( '\n' + chalk.underline( file ) );

  console.log( fileReport.join( '\n' ) );
}

module.exports = {
  readFile: readFile,
  tokenizeFile: tokenizeFile,
  tokenListToErrorList: tokenListToErrorList,
  renderTokenReport: renderTokenReport,
  indentText: indentText,
  renderFileReport: renderFileReport
};
