/*
 * Global variable definitions
 * The contents of this file are executed before any of
 * the view controllers are ever executed, including index
 */

// Window's event listener for android back button
Alloy.Globals.Navigate = function Navigate(v, fromView, toView) {
	Titanium.API.log("Back button pressed, global function called, " + fromView.children.length + " items to remove");
 	var newWindow = toView;
	newWindow.open();
 	fromView.close();
 	v.destroy();
};

Alloy.Globals.MMNavigate = function MMNavigate(v, fromView, toView) {
 	var newWindow = toView;
	newWindow.open();
 	fromView.close();
 	v.destroy();
};

Alloy.Globals.goToHome = function goToHome(v, fromView){
	Alloy.Globals.Navigate(v, fromView, Alloy.createController('mainMenu').getView());
};

Alloy.Collections.user = Alloy.createCollection('user'); 
Alloy.Globals.thisUserID = 1; 
Alloy.Globals.thisUserPhoto = 'http://api.randomuser.me/portraits/men/1.jpg'; 
Alloy.Globals.profileViewID = 1;
Alloy.Globals.comingFrom = 'nowhere';
