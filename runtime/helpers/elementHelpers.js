"use strict";

const waitHelpers = require("./waitHelpers");

module.exports = {

	getSelectOptions: async function (selectSelector) {
		const options = await driver.$$(selectSelector + ' > option');
		return Promise.all(
			options.map(async (opt) => {
				return {
					text: (await opt.getHTML(false)).trim(),
					value: await opt.getAttribute("value"),
				};
			})
		);
	},

	selectOptionByText: async function (selectSelector, text) {
	const searchText = text.trim().split(" ")[0];
	const container = await driver.$(selectSelector + '+ .chosen-container');
	const searchInput = await container.$(".chosen-search-input");
	await searchInput.click();
	await searchInput.setValue(searchText);
	const searchResult = await container.$(`.chosen-results .highlighted`);
	await searchResult.click();
	},

	
	loadPage: async function (url, seconds=DELAY_20_SECOND) {
		let timeout = seconds * 1000;
		await driver.url(url);
		await waitHelpers.waitForPageToLoading();
	},

	/**
	 * hideElements hide elements
	 * @param  string  selectors   css selector or array of css selectors
	 */
	hideElements: async function (selectors) {
		// if arg is no array make it one
		selectors = typeof selectors == "string" ? [selectors] : selectors;
		for (let i = 0; i < selectors.length; i++) {
			const script = `document.querySelectorAll('${selectors[i]}').forEach(element => element.style.opacity = '0')`;

			await driver.execute(script);
		}
	},

	hideElements: async function (selectors) {
		// if arg is no array make it one
		selectors = typeof selectors == "string" ? [selectors] : selectors;
		for (let i = 0; i < selectors.length; i++) {
			const script = `document.querySelectorAll('${selectors[i]}').forEach(element => element.style.opacity = '0')`;

			await driver.execute(script);
		}
	},
	/**
	 * showElements show elements
	 * @param  string  selectors   css selector or array of css selectors
	 */
	showElements: async function (selectors) {
		// if arg is no array make it one
		selectors = typeof selectors == "string" ? [selectors] : selectors;
		for (let i = 0; i < selectors.length; i++) {
			const script = `document.querySelectorAll('${selectors[i]}').forEach(element => element.style.opacity = '1')`;

			await driver.execute(script);
		}
	},
	/**
	 * clicks an element (or multiple if present) that is not visible,
	 * useful in situations where a menu needs a hover before a child link appears
	 * @param {string} css selector used to locate the elements
	 * @param {string} text to match inner content (if present)
	 * @example
	 *    this.clickHiddenElement('nav[role="navigation"] ul li a','School Shoes');
	 */
	clickHiddenElement: function (cssSelector, textToMatch) {
		/**
		 * method to execute within the DOM to find elements containing text
		 */
		function clickElementInDom(query, content) {
			/**
			 * get the list of elements to inspect
			 */
			let elements = document.querySelectorAll(query);
			/**
			 * workout which property to use to get inner text
			 */
			let txtProp =
				"textContent" in document ? "textContent" : "innerText";

			for (let i = 0, l = elements.length; i < l; i++) {
				/**
				 * If we have content, only click items matching the content
				 */
				if (content) {
					if (elements[i][txtProp] === content) {
						elements[i].click();
					}
				} else {
					/**
					 * otherwise click all
					 */
					elements[i].click();
				}
			}
		}
		/**
		 * grab the matching elements
		 */
		return driver.elements(
			cssSelector,
			clickElementInDom,
			textToMatch.toLowerCase().trim
		);
	},
	/**
	 * Get the text of an Element
	 * @param selector
	 * @returns text
	 */
	getElementText: async function (selector) {
		let elem = await driver.$(selector);
		await elem.waitForExist(DELAY_10_SECOND);
		let text = await elem.getText();
		return text;
	},

	/**
	 * function to get element from frame or frameset
	 * @param frame_name
	 * @param selector
	 * @returns {Promise.<TResult>}
	 */
	getElementFromFrame: function (frame_name, selector) {
		let frame = driver.element(frame_name);
		driver.frame(frame.value);
		driver.getHTML(selector);
		return driver;
	},
	getLink: function (selector) {
		return driver.getAttribute(selector, "href");
	},

	isElementDisplayed: async function (selector) {
		await driver.$(selector).isDisplayed();
	},

	isElementPresent: async function (selector) {
		const array = await driver.$$(selector);
		return array.length > 0;
	},

	isElementClickable: async function (selector) {
        const element = await driver.$(selector);
        try {
            return await element.isClickable();
        } catch (error) {
			return false 
        }
	},
	
	isUrlContaining: async function (expectedUrl) {
        try {
            return await driver.getUrl().includes(url);
        } catch (error) {
            return false;
        }
    },

	getTextListFromListOfElements: async function (listOfElements) {
		return await Promise.all(
			listOfElements.map(async (element) => await element.getText())
		);
	},

	getValueListFromListOfElements: async function (listOfElements) {
		return await Promise.all(
			listOfElements.map(async (element) => await element.getValue())
		);
	},

	fillInputField: async function (selector, text) {
		let searchfield = await driver.$(selector);
		await searchfield.setValue(text);
	},
};
