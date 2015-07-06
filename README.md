# grunt-codeblock-jscs

Run JSCS against code snippets within Markdown slides

[![Build Status](https://travis-ci.org/kadamwhite/grunt-codeblock-jscs.svg)](https://travis-ci.org/kadamwhite/grunt-codeblock-jscs)

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-codeblock-jscs --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks( 'grunt-codeblock-jscs' );
```

## The "codeblock-jscs" task

### Overview
In your project's Gruntfile, add a section named `'codeblock-jscs'` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  'codeblock-jscs': {
    options: {
      // Task-specific options go here
    },
    your_target: {
      // Target-specific file lists and/or options go here
    }
  },
});
```

### Options

#### options.reporter
Type: `String|Function`

The path to a custom JSCS reporter, or else a custom reporter function
to use when logging the output from JSCS

#### options.jscsOptions
Type: `Object`

An object specifying JSCS rules that will be used when validating the code tokens

### Usage Examples

#### Default Options
In this example, the default reporter is used, and all markdown files within
the provided directory are scanned for code blocks to lint. Since there are no JSCS "defaults," you must provide a JSCS options object (in this case reading in from a `.jscsrc`).

```js
grunt.initConfig({
  'codeblock-jscs': {
    options: {
      jscsOptions: grunt.file.readJSON( '.jscsrc' )
    },
    src: './path/to/some/markdown/files/**/*.md'
  }
});
```

#### Multiple Targets

In this example, two different directories of markdown files are scanned, and
the results from each are determined with different JSCS presets

```js
grunt.initConfig({
  'codeblock-jscs': {
    slides: {
      options: {
        preset: 'jquery'
      },
      src: [
        'path/to/slides/**/*.md',
        'other/slide/particular-slide.md'
      ]
    },
    notes: {
      options: {
        preset: 'google'
      },
      src: 'path/to/notes/**/*.md'
    }
  },
});
```

#### Custom JSCS options
In this example, a preset is overridded with the specified JSCS options.

```js
grunt.initConfig({
  'codeblock-jscs': {
    options: {
      jscsOptions: {
        preset: 'jquery',
        // Disable some rules
        validateQuoteMarks: null,
        requireCamelCaseOrUpperCaseIdentifiers: null
      }
    },
    src: './path/to/some/markdown/files/**/*.md'
  }
});
```

## Contributing

Lint and test your code using the `npm test` command. In lieu of a formal styleguide, JSHint and JSCS are in place to ensure code style consistency. Add unit tests for any new or changed functionality.

## Release History

- **v0.1.0**: Initial release
