'use strict';

var chai = require( 'chai' );
chai.use( require( 'chai-as-promised' ) );
chai.use( require( 'sinon-chai' ) );
var expect = chai.expect;
var sinon = require( 'sinon' );

var grunt = require( 'grunt' );

// Code under test
var util = require( '../../../tasks/lib/util' );

describe( 'util.js', function() {
  describe( 'readFile', function() {
    var file;
    beforeEach(function() {
      sinon.stub( grunt.file, 'read' );
      grunt.file.read.returns( 'file contents' );
      file = util.readFile( 'filename.js' );
    });

    afterEach(function() {
      grunt.file.read.restore();
    });

    it( 'Loads the specified file', function() {
      expect( grunt.file.read ).to.have.been.calledWith( 'filename.js' );
    });

    it( 'Returns an object with name & contents properties', function() {
      expect( file ).to.have.property( 'name' );
      expect( file.name ).to.be.a( 'string' );
      expect( file.name ).to.equal( 'filename.js' );
      expect( file ).to.have.property( 'contents' );
      expect( file.contents ).to.be.a( 'string' );
      expect( file.contents ).to.equal( 'file contents' );
    });
  });

  describe( 'tokenizeFile', function() {
    var md;

    beforeEach(function() {
      md = [
        '# Some code',
        '```js',
        'var myVar = "foo";',
        '```',
        'And then another:',
        '```javascript',
        'while( 1 ) console.log( "crash your browser" );',
        '```'
      ].join( '\n' );
    });

    it( 'tokenizes a string of markdown', function() {
      var result = util.tokenizeFile({}, {
        contents: md,
        name: 'filename.js'
      });
      expect( result ).to.have.property( 'file' );
      expect( result.file ).to.equal( 'filename.js' );
      expect( result ).to.have.property( 'tokens' );
      expect( result.tokens ).to.be.an( 'array' );
      // Only the two "code" tokens should have been selected
      expect( result.tokens.length ).to.equal( 2 );
    });

    it( 'accepts a language filter', function() {
      var result = util.tokenizeFile({
        lang: 'js'
      }, {
        contents: md,
        name: 'filename.js'
      });
      expect( result.tokens ).to.be.an( 'array' );
      // Only the "js" token should have been selected
      expect( result.tokens.length ).to.equal( 1 );
    });
  });

  // This is getting silly
});
