/**
 *                              _                _             
 *                             | |              | |            
 *    __ _ _ __  _ __   ___ ___| | ___ _ __ __ _| |_ ___  _ __ 
 *   / _` | '_ \| '_ \ / __/ _ \ |/ _ \ '__/ _` | __/ _ \| '__|
 *  | (_| | |_) | |_) | (_|  __/ |  __/ | | (_| | || (_) | |   
 *   \__,_| .__/| .__/ \___\___|_|\___|_|  \__,_|\__\___/|_|   
 *        | |   | |                                            
 *        |_|   |_|  
 *      
 *      
 * @overview
 * This is the controller file for the Directory View. The directory view loads data from 
 * a flat file, and derives a Sectioned and Indexed (iOS) ListView displaying all contacts.
 * The Directory has two ListView Templates, one for standard contacts, the other to denote
 * that you have a marked the contact as a Bookmark (or Favorite). Also, the Directory View
 * can be filtered so that it only displays bookmarked or favorited contacts.
 *
 * @copyright
 * Copyright (c) 2014 by Appcelerator, Inc. All Rights Reserved.
 *
 * @license
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

/**
 * Instantiate the local variables for this controller
 */
var _args = arguments[0] || {}, // Any passed in arguments will fall into this property
	App = Alloy.Globals.App, // reference to the APP singleton object
	$FM = require('favoritesmgr'),  // FavoritesManager object (see lib/utilities.js)
	users = null,  // Array placeholder for all users
	indexes = [];  // Array placeholder for the ListView Index (used by iOS only);
	

/**
 * Appcelerator Analytics Call
 */
var title = _args.title ? _args.title.toLowerCase() : "directory";
Ti.Analytics.featureEvent(Ti.Platform.osname+"."+title+".viewed");

$.connections.addEventListener('androidback' , function (e) {
	Alloy.Globals.goToHome ($, $.connections);
});

var homeButtonFunc = function () {
	Alloy.Globals.goToHome ($, $.connections);
};

function populateContacts()
{
	var tempArray = null;
	var contactList = new Array();
	//function to use HTTP to connect to a web server and transfer the data. 
	var request1 = Ti.Network.createHTTPClient({ 
	onerror: function(e){ 	
		Ti.API.debug(e.error); 	
		alert('There was an error during the connection CONTACTS'); 	
	}, 	
	timeout:1000, 
	});

	//Here you have to change it for your local ip 
	request1.open('POST', '52.32.54.34/php/read_contact_list.php');  
	var params = ({ "USER_ID": Alloy.Globals.thisUserID }); 
	request1.send(params);

	request1.onload = function() {
		var json = JSON.parse(this.responseText);
		var json = json.OTHER_USER_ID;
		tempArray = json; //HOLD USER_ID s of CONTACTS
		
		//function to use HTTP to connect to a web server and transfer the data. 
		var request2 = Ti.Network.createHTTPClient({ 
		onerror: function(e){ 	
			Ti.API.debug(e.error); 	
			alert('There was an error during the connection CONTACTS'); 	
		}, 	
		timeout:1000, 
		});
	
		//Here you have to change it for your local ip 
		request2.open('GET', '52.32.54.34/php/read_user_list.php');  
		request2.send();
		
		request2.onload = function() {
			var json = JSON.parse(this.responseText);
			var json = json.NAME;	
			
			for( var i=0; i < json.length; i++) 
			{
				for ( var j = 0; j < tempArray.length; j++)
				{
					if ( json[i].USER_ID === tempArray[j].OTHER_USER_ID)	//FIND THE CONTACT IN USER T
					{//THESE ARE THE USER_ID s that I WANT TO USE FOR CONTACTS
						contactList.push(json[i]); //contactList now holds all CONTACT's rows information
					}
				}
			}
		
			contactList = _.sortBy(contactList, function(user){
				return user.NAME
			});

			if (contactList)
			{
				/**
				 * Setup our Indexes and Sections Array for building out the ListView components
				 * 
				 */
				indexes = [];
				var sections = [];
				
				/**
				 * Group the data by first letter of last name to make it easier to create 
				 * sections. (leverages the UndrescoreJS _.groupBy function)
				 */
				var userGroups  = _.groupBy(contactList, function(item){
				 	return item.NAME.charAt(0);
				});
		        /**
		         * Iterate through each group created, and prepare the data for the ListView
		         * (Leverages the UnderscoreJS _.each function)
		         */
				_.each(userGroups, function(group)
				{
					/**
					 * Take the group data that is passed into the function, and parse/transform
					 * it for use in the ListView templates as defined in the directory.xml file.
					 */
					var dataToAdd = preprocessForListView(group);
		
					/**
					 * Check to make sure that there is data to add to the table,
					 * if not lets exit
					 */
					if(dataToAdd.length < 1) return;
					
					
					/**
					 * Lets take the first Character of the LastName and push it onto the index
					 * Array - this will be used to generate the indices for the ListView on IOS
					 */
					indexes.push({
						index: indexes.length,
						title: group[0].NAME.charAt(0)
					});
		
					/**
					 * Create the ListViewSection header view
					 * DOCS: http://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.ListSection-property-headerView
					 */
		
					 var sectionHeader = Ti.UI.createView({
					 	backgroundColor: "#ececec",
					 	width: Ti.UI.FILL,
					 	height: 30
					 });
		
					 /**
					  * Create and Add the Label to the ListView Section header view
					  */
					 var sectionLabel = Ti.UI.createLabel({
					 	text: group[0].NAME.charAt(0),
					 	left: 20,
					 	font:{
					 		fontSize: 20
					 	},
					 	color: "#666"
					 });
					 sectionHeader.add(sectionLabel);
		
					/**
					 * Create a new ListViewSection, and ADD the header view created above to it.
					 */
					 var section = Ti.UI.createListSection({
						headerView: sectionHeader
					});
		
					/**
					 * Add Data to the ListViewSection
					 */
					section.items = dataToAdd;
					
					/**
					 * Push the newly created ListViewSection onto the `sections` array. This will be used to populate
					 * the ListView 
					 */
					sections.push(section);
				});	//end of each function
				
				/**
				 * Add the ListViewSections and data elements created above to the ListView
				 */
				$.listView.sections = sections;
			}// end of if statement
			
		};	//end of second onload function
		
	};//end of first onload function

}//end of populateContacts function


function populatePending()
{
	var tempArray = null;
	var pendingList = new Array();
	//function to use HTTP to connect to a web server and transfer the data. 
	var request1 = Ti.Network.createHTTPClient({ 
	onerror: function(e){ 	
		Ti.API.debug(e.error); 	
		alert('There was an error during the connection PENDING'); 	
	}, 	
	timeout:1000, 
	});

	//Here you have to change it for your local ip 
	request1.open('POST', '52.32.54.34/php/read_pending_list.php');  
	var params = ({ "USER_ID": Alloy.Globals.thisUserID }); 
	request1.send(params);

	request1.onload = function() {
		var json = JSON.parse(this.responseText);
		var json = json.OTHER_USER_ID;
		tempArray = json; //HOLD USER_ID s of PENDING CONTACTS
		
		//function to use HTTP to connect to a web server and transfer the data. 
		var request2 = Ti.Network.createHTTPClient({ 
		onerror: function(e){ 	
			Ti.API.debug(e.error); 	
			alert('There was an error during the connection PENDING'); 	
		}, 	
		timeout:1000, 
		});
	
		//Here you have to change it for your local ip 
		request2.open('GET', '52.32.54.34/php/read_user_list.php');  
		request2.send();
		
		request2.onload = function() {
			var json = JSON.parse(this.responseText);
			var json = json.NAME;	
			
			for( var i=0; i < json.length; i++) 
			{
				for ( var j = 0; j < tempArray.length; j++)
				{
					if ( json[i].USER_ID === tempArray[j].OTHER_USER_ID)	//FIND THE PENDING CONTACT IN USER TABLE
					{//THESE ARE THE USER_ID s that I WANT TO USE FOR PENDING CONTACTS
						pendingList.push(json[i]); //pendingList now holds all PENDING CONTACT's rows information
					}
				}
			}
		
			pendingList = _.sortBy(pendingList, function(user){
				return user.NAME
			});

			if (pendingList)
			{
				/**
				 * Setup our Indexes and Sections Array for building out the ListView components
				 * 
				 */
				indexes = [];
				var sections = [];
				
				/**
				 * Group the data by first letter of last name to make it easier to create 
				 * sections. (leverages the UndrescoreJS _.groupBy function)
				 */
				var userGroups  = _.groupBy(pendingList, function(item){
				 	return item.NAME.charAt(0);
				});
		        /**
		         * Iterate through each group created, and prepare the data for the ListView
		         * (Leverages the UnderscoreJS _.each function)
		         */
				_.each(userGroups, function(group)
				{
					/**
					 * Take the group data that is passed into the function, and parse/transform
					 * it for use in the ListView templates as defined in the directory.xml file.
					 */
					var dataToAdd = preprocessForListView(group);
		
					/**
					 * Check to make sure that there is data to add to the table,
					 * if not lets exit
					 */
					if(dataToAdd.length < 1) return;
					
					
					/**
					 * Lets take the first Character of the LastName and push it onto the index
					 * Array - this will be used to generate the indices for the ListView on IOS
					 */
					indexes.push({
						index: indexes.length,
						title: group[0].NAME.charAt(0)
					});
		
					/**
					 * Create the ListViewSection header view
					 * DOCS: http://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.ListSection-property-headerView
					 */
		
					 var sectionHeader = Ti.UI.createView({
					 	backgroundColor: "#ececec",
					 	width: Ti.UI.FILL,
					 	height: 30
					 });
		
					 /**
					  * Create and Add the Label to the ListView Section header view
					  */
					 var sectionLabel = Ti.UI.createLabel({
					 	text: group[0].NAME.charAt(0),
					 	left: 20,
					 	font:{
					 		fontSize: 20
					 	},
					 	color: "#666"
					 });
					 sectionHeader.add(sectionLabel);
		
					/**
					 * Create a new ListViewSection, and ADD the header view created above to it.
					 */
					 var section = Ti.UI.createListSection({
						headerView: sectionHeader
					});
		
					/**
					 * Add Data to the ListViewSection
					 */
					section.items = dataToAdd;
					
					/**
					 * Push the newly created ListViewSection onto the `sections` array. This will be used to populate
					 * the ListView 
					 */
					sections.push(section);
				});	//end of each function
				
				/**
				 * Add the ListViewSections and data elements created above to the ListView
				 */
				$.listView2.sections = sections;
			}// end of if statement
			
		};	//end of second onload function
		
	};//end of first onload function

}//end of populatePending function

/**
 *	Convert an array of data from a JSON file into a format that can be added to the ListView
 * 
 * 	@param {Object} Raw data elements from the JSON file.
 */
var preprocessForListView = function(rawData) {
	 
	/**
	 * Using the rawData collection, we map data properties of the users in this array to an array that maps an array to properly
	 * display the data in the ListView based on the templates defined in directory.xml (levearges the _.map Function of UnderscoreJS)
	 */
	return _.map(rawData, function(item) {
		
		/**
		 * Create the new user object which is added to the Array that is returned by the _.map function. 
		 */
		return {
			template: "userTemplate",
			properties: {
				searchableText: "",
				user: item,
				editActions: [
					{title: "Does this even matter", color: item.isNew ? "#C41230" : "#038BC8" }
				],
				canEdit:true
			},
			userName: {text: item.NAME}//,
			//userCompany: {text: item.company},
			//userPhoto: {image: item.photo}, EXLUDE PHOTO FOR NOW
			//userEmail: {text: item.email} 
		};
	});	
};

/**
 * This function handles the click events for the rows in the ListView.
 * We want to capture the user property associated with the row, and pass
 * it into the profile View
 * 
 * @param {Object} Event data passed to the function
 */
function onItemClick(e){
	
	/**
	 * Get the Item that was clicked
	 */
	var item = $.listView.sections[e.sectionIndex].items[e.itemIndex];
	Alloy.Globals.profileViewID = item.properties.user.USER_ID;	//set the profile I want to view
	
	if (e.bindId == 'sendMessage')
	{
		alert('You clicked on send message!');
	}
	else
	{
		//Add my information to the profile's VIEWED ME list as I am going to view it
		var request = Ti.Network.createHTTPClient({ 	
		onerror: function(e){ 
			Ti.API.debug(e.error); 
			alert('There was an error during the connection PROFILE VIEW'); 
		}, 
		timeout:1000, 	         
		});  
		//Request the data from the web service, Here you have to change it for your local ip 
		request.open("POST","52.32.54.34/php/insert_into_viewed_me.php"); 
		
		var params = ({ "USER_ID": 				Alloy.Globals.profileViewID,	
						"OTHER_USER_ID": 		Alloy.Globals.thisUserID,
						});
		
		request.send(params);
		
		Alloy.Globals.comingFrom = 'connections';	//we are going to open profileView from connections
		Alloy.Globals.Navigate($, $.connections, Alloy.createController('profileView').getView() );
	}

}

/**
 * This function handles the click events for the rows in the ListView.
 * We want to capture the user property associated with the row, and pass
 * it into the profile View
 * 
 * @param {Object} Event data passed to the function
 */
function onItemClick2(e){
	
	/**
	 * Get the Item that was clicked
	 */
	var item = $.listView2.sections[e.sectionIndex].items[e.itemIndex];
	Alloy.Globals.profileViewID = item.properties.user.USER_ID;	//set the profile I want to view
	
	if (e.bindId == 'sendMessage')
	{
		alert('You clicked on send message!');
	}
	else if (e.bindId == 'accept')
	{
		alert('You clicked on Accept!');
	}
	else if (e.bindId == 'decline')
	{
		alert('You clicked on decline!');
	}
	else
	{
		//Add my information to the profile's VIEWED ME list as I am going to view it
		var request = Ti.Network.createHTTPClient({ 	
		onerror: function(e){ 
			Ti.API.debug(e.error); 
			alert('There was an error during the connection PROFILE VIEW'); 
		}, 
		timeout:1000, 	         
		});  
		//Request the data from the web service, Here you have to change it for your local ip 
		request.open("POST","52.32.54.34/php/insert_into_viewed_me.php"); 
		
		var params = ({ "USER_ID": 				Alloy.Globals.profileViewID,	
						"OTHER_USER_ID": 		Alloy.Globals.thisUserID,
						});
		
		request.send(params);
		
		Alloy.Globals.comingFrom = 'connections';	//we are going to open profileView from connections
		Alloy.Globals.Navigate($, $.connections, Alloy.createController('profileView').getView() );
	}

}

/**
 * Initialize View
 */
populateContacts();
populatePending();

