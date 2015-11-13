// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

// Here your window's event listener for android back button
Alloy.Globals.Navigate = function Navigate(v, fromView, toView) {
	Titanium.API.log("Back button pressed, global function called, " + fromView.children.length + " items to remove");
    /*
    _.each(fromView.children, function(view) {
        fromView.remove(view);
 	});
 	*/
 	var newWindow = toView;
	newWindow.open();
 	fromView.close();
 	v.destroy();
};

Alloy.Globals.MMNavigate = function MMNavigate(v, fromView, toView) {
	Titanium.API.log("Navigating from Main Menu");
 	var newWindow = toView;
	newWindow.open();
 	fromView.close();
 	v.destroy();
};

Alloy.Globals.goToHome = function goToHome(v, fromView){
	Alloy.Globals.Navigate(v, fromView, Alloy.createController('index').getView());
};

Alloy.Collections.user = Alloy.createCollection('user'); 
Alloy.Globals.thisUserID = 1; 