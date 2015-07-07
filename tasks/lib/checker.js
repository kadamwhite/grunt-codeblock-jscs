'use strict';

var JSCS = require( 'jscs' );
var extend = require( 'lodash' ).extend;

/**
 * Augment a provided configuration object with context-specific rule overrides
 *
 * @param  {Object} jscsOptions A JSCS configuration object
 * @return {Object} A JSCS configuration object with specific rules disabled
 */
function makeConfig( jscsOptions ) {
  return extend( jscsOptions, {
    // Disable certain JSCS rules that don't make sense in the context of
    // inline code blocks
    requireLineFeedAtFileEnd: null
  });
}

/**
 * Instantiate a JSCS instance with the provided options
 *
 * @param  {Object} options               Options object to use when configuring JSCS
 * @param  {String} [options.preset]      Optionally specify a JSCS preset to use
 * @param  {Object} [options.jscsOptions] A JSCS options object
 * @return {JSCS} A JSCS checker instance
 */
function getChecker( options ) {
  // Instantiate the checker
  var checker = new JSCS();

  // Activate the default rules
  checker.registerDefaultRules();

  // If an ptions object was provided, pass it through to the checker
  if ( options.jscsOptions ) {
    checker.configure( makeConfig( options.jscsOptions ) );
  } else {
    // Allow the use of a preset
    if ( options.preset ) {
      checker.configure( makeConfig({
        preset: options.preset
      }));
    } else {
      // Error that no configuration was provided (JSCS doesn't have the
      // "defaults" that JSHint does, since it's all opinions-based)
      throw new Error( 'Error: No options provided & no preset specified!' );
    }
  }

  return checker;
}

module.exports = {
  getChecker: getChecker
};
