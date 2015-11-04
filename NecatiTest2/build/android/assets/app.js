// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup(
	{
		tabsAtBottom: false
	}
);


//
// create base UI tab and root window
//
var win1 = Ti.UI.createWindow({  
    title:'About',
    backgroundColor:'#fff'
});

//header of the application
var headerView = Ti.UI.createView({
	height: '50dp',
	width: '100%',
	backgroundColor: '#007AFF',
	layout: 'horizontal',
	top: 0
});


//Header Item: Text Field
var txtTaskName = Ti.UI.createTextField({
	left: 15,
	width: '75%',
	hintText: 'Enter Text here!!!!',
	backgroundColor: 'white',
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});

headerView.add(txtTaskName);

//Header Item: Button
var btnAdd = Ti.UI.createButton({
	backgroundImage: 'add_button.png',
	left: 15,
	height: '45dp',
	width : '45dp'
});

var taskView = Ti.UI.createView({
	top: '50dp',
	width: '100%',
	backgroundColor: 'black'
});

//Body Item: Table
var taskList = Ti.UI.createTableView({
	width: Ti.UI.FILL,
	height: Ti.UI.FILL,
	backgroundColor: 'white',
	separatorColor: '#007AFF'
});

taskView.add(taskList);

var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png', 
    title:'About Section',
    window:win1
});

var label1 = Titanium.UI.createLabel({
	color:'#999',
	text:'I am Window 1',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

headerView.add(btnAdd);
win1.add(label1);
win1.add(headerView);
win1.add(taskView);

var taskView = Ti.UI.createView({
	top: '50dp',
	width: '100%',
	backgroundColor: 'white'
});

//Body Item: Table
var taskList = Ti.UI.createTableView({
	width: Ti.UI.FILL,
	height: Ti.UI.FILL,
	backgroundColor: 'white',
	separatorColor: '#007AFF'
});

taskView.add(taskList);
win1.add(taskView);

//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({  
    title:'Questionnaire',
    backgroundColor:'#fff'
});
var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Questionnaire Section',
    window:win2
});

var label2 = Titanium.UI.createLabel({
	color:'#999',
	text:'I am Window 2',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

win2.add(label2);



//
//  add tabs
//
tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  


// open tab group
tabGroup.open();


// added during app creation. this will automatically login to
// ACS for your application and then fire an event (see below)
// when connected or errored. if you do not use ACS in your
// application as a client, you should remove this block
(function(){
var ACS = require('ti.cloud'),
    env = Ti.App.deployType.toLowerCase() === 'production' ? 'production' : 'development',
    username = Ti.App.Properties.getString('acs-username-'+env),
    password = Ti.App.Properties.getString('acs-password-'+env);

// if not configured, just return
if (!env || !username || !password) { return; }
/**
 * Appcelerator Cloud (ACS) Admin User Login Logic
 *
 * fires login.success with the user as argument on success
 * fires login.failed with the result as argument on error
 */
ACS.Users.login({
	login:username,
	password:password,
}, function(result){
	if (env==='development') {
		Ti.API.info('ACS Login Results for environment `'+env+'`:');
		Ti.API.info(result);
	}
	if (result && result.success && result.users && result.users.length){
		Ti.App.fireEvent('login.success',result.users[0],env);
	} else {
		Ti.App.fireEvent('login.failed',result,env);
	}
});

})();

