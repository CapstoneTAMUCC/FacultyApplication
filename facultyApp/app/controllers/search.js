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

$.search.addEventListener('androidback' , function (e) {
	Alloy.Globals.goToHome ($, $.search);
});

var homeButtonFunc = function () {
	Alloy.Globals.goToHome ($, $.search);
};

function populateSearchResults()
{
	var searchResults = new Array();
	var tempString = " ";
	//function to use HTTP to connect to a web server and transfer the data. 
	var request1 = Ti.Network.createHTTPClient({ 
	onerror: function(e){ 	
		Ti.API.debug(e.error); 	
		alert('There was an error during the connection SEARCH'); 	
	}, 	
	timeout:1000, 
	});

	//Here you have to change it for your local ip 
	request1.open('GET', '52.32.54.34/php/read_user_list.php');  
	request1.send();
	
	request1.onload = function() {
		var json = JSON.parse(this.responseText);
		var json = json.NAME;
		
		for ( var i = 0; i < json.length; i++ )
		{
			if ( json[i].USER_ID != Alloy.Globals.thisUserID)
			{
				tempString = json[i].NAME + '' + 
							json[i].EDUCATION + '' +  
							json[i].CURRENT_PROJ + '' +
							json[i].AREA_EXPERTISE + '' +
							json[i].COMMITTEES + '' +
							json[i].OTHER_INTERESTS;

				if ( tempString.indexOf( $.searchText.value ) != -1 )
				{
					searchResults.push(json[i]);
				}

			}
		}
		
		if (searchResults.length < 1)	//if there are no search results display a warning
		{
			alert('No results found!');
		}
		else
		{
			searchResults = _.sortBy(searchResults, function(user){
				return user.NAME
			});
			
			if (searchResults)
			{
				/**
				 * Setup our Indexes and Sections Array for building out the ListView components
				 * 
				 */
				var sections = [];
				
				/**
				 * Group the data by first letter of last name to make it easier to create 
				 * sections. (leverages the UndrescoreJS _.groupBy function)
				 */
				var userGroups  = _.groupBy(searchResults, function(item){
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
			}// end of if statement if (searchResults)
			
		}//end of else 
		
	};//end of onload function

}//end of populateSearchResults function

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
	
	Alloy.Globals.comingFrom = 'search';	//we are going to open profileView from search
	Alloy.Globals.Navigate($, $.search, Alloy.createController('profileView').getView() );
}

$.searchButton.addEventListener('click', function(e)
{
	if ($.searchText.value == '' || $.searchText.value == ' ' )
	{
		alert('Please enter a search phrase');
	}
	else
	{
		populateSearchResults();
	}
});

function onPhotoClick(e){
	var newWindow = Alloy.createController('profile').getView();
	Ti.UI.currentWindow.close();
	newWindow.open();
}

function messageClick(e){
	alert('You clicked the message button!');
}

function requestClick(e){
	alert('You clicked the request connection button!');
}