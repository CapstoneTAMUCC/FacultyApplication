/*
 * Controller for Matches section
 * Purpose: Provide functionality for the client's Matches section
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
    connection.onload = function(){ 
    	var json = JSON.parse(this.responseText); 
    	var json = json.MESSAGE_ID;
    	
    	// If the database is empty show an alert 
    	if(json.length == 0){
			Titanium.API.log("List empty");
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
$.matches.addEventListener('androidback' , function (e) {
	Alloy.Globals.goToHome ($, $.matches);
});

/**
 *	Home button function will take you to Main Menu
 */
var homeButtonFunc = function () {
	Alloy.Globals.goToHome ($, $.matches);
};

/**
 *	NOTE: Some of this function's functionality is gathered from Appcelerator's Example Employee Directory app.
 *	This function is used to populate the Matches list from remote database.
 */
function populateMatches()
{
	var matchResults = new Array();	     	// An array that holds matches
	var myUser = new Array();				// Holds the client's area of research information
	var matchIds = new Array();				// Holds the ID's of matches
	var matchIdsAndRanks = new Array();		// Holds IDs and ranking numbers
	var matchRank = 0;						// Holds the matches rank information
	
	// Function to use HTTP to connect to a web server and transfer the data. 
	var request1 = Ti.Network.createHTTPClient({ 
		onerror: function(e){ 	
			Ti.API.debug(e.error); 	
			alert('There was an error during the connection MATCHES 1'); 	
		}, 	
		timeout:1000, 
	});

	// Here you have to change it for your local ip 
	request1.open('GET', '52.32.54.34/php/read_area_of_research.php');  
	request1.send();
	
	// Called on load of connection
	request1.onload = function() {
		var json = JSON.parse(this.responseText);
		var json = json.USER_ID;
		
		for ( var i = 0; i < json.length; i++ )
		{
			if ( json[i].USER_ID == Alloy.Globals.thisUserID )
			{
				myUser.push(json[i]);	
			}
		}
		// myUser now has only the client's area of research information
		
		for ( var i = 0; i < json.length; i++ )
		{
			// We are looking for other users
			if ( json[i].USER_ID != Alloy.Globals.thisUserID ) 
			{
				// Increment the match rank counter for every common areas of research checked both by the client and the other user
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
			
			// Set it back to 0 for a health loop iteration
			matchRank = 0;	
		}
		
		// Sort by matching rank
		matchIdsAndRanks = _.sortBy(matchIdsAndRanks, function(match){	//sort the matchIdsAndRanks by the last character (the match rank)
			return match.charAt(match.length - 1)
		});
		
		// Copy everything to matchIds
		for ( var i = 0; i < matchIdsAndRanks.length; i++) //Now that matctIdsAndRanks is sorted, copy it all into matchIds in the same exact order
		{
			matchIds[i] = matchIdsAndRanks[i].slice( 0, (matchIdsAndRanks[i].length - 1) );
		}
		
		// Function to use HTTP to connect to a web server and transfer the data. 
		var request2 = Ti.Network.createHTTPClient({ 
			onerror: function(e){ 	
				Ti.API.debug(e.error); 	
				alert('There was an error during the connection MATCHES 2'); 	
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
			
			for ( var i = 0; i < matchIds.length; i++ )
			{
				// Find the match from user table
				for ( var j = 0; j < json.length; j++ )
				{
					if ( matchIds[i] === json[j].USER_ID )	
					{
						// Push the match user into the match results
						matchResults.push(json[j]);	
					}
				}
			}
			
			// If there are no matches to display, warn the user
			if (matchResults.length < 1)	
			{
				alert('No results found!');
			}
			else
			{
				// We want the highest rank to be at the top, so reverse the order of the array
				matchResults.reverse();	
	
				if (matchResults)
				{
					/**
					 * Setup our Sections Array for building out the ListView components 
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
						left: 10,
						font:{
							fontSize: 12
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
					
				} // End of if statement if(matchResults)
			
			} // End of else
			
		}; // End of second onload function
		
	}; // End of first onload function

} // End of populatematchResults function

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
function onItemClick(e){
	
	/**
	 * Get the Item that was clicked
	 */
	var item = $.listView.sections[e.sectionIndex].items[e.itemIndex];
	
	// Set the profile I want to view
	Alloy.Globals.profileViewID = item.properties.user.USER_ID;	
	
	// Clicked on Message button open a conversation page
	if (e.bindId == 'sendMessage')	
	{
		var newWindow = Alloy.createController('conversation', JSON.parse(makeJsonConversationString(dataArray,
			exists(Alloy.Globals.profileViewID), Alloy.Globals.profileViewID), Alloy.Globals.profileViewID)).getView();
		newWindow.open();
		Titanium.API.log('You clicked on send message!');
	}
	else
	{
		// Add my information to the profile's VIEWED ME list as I am going to view it
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
		
		// We are going to open profileView from matches
		Alloy.Globals.comingFrom = 'matches';	
		Alloy.Globals.Navigate($, $.matches, Alloy.createController('profileView').getView() );
	}

}

/**
 * Initialize View by populating lists
 */
popArrays ();		// Populate arrays
populateMatches();	// Populate matches list