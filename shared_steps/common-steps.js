'use strict';
const { CLIENT } = require('../shared-objects/servers');
const loginPage = require('../page-objects/pages/generalPagesBeforeLogin/LoginPage.js');
const startPage = require('../page-objects/pages/generalPagesBeforeLogin/StartPageBeforeLogin.js');
const createCourse = require('../page-objects/createCourse');
const navigationTopPage = require('../page-objects/pages/NavigationTopPage');
const elementHelpers = require('../runtime/helpers/elementHelpers.js');


const schulCloudURL= `${CLIENT.URL}`;
/*Login, Logout*/
Given(/^teacher goes to the home page$/, function() {
	return elementHelpers.loadPage(schulCloudURL, 10);
});

Given(/^the teacher started on the login page and$/, function () {
    return elementHelpers.loadPage(schulCloudURL, 10);
});

Given(/^.*arrives on the Schul-Cloud homepage$/, function () {
	return elementHelpers.loadPage(schulCloudURL, 10);
});

Given(/^.*logs in with email (.*) and password (.*)$/, async function (username, password) {
	await startPage.clickLoginBtn();
	await loginPage.performLogin(username, password);
});

Given(/^user logs in as default teacher$/, async function () {
	await startPage.clickLoginBtn();
	await loginPage.performLogin(loginPage.defaultLoginData.defaultTeacherUsername, loginPage.defaultLoginData.defaultTeacherpassword);
});

When(/^.*goes from start page to login page$/, async function () {
	await startPage.clickLoginBtn();
});

When(/^.*is on LoginPage and logs in with (.*) and (.*)$/, async function (username, password) {
	await loginPage.performLogin(username, password);
});

Then(/^.*logs out$/, async function () {
	await navigationTopPage.performLogout();
});

When(/^.*waits for next login$/, async function () {
	let waitTime = (parseInt(process.env.LOGIN_BLOCK_TIME) || 15) + 1;
	await driver.pause(waitTime * 1000);
});

Then(/^the login must fail$/, async function () {
	return loginPage.wrongLoginResult();
});

Then(/^the login must be successful$/, function () {
	return loginPage.loginResult();
});

/*Courses*/
When(/^teacher creates a course (.*) and adds student (.*)to this course$/, async function (courseName, studentName) {
	return createCourse.createCourseWithStudents(courseName, studentName);
});

/*NavigationTopPage*/
When(/^.* goes to initials$/, async function () {
	await navigationTopPage.clickInitials();
});

When(/^.* goes to user settings$/, async function () {
	await navigationTopPage.clickInitials();
	await navigationTopPage.clickSettings();
});




/*first login*/
Then(/^.* accepts data protection$/, function() {
	return firstLogin.firstLoginAdminOrTeacher();
});

Then(/^student with full age accepts student\'s data protection$/, function() {
	return firstLogin.firstLoginPupilFullAge(loginData.notEligiblePupilPassword);
});
