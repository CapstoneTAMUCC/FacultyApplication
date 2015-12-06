/*
 * Controller for Credits section
 * Purpose: Provide functionality for the Credits section of the app which
 * 			displays development and contact information
 */

/**
 * Instantiate the local variables for this controller
 * Get arguments passed to controller
 */
var args = arguments[0] || {};

/**
 *	Home button function will take you to Main Menu
 *  Called on click of home button
 */
var homeButtonFunc = function () {
	Alloy.Globals.goToHome ($, $.credits);
};

/**
 *	Use the androidback event to go back to Main Menu
 *  Overrides original back functionality
 */
$.credits.addEventListener('androidback' , function (e) {
	Alloy.Globals.goToHome ($, $.credits);
});