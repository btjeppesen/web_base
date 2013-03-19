/**
 * File: jakefile.js
 * Project: web_base
 * User: brianjeppesen
 * Date: 3/19/13
 * Time: 3:32 PM
 * Description:
 */
/* global desc, task, jake, fail, complete, require */
(function () {
	"use strict";

	var NODE_VERSION = "v0.10.0";
	desc ( "Build and test" );
	task ( "default", ["lint"] );

	desc ( "Lint everything" );
	task ( "lint", [], function () {
		var lint = require ( "./build/lint/lint_runner.js" );

		var files = new jake.FileList ();
		files.include ( "**/*.js" );
		files.exclude ( ["node_modules","vendor"] );

		var pass = lint.validateFileList ( files.toArray (), nodeLintOptions (), nodeLintGlobals () );
		if ( !pass ) fail ( "Lint failed" );
	} );

	desc ("Test everything");
	task ("test", ["nodeVersion"], function() {
		console.log("Hello World");
	});

	desc ( "Integrate" );
	task ( "integrate", ["default"], function () {
		console.log ( "1. Make sure 'git status' is clean." );
		console.log ( "2. Build on the integration box." );
		console.log ( "   a. Walk over to integration box." );
		console.log ( "   b. 'git pull'" );
		console.log ( "   c. 'jake'" );
		console.log ( "   d. if jake fails, stop!  Try again." );
		console.log ( "3. 'git checkout integration'" );
		console.log ( "4. 'git merge master --no-ff --log'" );
		console.log ( "5. 'git checkout master'" );
	} );

	task ( "nodeVersion", [], function () {
		function failWithQualifier ( qualifier ) {
			fail ( "Incorrect node version. Expected " + qualifier + " [" + expectedString + "], but was [" + actualString + "]." );
		}

		var expectedString = NODE_VERSION;
		var actualString = process.version;
		var expected = parseNodeVersion ( "expected Node version", expectedString );
		var actual = parseNodeVersion ( "Node version", actualString );

		if ( process.env.strict ) {
			if ( actual[0] !== expected[0] || actual[1] !== expected[1] || actual[2] !== expected[2] ) {
				failWithQualifier ( "exactly" );
			}
		} else {
			if ( actual[0] < expected[0] )failWithQualifier ( "at least" );
			if ( actual[0] === expected[0] && actual[1] < expected[1] ) failWithQualifier ( "at least" );
			if ( actual[0] === expected[0] && actual[1] === expected[1] && actual[2] < expected[2] ) failWithQualifier ( "at least" );
		}
	} );

	function parseNodeVersion ( description, versionString ) {
		var versionMatcher = /^v(\d+)\.(\d+)\.(\d+)$/;
		var versionInfo = versionString.match ( versionMatcher );
		if ( versionInfo === null ) fail ( "Could not parse " + description + " (was '" + versionString + "')" );

		var major = parseInt ( versionInfo[1], 10 );
		var minor = parseInt ( versionInfo[2], 10 );
		var bugfix = parseInt ( versionInfo[3], 10 );
		return [major, minor, bugfix];
	}

	function sh ( command, callback ) {
		console.log ( '> ' + command );

		var stdout = "";
		var process = jake.createExec ( command, {printStdout: true, printStderr: true} );
		process.on ( "stdout", function ( chunk ) {
			stdout += chunk;
		} );
		process.on ( "cmdEnd", function () {
			console.log ();
			callback ( stdout );
		} );
		process.run ();
	}

	function nodeLintOptions () {
		return {
			bitwise : true,
			curly   : false,
			eqeqeq  : true,
			forin   : true,
			immed   : true,
			latedef : true,
			newcap  : true,
			noarg   : true,
			noempty : true,
			nonew   : true,
			regexp  : true,
			undef   : true,
			strict  : true,
			trailing: true,
			node    : true
		};
	}

	function nodeLintGlobals () {
		return {
			describe  : false,
			it        : false,
			beforeEach: false,
			afterEach : false
		};
	}
} ());