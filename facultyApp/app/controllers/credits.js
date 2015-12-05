/**
 * Instantiate the local variables for this controller
 */
var args = arguments[0] || {};

/**
 *	Home button function will take you to Main Menu
 */
var homeButtonFunc = function () {
	Alloy.Globals.goToHome ($, $.credits);
};

/**
 *	Use the androidback event to go back to Main Menu
 */
$.credits.addEventListener('androidback' , function (e) {
	Alloy.Globals.goToHome ($, $.credits);
});