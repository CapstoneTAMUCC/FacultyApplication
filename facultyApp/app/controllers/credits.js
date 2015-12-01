var args = arguments[0] || {};

var homeButtonFunc = function () {
	Alloy.Globals.goToHome ($, $.credits);
};

$.credits.addEventListener('androidback' , function (e) {
	Alloy.Globals.goToHome ($, $.credits);
});