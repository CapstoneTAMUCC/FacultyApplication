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

$.matches.addEventListener('androidback' , function (e) {
	Alloy.Globals.goToHome ($, $.matches);
});

var homeButtonFunc = function () {
	Alloy.Globals.goToHome ($, $.matches);
};

function populateMatches()
{
	var matchResults = new Array();
	var myUser = new Array();	//holds the client's area of research information
	var matchIds = new Array();	//holds the ID's of matches
	var matchIdsAndRanks = new Array();	//holds IDs and ranking numbers
	var matchRank = 0;
	
	//function to use HTTP to connect to a web server and transfer the data. 
	var request1 = Ti.Network.createHTTPClient({ 
	onerror: function(e){ 	
		Ti.API.debug(e.error); 	
		alert('There was an error during the connection MATCHES 1'); 	
	}, 	
	timeout:1000, 
	});

	//Here you have to change it for your local ip 
	request1.open('GET', '52.32.54.34/php/read_area_of_research.php');  
	request1.send();
	
	request1.onload = function() {
		var json = JSON.parse(this.responseText);
		var json = json.USER_ID;
		
		for ( var i = 0; i < json.length; i++ )
		{
			if ( json[i].USER_ID == Alloy.Globals.thisUserID )
			{
				myUser.push(json[i]);	//myUser now has only the client's area of research information
			}
		}
		
		for ( var i = 0; i < json.length; i++ )
		{
			if ( json[i].USER_ID != Alloy.Globals.thisUserID ) //we are looking for other users
			{
				//Increment the match rank counter for every common areas of research checked both by the client and the other user
				if ( json[i].FOOD_SAFETY === myUser[0].FOOD_SAFETY && json[i].FOOD_SAFETY == '1' ) { matchRank++; }
				if ( json[i].NUTRITION === myUser[0].NUTRITION && json[i].NUTRITION == '1') { matchRank++; }
				if ( json[i].PUBLIC_HEALTH === myUser[0].PUBLIC_HEALTH && json[i].PUBLIC_HEALTH == '1' ) { matchRank++; }
				if ( json[i].PRODUCTION_ECON === myUser[0].PRODUCTION_ECON && json[i].PRODUCTION_ECON == '1' ) { matchRank++; }
				if ( json[i].ANIMAL_HEALTH === myUser[0].ANIMAL_HEALTH && json[i].ANIMAL_HEALTH == '1' ) { matchRank++; }
				if ( json[i].FISH === myUser[0].FISH && json[i].FISH == '1' ) { matchRank++; }
				if ( json[i].BIO_ENERGY === myUser[0].BIO_ENERGY && json[i].BIO_ENERGY == '1' ) { matchRank++; }
				if ( json[i].WILDLIFE === myUser[0].WILDLIFE && json[i].WILDLIFE == '1' ) { matchRank++; }
				if ( json[i].PUBLIC_POLICY === myUser[0].PUBLIC_POLICY && json[i].PUBLIC_POLICY == '1' ) { matchRank++; }
				if ( json[i].TRADE === myUser[0].TRADE && json[i].TRADE == '1' ) { matchRank++; }
				
				matchIdsAndRanks.push(json[i].USER_ID + '' + matchRank);
			}
			matchRank = 0;	//set it back to 0 for a health loop iteration
		}
		
		matchIdsAndRanks = _.sortBy(matchIdsAndRanks, function(match){	//sort the matchIdsAndRanks by the last character (the match rank)
			return match.charAt(match.length - 1)
		});
		
		for ( var i = 0; i < matchIdsAndRanks.length; i++) //Now that matctIdsAndRanks is sorted, copy it all into matchIds in the same exact order
		{
			matchIds[i] = matchIdsAndRanks[i].slice( 0, (matchIdsAndRanks[i].length - 1) );
		}
		
		//function to use HTTP to connect to a web server and transfer the data. 
		var request2 = Ti.Network.createHTTPClient({ 
		onerror: function(e){ 	
			Ti.API.debug(e.error); 	
			alert('There was an error during the connection MATCHES 2'); 	
		}, 	
		timeout:1000, 
		});
	
		//Here you have to change it for your local ip 
		request2.open('GET', '52.32.54.34/php/read_user_list.php');  
		request2.send();
		
		request2.onload = function() {
			var json = JSON.parse(this.responseText);
			var json = json.NAME;	
			
			for ( var i = 0; i < matchIds.length; i++ )
			{
				for ( var j = 0; j < json.length; j++ )
				{
					if ( matchIds[i] === json[j].USER_ID )	//find the match from user table
					{
						matchResults.push(json[j]);	//push the match user into the match results
					}
				}
			}
			
			if (matchResults.length < 1)	//if there are no matches to display, warn the user
			{
				alert('No results found!');
			}
			else
			{
				matchResults.reverse();	//we want the highest rank to be at the top, so reverse the order of the array
	
				if (matchResults)
				{
					/**
					 * Setup our Indexes and Sections Array for building out the ListView components
					 * 
					 */
					var sections = [];
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
					 	text: 'Matches listed based on your areas of research',
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
					 * Take the group data that is passed into the function, and parse/transform
					 * it for use in the ListView templates as defined in the directory.xml file.
					 */
					var dataToAdd = preprocessForListView( matchResults );
					
					/**
					 * Check to make sure that there is data to add to the table,
					 * if not lets exit
					 */
					if(dataToAdd.length < 1) return;
	
					/**
					 * Add Data to the ListViewSection
					 */
					section.items = dataToAdd;
					
					/**
					 * Push the newly created ListViewSection onto the `sections` array. This will be used to populate
					 * the ListView 
					 */
					sections.push(section);
					
					/**
					 * Add the ListViewSections and data elements created above to the ListView
					 */
					$.listView.sections = sections;
					
				}// end of if statement if(matchResults)
			
			}//end of else
			
		};//end of second onload function
		
	};//end of first onload function

}//end of populatematchResults function

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
	 * Appcelerator Analytics Call
	 */
	Ti.Analytics.featureEvent(Ti.Platform.osname+"."+title+".contact.clicked");
	
	/**
	 * Get the Item that was clicked
	 */
	var item = $.listView.sections[e.sectionIndex].items[e.itemIndex];
	
	/**
	 * Open the profile view, and pass in the user data for this contact
	 */
	Alloy.Globals.Navigator.open("profile", item.properties.user);
}


function onPhotoClick(e){
	var newWindow = Alloy.createController('profile').getView();
	Ti.UI.currentWindow.close();
	newWindow.open();
}

/**
 * Initialize View
 */
populateMatches();

