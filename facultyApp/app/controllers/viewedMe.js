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
	
var dataArray = [];
var namesJson = [];
/**
 * Appcelerator Analytics Call
 */
var title = _args.title ? _args.title.toLowerCase() : "directory";
Ti.Analytics.featureEvent(Ti.Platform.osname+"."+title+".viewed");

function popArrays () {
	//function to use HTTP to connect to a web server and transfer the data. 
    var connection = Ti.Network.createHTTPClient({ 
    	onerror: function(e){ 
        	Ti.API.debug(e.error); 
            alert('There was an error during the connection'); 
        },
        timeout:1000,
    });                      

    //Here you have to change it for your local ip 
 //   connection.open('GET', '52.32.54.34/php/read_message_list.php');
    connection.open('POST', '52.32.54.34/php/conversation_list.php');
    var params = ({ "USER_ID": '1' });  
    connection.send(params);
    //Function to be called upon a successful response 
    connection.onload = function(){ 
    	var json = JSON.parse(this.responseText); 
    	var json = json.MESSAGE_ID;
    	//if the database is empty show an alert 
    	if(json.length == 0){
			Titanium.API.log("CRAP");
    //    $.tableView.headerTitle = "The database row is empty"; 
    	}
    	
    	//Emptying the data to refresh the view 

   	 	dataArray = new Array (0);                      

    	//Insert the JSON data to the table view 

   		for( var i=0; i<json.length; i++){ 
        
        	Titanium.API.log("MESSAGE_ID: " + json[i].MESSAGE_ID);                                          
     		Titanium.API.log("TO: " + json[i].TO_ID);
     		Titanium.API.log("FROM: " + json[i].FROM_ID);
     		Titanium.API.log("BODY: " + json[i].BODY);   
     		Titanium.API.log("DATE: " + json[i].DATE);   
     		Titanium.API.log("STATUS: " + json[i].STATUS); 
     		Titanium.API.log("LENGTH: " + dataArray.length);       

			var otherUserID = json[i].TO_ID == Alloy.Globals.thisUserID ? json[i].FROM_ID : json[i].TO_ID;
			
			var index = exists(otherUserID);
			
			if(index != -1) {
				dataArray [index].push(json[i]);
			}
			else {
				var tempArray = new Array(0);
				tempArray.push(json[i]);
				dataArray.push(tempArray);
			}
			
	//		orderArray();
     //		dataArray.push(row);               
		}
		//function to use HTTP to connect to a web server and transfer the data. 
		var conn = Ti.Network.createHTTPClient({ 
			onerror: function(e){ 	
					Ti.API.debug(e.error); 	
					alert('There was an error during the connection'); 
			
				}, 	
			timeout:1000, 
		});
		
		//Here you have to change it for your local ip 
		conn.open('GET', '52.32.54.34/php/read_user_list.php');  
		conn.send();
		
		conn.onload = function() {
			namesJson = JSON.parse(this.responseText);
			namesJson = namesJson.NAME;
		};  
	};
}

$.viewedMe.addEventListener('androidback' , function (e) {
	Alloy.Globals.goToHome ($, $.viewedMe);
});

var homeButtonFunc = function () {
	Alloy.Globals.goToHome ($, $.viewedMe);
};

function populatePending()
{
	var tempArray = null;
	var viewedMeList = new Array();
	//function to use HTTP to connect to a web server and transfer the data. 
	var request1 = Ti.Network.createHTTPClient({ 
	onerror: function(e){ 	
		Ti.API.debug(e.error); 	
		alert('There was an error during the connection VIEWED ME'); 	
	}, 	
	timeout:1000, 
	});

	//Here you have to change it for your local ip 
	request1.open('POST', '52.32.54.34/php/read_viewed_me_list.php');  
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
			alert('There was an error during the connection VIEWED ME'); 	
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
						viewedMeList.push(json[i]); //viewedMeList now holds all PENDING CONTACT's rows information
					}
				}
			}
		
			viewedMeList = _.sortBy(viewedMeList, function(user){
				return user.NAME
			});

			if (viewedMeList)
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
				var userGroups  = _.groupBy(viewedMeList, function(item){
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

}//end of populatePending function

function isConnection(user)
{	

	var foundUser = false;
	//CHECK TO SEE IF THE LIST ITEM IS ALREADY A CONTACT OF MINE
	var request1 = Ti.Network.createHTTPClient({ 
	onerror: function(e){ 	
		Ti.API.debug(e.error); 	
		alert('There was an error during the connection PENDING'); 	
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
		
		for( var i = 0; i < json.length; i++)
		{
			Titanium.API.log("WITHIN THE FOR LOOP!");
			if (json[i].OTHER_USER_ID == user.USER_ID )	//THIS MEANS HE IS MY CONTACT
			{
				Titanium.API.log("FOUND USER !");
				foundUser = true;
				break;
			}
		}
		
		
	};	//end of onload function
	
  

	if (foundUser) { Titanium.API.log("I AM RETURNING TRUE"); return true;} 
	else { Titanium.API.log("I AM RETURNING FALSE");  return false;} 
	Titanium.API.log("END OF THIS FUNCTION!");
}

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
			button1: {visible: isConnection(item) ? 'true' : 'false'},	//DOES NOT WORK BECAUSE FUNCTION DOES NOT WAIT FOR ONLOAD TO FINISH BEFORE RETURNING
			userName: {text: item.NAME}//,
			//userCompany: {text: item.company},
			//userPhoto: {image: item.photo}, EXLUDE PHOTO FOR NOW
			//userEmail: {text: item.email} 
		}; 
	});	
};

var makeJsonConversationString = function (dataArray, index, otherID) {
	var result = "{\"messages\":[";
	var titleName = getOtherName(namesJson, otherID);
	if (index >= 0) {
    		for (var j = 0; j < dataArray[index].length; j++) {
    			var otherUserID = dataArray[index][j].TO_ID == Alloy.Globals.
	    		thisUserID ? dataArray[index][j].FROM_ID : dataArray[index][j].TO_ID;
				var otherUserName = getOtherName(namesJson, otherUserID);
	    		result += "{";	
	    		result +="\"MESSAGE_ID\":" + "\"" + dataArray[index][j].MESSAGE_ID + "\",";
	    		result +="\"TO_ID\":" + "\"" + dataArray[index][j].TO_ID + "\",";
	    		result +="\"FROM_ID\":" + "\"" + dataArray[index][j].FROM_ID + "\",";
	    		result +="\"OTHER_ID\":" + "\"" + otherUserID + "\",";
	    		result +="\"OTHER_NAME\":" + "\"" + otherUserName + "\",";
	    		result +="\"BODY\":" + "\"" + dataArray[index][j].BODY + "\",";
	    		result +="\"STATUS\":" + "" + dataArray[index][j].STATUS + ",";
	    		result +="\"DATE\":" + "\"" + dataArray[index][j].DATE + "\"";
	    		result += "}";
	    		if (j != dataArray [index].length - 1) {
	    			result += ",";
	    		}
    		}
    }
    result += "],";
    result += "\"name\":" + "\"" + titleName + "\",";
    result += "\"id\":" + "\"" + otherID + "\"";
    result += "}";
    Titanium.API.log("HERETWICE: " + result);
    return result;
};

var getOtherName = function (array, otherID) {
	for(var i=0; i<array.length; i++) {
		if ( array[i].USER_ID == otherID)
		{
			return array[i].NAME;
		}
	}
	return "Not found";
};

var exists = function(otherUserID) {
    	for (var i = 0; i < dataArray.length; i++) {
    		if (dataArray[i][0].TO_ID === otherUserID ||
    			dataArray[i][0].FROM_ID === otherUserID) {
    			return i;	
    		}
    	}
    	return -1;
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
		var newWindow = Alloy.createController('conversation', JSON.parse(makeJsonConversationString(dataArray, exists(Alloy.Globals.profileViewID), Alloy.Globals.profileViewID), Alloy.Globals.profileViewID)).getView();
		newWindow.open();
		Titanium.API.log('You clicked on send message!');
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
		
		Alloy.Globals.comingFrom = 'viewedMe';	//we are going to open profileView from viewedMe
		Alloy.Globals.Navigate($, $.viewedMe, Alloy.createController('profileView').getView() );
	}

}

function onPhotoClick(e){
	var newWindow = Alloy.createController('profile').getView();
	Ti.UI.currentWindow.close();
	newWindow.open();
}

/**
 * Initialize View
 */
popArrays ();
populatePending ();

