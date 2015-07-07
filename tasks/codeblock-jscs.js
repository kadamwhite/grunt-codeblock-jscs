'use strict';

var codeBlockJSCSTask = require( './lib/task' ).codeBlockJSCSTask;

// Export the task definition
module.exports = function( grunt ) {
  var desc = 'Run JSCS against code snippets within Markdown slides.';

  grunt.registerMultiTask( 'codeblock-jscs', desc, function() {
    codeBlockJSCSTask.call( this, grunt );
  });
};
