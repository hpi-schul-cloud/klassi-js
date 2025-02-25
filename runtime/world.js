/**
 KlassiTech Automated Testing Tool
 Created by Larry Goddard
 */
/**
 Copyright © klassitech 2016 - Larry Goddard <larryg@klassitech.co.uk>

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
'use strict';

/**
 * world.js is loaded by the cucumber framework before loading the step definitions and feature files
 * it is responsible for setting up and exposing the driver/browser/expect/assert etc required within each step
 * definition
 */
const fs = require('fs'),
	path = require('path'),
	requireDir = require('require-dir'),
	merge = require('merge'),
	chalk = require('chalk'),
	dir = require('node-dir'),
	chai = require('chai'),
	reporter = require('cucumber-html-reporter'),
	rp = require('request-promise'),
	program = require('commander');
const { execSync } = require('child_process');

const assert = chai.assert,
	expect = chai.expect,
	log = require('./logger').klassiLog();

const getRemote = require('./getRemote.js');

/**
 * Adding logging
 */
global.log = log;

/**
 * This is the Global date functionality
 */
global.date = require('./helpers/dateTimeHelpers').getCurrentDateWithFormat("dd-mm-yyyy");

/**
 * for all API test calls
 * @type {Function}
 */
global.request = rp;

/**
 * for the environment variables
 */
global.envConfig = require('./envConfig.json');

/**
 *  for the Download of all file types
 */
global.downloader = require('./downloader.js');

/**
 * for all assertions for variable testing
 */
global.assert = assert;
global.expect = expect;

/**
 * Environment variables
 * @type {*|(function(): driver)}
 */
let ChromeDriver = require('./chromeDriver'),
	FirefoxDriver = require('./firefoxDriver'),
	BrowserStackDriver = require('./browserStackDriver');
let remoteService = getRemote(global.settings.remoteService);

let driver = {};

/**
 * create the web browser based on global let set in index.js
 * @returns {{}}
 */
async function getDriverInstance() {
	let browser = global.settings.browserName;
	let options = {};
	if (remoteService && remoteService.type === 'browserstack') {
		let configType = global.settings.remoteConfig;
		assert.isString(
			configType,
			'BrowserStack requires a config type e.g. win10-chrome'
		);
		driver = BrowserStackDriver(options, configType);
		return driver;
	}
	assert.isNotEmpty(browser, 'Browser must be defined');
	switch (browser || '') {
		case 'firefox':
			{
				driver = FirefoxDriver(options);
			}
		break;
		case 'chrome':
			{
				driver = ChromeDriver(options);
			}
		break;
	}
	return driver;
}

/**
 * Global timeout
 * @type {number}
 */
global.DELAY_100_MILLISECOND = 100; // 100 millisecond delay
global.DELAY_200_MILLISECOND = 200; // 200 millisecond delay
global.DELAY_300_MILLISECOND = 300; // 300 millisecond delay
global.DELAY_500_MILLISECOND = 500; // 500 millisecond delay
global.DELAY_1_SECOND = 1; // 1 second delay
global.DELAY_3_SECOND = 3; // 3 second delay
global.DELAY_5_SECOND = 5; // 5 second delay
global.DELAY_10_SECOND = 10; // 10 second delay
global.DELAY_15_SECOND = 15; // 15 second delay
global.DELAY_20_SECOND = 20; // 20 second delay

global.SHORT_WAIT_MILLIS = 2000; // 2000 milliseconds delay
global.MEDIUM_WAIT_MILLIS = 5000;
global.LONG_WAIT_MILLIS = 10000; // 10000 milliseconds delay

function consoleInfo() {
	let args = [].slice.call(arguments),
		output = chalk.bgBlue.white('\n>>>>> \n' + args + '\n<<<<<\n');
	console.log(output);
}

/**
 * All Global variables
 * @constructor
 */
const {
	Before,
	After,
	AfterAll,
	Status,
	Given,
	And,
	When,
	Then
} = require('@cucumber/cucumber');

global.Given = Given;
global.When = When;
global.Then = Then;
global.And = And;

function World() {
	/**
	* create a list of variables to expose globally and therefore accessible within each step definition
	* @type {{driver: null, webdriverio, webdrivercss: *, expect: *, assert: (*), trace: consoleInfo,
	* log: log, page: {}, shared: {}}}
	*/
	let runtime = {
		driver: {}, // the browser object
		expect: global.expect, // expose chai expect to allow variable testing
		assert: global.assert, // expose chai assert to allow variable testing
		fs: fs, // expose fs (file system) for use globally
		dir: dir, // expose dir for getting an array of files, subdirectories or both
		trace: consoleInfo, // expose an info method to log output to the console in a readable/visible format
		page: [], // empty page objects placeholder
		shared: {}, // empty shared objects placeholder
		log: global.log, // expose the log method for output to files for emailing
		envConfig: global.envConfig, // expose the global environment configuration file for use when changing environment // types (i.e. dev, test, preprod)
		downloader: global.downloader, // exposes the downloader for global usage
		request: global.request, // exposes the request-promise for API testing
		date: global.date // expose the date method for logs and reports
	};
	/**
	*  expose properties to step definition methods via global variables
	*/
	Object.keys(runtime).forEach(function(key) {
		/** make property/method available as a global (no this. prefix required)
		*/
		global[key] = runtime[key];
	});
	/**
	* import page objects (after global lets have been created)
	*/
	if (global.paths.pageObjects && fs.existsSync(global.paths.pageObjects)) {
		/** require all page objects using camelcase as object names
		*/
		runtime.page = requireDir(global.paths.pageObjects, { camelcase: true });
		/**
		* expose globally
		* @type {{}}
		*/
		global.page = runtime.page;
	}
	/**
	* import shared objects from multiple paths (after global lets have been created)
	*/
	if (
		global.paths.sharedObjects &&
		Array.isArray(global.paths.sharedObjects) &&
		global.paths.sharedObjects.length > 0
	) {
		let allDirs = {};
		/**
		* first require directories into objects by directory
		*/
		global.paths.sharedObjects.forEach(function(itemPath) {
			if (fs.existsSync(itemPath)) {
				let dir = requireDir(itemPath, { camelcase: true });
				merge(allDirs, dir);
			}
		});
		/** if we managed to import some directories, expose them
		*/
		if (Object.keys(allDirs).length > 0) {
			/** expose globally
			* @type {{}}
			*/
			global.shared = allDirs;
		}
	}
}

/**
 * export the "World" required by cucumber to allow it to expose methods within step def's
 */

this.World = World;

/**
 * set the default timeout for all tests
 */
const { setDefaultTimeout } = require('@cucumber/cucumber');

const dateTimeHelpers = require('./helpers/dateTimeHelpers.js');
const emailHelpers = require('./helpers/emailHelpers.js');

// Add timeout based on env var.
const cucumberTimeout = process.env.CUCUMBER_TIMEOUT || 60000;
setDefaultTimeout(cucumberTimeout);

// start recording of the Test run time
global.startDateTime = dateTimeHelpers.getCurrentDateWithFormat("dd/MM/yyyy HH:mm:ss");

/**
 * create the driver before scenario if it's not instantiated
 */
Before(async () => {
	global.driver = getDriverInstance();
	global.browser = global.driver; // ensure standard WebDriver global also works
	await driver;
});

/**
 * cleanup database before each scenario
 * can use @noDBReset in feature file, if you don't need cleanup database before some scenarios
 */
Before(function(scenario) {
	try {
		const {tags} = scenario.pickle;
		const tagNames = tags.map((tag) => tag.name);
		if(tagNames.indexOf('@noDBReset') != -1){
			console.log('\n\nNo DB reset...');
			return Promise.resolve();
		}
		console.log('\n\nResetting the DB...');
		const output = execSync('npm run setup', { cwd: '../schulcloud-server', stdio: 'pipe' });
		console.log('Done.');
} catch (err) {
		console.error('Cannot reset the DB. Additional Info:')
		console.warn('stdout: ', err.stdout.toString());
		console.warn('stderr: ', err.stderr.toString());
		console.log('signal: ', err.signal);
		console.log('status: ', err.status);
}
	// access output via `output.toString()`
	return Promise.resolve();
});

/**
 * send email with the report to stakeholders after test run
 */
AfterAll(async () => {
	let driver = global.driver;
	if (program.email) {
		driver.pause(DELAY_3_SECOND).then(function() {
			return emailHelpers.klassiEmail();
		});
	}
});

/**
 * compile and generate a report at the END of the test run and send an Email
 */
AfterAll(function(done) {
	let driver = global.driver;
	if (global.paths.reports && fs.existsSync(global.paths.reports)) {
		global.endDateTime = dateTimeHelpers.getCurrentDateWithFormat("dd/MM/yyyy HH:mm:ss");
		let reportOptions = {
			theme: 'bootstrap',
			jsonFile: path.resolve(
				global.paths.reports,
				global.settings.reportName.replace(/ /g, '') + '-' + global.dateStringForFiles + '.json'
			),
			output: path.resolve(
				global.paths.reports,
				global.settings.reportName.replace(/ /g, '') + '-' + global.dateStringForFiles + '.html'
			),
			reportSuiteAsScenarios: true,
			launchReport: !global.settings.disableReport,
			ignoreBadJsonFile: true,
			metadata: {
				'Test Started': startDateTime,
				'Test Completion': endDateTime,
				Platform: process.platform,
				'Test Environment': process.env.NODE_ENV || 'DEVELOPMENT',
				Browser: global.settings.remoteConfig || global.browserName,
				Executed:
					remoteService && remoteService.type === 'browserstack'
						? 'Remote'
						: 'Local'
			},
			brandTitle: reportName + '-' + global.endDateTime,
			name: projectName
		};
		driver.pause(DELAY_3_SECOND).then(function() {
			reporter.generate(reportOptions);
			driver.pause(DELAY_3_SECOND);
		});
	}
	done();
});

/**
 *  executed after each scenario (always closes the browser to ensure fresh tests)
 */
After(async function(scenario) {
	let driver = global.driver;
	if (scenario.result.status === Status.FAILED) {
		if (remoteService && remoteService.type === 'browserstack') {
			await driver.deleteSession();
		} else if(!global.settings.keepOpenOnError){
			// Comment out to do nothing | leave browser open
			await driver.deleteSession();
		}
	} else {
		if (remoteService && remoteService.type !== 'browserstack') {
			// Comment out to do nothing | leave browser open
			await driver.deleteSession();
		} else if(!global.settings.keepOpenOnError){
			await driver.deleteSession();
		}	
	}
});

/**
 * get executed only if there is an error within a scenario
 */
After(function(scenario) {
	let driver = global.driver;
	let world = this;
	if (scenario.result.status === Status.FAILED) {
		return driver.takeScreenshot().then(function(screenShot) {
			world.attach(screenShot, 'image/png');
		});
	}
});
