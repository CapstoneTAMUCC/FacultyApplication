/*
 * Controller for Connections section
 * Purpose: Provide functionality for the client's Connections section, which
 * 			includes both establish contacts and pending contacts
 */

/**
 * Instantiate the local variables for this controller
 */
var _args = arguments[0] || {}, // Any passed in arguments will fall into this property
	App = Alloy.Globals.App;    // Reference to the APP singleton object
	
// Arrays to store data retreived from server
var dataArray = [];	
var namesJson = [];	

/**
 * Return photo of user in conversation who is not the client
 */
var getOtherPhoto = function (id) {
	for( var i=0; i<namesJson.length; i++) {
		if ( namesJson[i].USER_ID == id)
		{
			Titanium.API.log("PHIOTO: " + namesJson[i].PHOTO);
			return namesJson[i].PHOTO;
		}
	}
	return "Not found";
};

/**
 * Create conversation string to be converted to JSON object and passed to Conversation view 
 */
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
	    		result +="\"PHOTO\":" + "\"" + getOtherPhoto(dataArray[index][j].FROM_ID) + "\",";
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

/**
 * Return name of user in conversation who is not the client
 */
var getOtherName = function (array, otherID) {
	for(var i=0; i<array.length; i++) {
		if ( array[i].USER_ID == otherID)
		{
			return array[i].NAME;
		}
	}
	return "Not found";
};

/**
 * Determine if otherUserID exists in dataArray
 * If it does, return index
 */
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
 *	Populate arrays by making calls to server
 *  Called by init function
 */
function popArrays () {
	
	// Function to use HTTP to connect to a web server and transfer the data. 
    var connection = Ti.Network.createHTTPClient({ 
    	onerror: function(e){ 
        	Ti.API.debug(e.error); 
            alert('There was an error during the connection'); 
        },
        timeout:1000,
    });                      

    // Here you have to change it for your local ip 
    connection.open('POST', '52.32.54.34/php/conversation_list.php');
    var params = ({ "USER_ID": Alloy.Globals.thisUserID });  
    connection.send(params);
    
    // Function to be called upon a successful response 
    connection.onload = function() { 
    	var json = JSON.parse(this.responseText); 
    	var json = json.MESSAGE_ID;
    	//if the database is empty show an alert 
    	if(json.length == 0){
			Titanium.API.log("Empty list");
    	}
    	
    	// Emptying the data to refresh the view 
   	 	dataArray = new Array (0);                      

    	// Insert the JSON data to the table view 
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
		}
		
		// Function to use HTTP to connect to a web server and transfer the data. 
		var conn = Ti.Network.createHTTPClient({ 
			onerror: function(e){ 	
					Ti.API.debug(e.error); 	
					alert('There was an error during the connection'); 
			
				}, 	
			timeout:1000, 
		});
		
		// Here you have to change it for your local ip 
		conn.open('GET', '52.32.54.34/php/read_user_list.php');  
		conn.send();
		
		// Called on load of connection
		conn.onload = function() {
			namesJson = JSON.parse(this.responseText);
			namesJson = namesJson.NAME;
		};  
	};
}

/**
 *	Use the androidback event to go back to Main Menu
 */
$.connections.addEventListener('androidback' , function (e) {
	Alloy.Globals.goToHome ($, $.connections);
});

/**
 *	Home button function will take you to Main Menu
 */
var homeButtonFunc = function () {
	Alloy.Globals.goToHome ($, $.connections);
};

/**
 *	NOTE: Some of this function's functionality is gathered from Appcelerator's Example Employee Directory app.
 *	This function is used to populate the Contacts list from remote database.
 */
function populateContacts()
{
	// Temporary array
	var tempArray = null; 
	
	// An array that will hold our contacts
	var contactList = new Array();	
	
	// Function to use HTTP to connect to a web server and transfer the data. 
	var request1 = Ti.Network.createHTTPClient({ 
	onerror: function(e){ 	
		Ti.API.debug(e.error); 	
		alert('There was an error during the connection CONTACTS'); 	
	}, 	
	timeout:1000, 
	});

	// Here you have to change it for your local ip 
	request1.open('POST', '52.32.54.34/php/read_contact_list.php');  
	var params = ({ "USER_ID": Alloy.Globals.thisUserID }); 
	request1.send(params);

	request1.onload = function() {
		var json = JSON.parse(this.responseText);
		var json = json.OTHER_USER_ID;
		
		// HOLD USER_ID s of CONTACTS
		tempArray = json; 
		
		// Function to use HTTP to connect to a web server and transfer the data. 
		var request2 = Ti.Network.createHTTPClient({ 
		onerror: function(e){ 	
				Ti.API.debug(e.error); 	
				alert('There was an error during the connection CONTACTS'); 	
			}, 	
			timeout:1000, 
		});
	
		// Here you have to change it for your local ip 
		request2.open('GET', '52.32.54.34/php/read_user_list.php');  
		request2.send();
		
		// Called on load of connection
		request2.onload = function() {
			var json = JSON.parse(this.responseText);
			var json = json.NAME;	
			
			for( var i=0; i < json.length; i++) 
			{
				for ( var j = 0; j < tempArray.length; j++)
				{
					// Find the contact
					if ( json[i].USER_ID === tempArray[j].OTHER_USER_ID)
					{
						//THESE ARE THE USER_ID s that I WANT TO USE FOR CONTACTS
						contactList.push(json[i]); 
					}
				}
				
				// ContactList now holds all CONTACT's rows information
			}
			
			// Sort by users' names
			contactList = _.sortBy(contactList, function(user){
				return user.NAME
			});

			if (contactList)
			{
				/**
				 * Setup our Sections Array for building out the ListView components
				 * 
				 */
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
				});	// End of each function
				
				/**
				 * Add the ListViewSections and data elements created above to the ListView
				 */
				$.listView.sections = sections;
			} // End of if statement
			
		};	// End of second onload function
		
	}; // End of first onload function

} // End of populateContacts function

/**
 *	NOTE: Some of this function's functionality is gathered from Appcelerator's Example Employee Directory app.
 *	This function is used to populate the Pending Contacts list from remote database.
 */
function populatePending()
{
	// Temporary array
	var tempArray = null;
	
	// Holds pending contacts
	var pendingList = new Array();
	
	// Function to use HTTP to connect to a web server and transfer the data. 
	var request1 = Ti.Network.createHTTPClient({ 
		onerror: function(e){ 	
			Ti.API.debug(e.error); 	
			alert('There was an error during the connection PENDING'); 	
		}, 	
		timeout:1000, 
	});

	// Here you have to change it for your local ip 
	request1.open('POST', '52.32.54.34/php/read_pending_list.php');  
	var params = ({ "USER_ID": Alloy.Globals.thisUserID }); 
	request1.send(params);

	// Called on load of connection
	request1.onload = function() {
		var json = JSON.parse(this.responseText);
		var json = json.OTHER_USER_ID;
		
		// HOLD USER_IDs of PENDING CONTACTS
		tempArray = json; 
		
		// Function to use HTTP to connect to a web server and transfer the data. 
		var request2 = Ti.Network.createHTTPClient({ 
			onerror: function(e){ 	
				Ti.API.debug(e.error); 	
				alert('There was an error during the connection PENDING'); 	
			}, 	
			timeout:1000, 
		});
	
		// Here you have to change it for your local ip 
		request2.open('GET', '52.32.54.34/php/read_user_list.php');  
		request2.send();
		
		// Called upon connection
		request2.onload = function() {
			var json = JSON.parse(this.responseText);
			var json = json.NAME;	
			
			for( var i=0; i < json.length; i++) 
			{
				//FIND THE PENDING CONTACT IN USER TABLE
				for ( var j = 0; j < tempArray.length; j++)
				{
					if ( json[i].USER_ID === tempArray[j].OTHER_USER_ID)	
					{
						// THESE ARE THE USER_ID s that I WANT TO USE FOR PENDING CONTACTS
						pendingList.push(json[i]); 
					}
				}
				
				// PendingList now holds all PENDING CONTACT's rows information
			}
			
			// Sort by users' names
			pendingList = _.sortBy(pendingList, function(user){
				return user.NAME
			});

			if (pendingList)
			{
				/**
				 * Setup our Sections Array for building out the ListView components
				 */
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
				});	// End of each function
				
				/**
				 * Add the ListViewSections and data elements created above to the ListView
				 */
				$.listView2.sections = sections;
			} // End of if statement
			
		};	// End of second onload function
		
	}; // End of first onload function

} // End of populatePending function

/**
 *	NOTE: This function is gathered from Appcelerator's Example Employee Directory app. 
 *
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
				user: item,
			},
			userName: {text: item.NAME},	//get user's name'
			userPhoto: {image: item.PHOTO}	//get user's profile picture
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
function onItemClick(e) {
	
	/**
	 * Get the Item that was clicked
	 */
	var item = $.listView.sections[e.sectionIndex].items[e.itemIndex];
	Alloy.Globals.profileViewID = item.properties.user.USER_ID;	//set the profile I want to view
	
	// Clicked on message button
	if (e.bindId == 'sendMessage')	
	{
		var newWindow = Alloy.createController('conversation', JSON.parse(makeJsonConversationString(dataArray, exists(Alloy.Globals.profileViewID), Alloy.Globals.profileViewID), Alloy.Globals.profileViewID)).getView();
		newWindow.open();
	}
	
	// Open profile view
	else	
	{
		// Add my information to the profile's VIEWED ME list as I am going to view it
		var request = Ti.Network.createHTTPClient({ 	
		onerror: function(e){ 
			Ti.API.debug(e.error); 
			alert('There was an error during the connection'); 
		}, 
		timeout:1000, 	         
		});
		  
		// Request the data from the web service, Here you have to change it for your local ip 
		request.open("POST","52.32.54.34/php/insert_into_viewed_me.php"); 
		
		var params = ({ "USER_ID": 				Alloy.Globals.profileViewID,	
						"OTHER_USER_ID": 		Alloy.Globals.thisUserID,
						});
		
		request.send(params);
		
		// Open profileView from connections
		Alloy.Globals.comingFrom = 'connections';	
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
function onItemClick2 (e) {
	
	/**
	 * Get the Item that was clicked
	 */
	var item = $.listView2.sections[e.sectionIndex].items[e.itemIndex];
	
	// Set the profile I want to view
	Alloy.Globals.profileViewID = item.properties.user.USER_ID;	
	
	if (e.bindId == 'sendMessage')
	{
		var newWindow = Alloy.createController('conversation', JSON.parse(makeJsonConversationString(dataArray,
			exists(Alloy.Globals.profileViewID), Alloy.Globals.profileViewID), Alloy.Globals.profileViewID)).getView();
		newWindow.open();
		Titanium.API.log('You clicked on send message!');
	}
	
	// On click of accept
	else if (e.bindId == 'accept')
	{
		// Add this profile to my contacts 
		var request1 = Ti.Network.createHTTPClient({ 	
		onerror: function(e){ 
			Ti.API.debug(e.error); 
			alert('There was an error during the connection PROFILE VIEW'); 
		}, 
		timeout:1000, 	         
		});
		  
		// Request the data from the web service, Here you have to change it for your local ip 
	    request1.open("POST","52.32.54.34/php/insert_into_contact.php"); 
		
		var params = ({ "USER_ID": 				Alloy.Globals.thisUserID,	
						"OTHER_USER_ID": 		Alloy.Globals.profileViewID,
						});
	
		request1.send(params);
		
		
		// Add myself to this profile's contacts list
		var request2 = Ti.Network.createHTTPClient({ 	
			onerror: function(e){ 
				Ti.API.debug(e.error); 
				alert('There was an error during the connection PROFILE VIEW'); 
			}, 
			timeout:1000, 	         
		});  
		
		// Request the data from the web service, Here you have to change it for your local ip 
	    request2.open("POST","52.32.54.34/php/insert_into_contact.php"); 
		
		var params = ({ "USER_ID": 				Alloy.Globals.profileViewID,	
						"OTHER_USER_ID": 		Alloy.Globals.thisUserID,
						});
	
		request2.send(params);
		
		// Delete him from my pending list
		var request3 = Ti.Network.createHTTPClient({ 	
			onerror: function(e){ 
				Ti.API.debug(e.error); 
				alert('There was an error during the connection PROFILE VIEW'); 
			}, 
			timeout:1000, 	         
		}); 
		 
		// Request the data from the web service, Here you have to change it for your local ip 
	    request3.open("POST","52.32.54.34/php/delete_pending.php"); 
		
		var params = ({ "USER_ID": 				Alloy.Globals.thisUserID,	
						"OTHER_USER_ID": 		Alloy.Globals.profileViewID,
						});
	
		request3.send(params);
		
		// Refresh contacts
		populateContacts();
		
		// Refresh pending
		populatePending();
	}
	
	// On click of decline
	else if (e.bindId == 'decline')
	{
		// Delete him from my pending
		var request = Ti.Network.createHTTPClient({ 	
			onerror: function(e){ 
				Ti.API.debug(e.error); 
				alert('There was an error during the connection PROFILE VIEW'); 
			}, 
			timeout:1000, 	         
		});  
		
		// Request the data from the web service, Here you have to change it for your local ip 
	    request.open("POST","52.32.54.34/php/delete_pending.php"); 
		
		var params = ({ "USER_ID": 				Alloy.Globals.thisUserID,	
						"OTHER_USER_ID": 		Alloy.Globals.profileViewID,
						});
	
		request.send(params);
		
		// Refresh contacts
		populateContacts();
		
		// Refresh pending
		populatePending();
	}
	else
	{
		// Add my information to the profile's Viewed Me list as I am going to view it
		var request = Ti.Network.createHTTPClient({ 	
			onerror: function(e){ 
				Ti.API.debug(e.error); 
				alert('There was an error during the connection PROFILE VIEW'); 
			}, 
			timeout:1000, 	         
		});  
		
		// Request the data from the web service, Here you have to change it for your local ip 
		request.open("POST","52.32.54.34/php/insert_into_viewed_me.php"); 
		
		var params = ({ "USER_ID": 				Alloy.Globals.profileViewID,	
						"OTHER_USER_ID": 		Alloy.Globals.thisUserID,
						});
		
		request.send(params);
		
		// Open profileView from Connections
		Alloy.Globals.comingFrom = 'connections';
		Alloy.Globals.Navigate($, $.connections, Alloy.createController('profileView').getView());
	}

}

/**
 * Initialize View by populating arrays
 */
popArrays ();		// Populate arrays
populateContacts();	// Populate contacts list
populatePending();	// Populate pending contacts list

