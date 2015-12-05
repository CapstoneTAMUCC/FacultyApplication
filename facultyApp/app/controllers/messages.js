/**
 * Instantiate the local variables for this controller
 */
var _args = arguments[0] || {}, // Any passed in arguments will fall into this property
	App = Alloy.Globals.App, // reference to the APP singleton object
	$FM = require('newsmgr'),  // newsManager object (see lib/utilities.js)
	users = null,  // Array placeholder for all users
	indexes = [];  // Array placeholder for the ListView Index (used by iOS only);
	
var namesJson;

/**
 * Appcelerator Analytics Call
 */
var title = _args.title ? _args.title.toLowerCase() : "directory";
Ti.Analytics.featureEvent(Ti.Platform.osname+"."+title+".viewed");  

var dataArray = []; 

/**
 * Function to inialize the View, gathers data from the flat file and sets up the ListView
 */
function init(){
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
    var params = ({ "USER_ID": Alloy.Globals.thisUserID });  
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
			
			orderArray();
     //		dataArray.push(row);               
		};  
		/**
	 	* Access the FileSystem Object to read in the information from a flat file (lib/userData/messageData.js)
	 	* DOCS: http://docs.appcelerator.com/platform/latest/#!/api/Titanium.Filesystem
	 	*/
		var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + "userData/messageData.json"); 
	
		//function to use HTTP to connect to a web server and transfer the data. 
		var sendit = Ti.Network.createHTTPClient({ 
		onerror: function(e){ 	
				Ti.API.debug(e.error); 	
				alert('There was an error during the connection'); 
		
			}, 	
			timeout:1000, 
		});
		
		//Here you have to change it for your local ip 
		sendit.open('GET', '52.32.54.34/php/read_user_list.php');  
		sendit.send();
		
		sendit.onload = function() {
			var json = JSON.parse(this.responseText);
			var json = json.NAME;
			
			namesJson = json;
			Alloy.Globals.thisUserPhoto = getOtherPhoto (Alloy.Globals.thisUserID);
			
			/**
		 	* Populate the users variable from the file this call returns an array
		 	*/
			conversations = JSON.parse(makeJsonInboxString ()).conversations;
		
			/**
		 	* IF the users array exists
		 	*/
			if(conversations) {
			
				/**
			 	* Setup our Indexes and Sections Array for building out the ListView components
			 	* 
			 	*/
				indexes = [];
				var sections = [];
				var conversationGroups  = _.groupBy(conversations, function(item){
			 		return item.DATE;
				});
	        
	        	/**
	         	* Iterate through each group created, and prepare the data for the ListView
	         	* (Leverages the UnderscoreJS _.each function)
	         	*/
				_.each(conversationGroups, function(group){
	
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
						title: "what is this"
					});
	
					/**
				 	* Create a new ListViewSection, and ADD the header view created above to it.
				 	*/
				 	var section = Ti.UI.createListSection({});
	
					/**
				 	* Add Data to the ListViewSection
				 	*/
					section.items = dataToAdd;
				
					/**
				 	* Push the newly created ListViewSection onto the `sections` array. This will be used to populate
				 	* the ListView 
				 	*/
					sections.push(section);
				});
	
				/**
			 	* Add the ListViewSections and data elements created above to the ListView
			 	*/
				$.listView.sections = sections;
			
				/**
			 	* For iOS, we add an event listener on the swipe of the ListView to display the index of the ListView we 
			 	* created above. The `sectionIndexTitles` property is only valid on iOS, so we put these handlers in the iOS block.
			 	*/
				if(OS_IOS) {
					$.messages.addEventListener("swipe", function(e){
						if(e.direction === "left"){
							$.listView.sectionIndexTitles = indexes;
						}
						if(e.direction === "right"){
							$.listView.sectionIndexTitles = null;
						}
					});
				}
			}
		
			else {
				
				if(OS_IOS){
					$.messages.leftNavButton = Ti.UI.createLabel({
						text: "\ue601",
						color: "#C41230",
						font:{
							fontFamily:"icomoon",
							fontSize:36
						}
					});
				}
			}
		};		
    };              
    
    var orderArray = function () {
    	for (var i = 0; i < dataArray.length; i++) {
    		dataArray[i] = _.sortBy(dataArray[i], function(message){
				return message.DATE;
			});
    	}
    	
    	printArray ();
    	
    	dataArray = _.sortBy(dataArray, function(conversation) {
    			return conversation[conversation.length - 1].DATE;
    	});
    	
    	dataArray.reverse();
    	
    	printArray ();
    };             
    
    var makeJsonInboxString = function (otherUserName) {
    	var result = "{\"conversations\":[";
    	for (var i = 0; i < dataArray.length; i++) {
    		for (var j = dataArray[i].length - 1; j < dataArray[i].length; j++) {
    			var otherUserID = dataArray[i][j].TO_ID == Alloy.Globals.thisUserID ? dataArray[i][j].FROM_ID : dataArray[i][j].TO_ID;
    			result += "{";
    			result +="\"MESSAGE_ID\":" + "\"" + dataArray[i][j].MESSAGE_ID + "\",";
    			result +="\"TO_ID\":" + "\"" + dataArray[i][j].TO_ID + "\",";
    			result +="\"FROM_ID\":" + "\"" + dataArray[i][j].FROM_ID + "\",";
    			result +="\"OTHER_ID\":" + "\"" + otherUserID + "\",";
    			result +="\"OTHER_NAME\":" + "\"" + getOtherName(otherUserID) + "\",";
    			result +="\"PHOTO\":" + "\"" + getOtherPhoto(otherUserID) + "\",";
    			result +="\"BODY\":" + "\"" + dataArray[i][j].BODY + "\",";
    			result +="\"STATUS\":" + "" + dataArray[i][j].STATUS + ",";
    			result +="\"DATE\":" + "\"" + dataArray[i][j].DATE + "\"";
    			result += "}";	
    			if (i != dataArray.length - 1 || j != dataArray [i].length - 1) {
    				result += ",";
    			}
			}
    	}
    	result += "]}";
    	Titanium.API.log("HERE: " + result);
    	return result;
    };
    $.messages.open ();
};

var getOtherName = function (otherID) {
	for( var i=0; i<namesJson.length; i++) {
		if ( namesJson[i].USER_ID == otherID)
		{
			return namesJson[i].NAME;
		}
	}
	return "Not found";
};

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

var printArray = function () {
    for (var i = 0; i < dataArray.length; i++) {
    	for (var j = 0; j < dataArray[i].length; j++) {
   			Titanium.API.log(i + " " + j + ": " + dataArray [i][j].TO_ID + " " + dataArray [i][j].FROM_ID);
		}	
	}
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
 *	Convert an array of data from a JSON file into a format that can be added to the ListView
 * 
 * 	@param {Object} Raw data elements from the JSON file.
 */
var preprocessForListView = function(rawData) {
	if(_args.restrictTonews) {
		rawData = _.filter(rawData, function(item){
			
			/**
			 * each item (or user) that is referenced, we look to see if the user id is included in news array
			 * retrieved from persistent storage above
			 */
			return $FM.exists(item.id);
		});
	}
	
	/**
	 * Using the rawData collection, we map data properties of the users in this array to an array that maps an array to properly
	 * display the data in the ListView based on the template defined in messages.xml (levearges the _.map Function of UnderscoreJS)
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
			userName: {text: item.OTHER_NAME},
			userPhoto: {image: item.PHOTO},
			userEmail: {text: ""},
			messageBody: {text: item.BODY},
			lastUpdated: {text: makeReadable(item.DATE)}
		};
	});	
};

var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// yyyy-mm-dd hh:mm:ss to month/day hh:mm am 
var makeReadable = function (date) {
	var result = "";
	date = date.substring (5, 16);
	var month = date.substring (0, 2);
	var day = date.substring (3, 5);
	var hour = date.substring (6, 8) - 1;
	var min = date.substring (9, 11);
	var ampm;
	
	if (hour < 12) {
		ampm = "AM";
	}
	else if (hour == 12) {
		ampm = "PM";
	}
	else {
		ampm = "PM";
		hour = hour - 12;
	}
	
	month = month.length == 1 ? month.substring (1, 2) : month;
	day = day.length == 1 ? day.substring (1, 2) : day;
	hour = hour.length == 1 ? hour.substring (1, 2) : hour;
	
	return month + "/" + day + " " + hour + ":" + min + " " + ampm;
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
	
	Titanium.API.log("WUT: " + item.properties.user.OTHER_ID);
	Titanium.API.log("WUT2: " + exists(item.properties.user.OTHER_ID));
	printArray();
	//Titanium.API.log("HAHA: " + JSON.stringify(item, null, 4));
	var newWindow = Alloy.createController('conversation', JSON.parse(makeJsonConversationString(exists(item.properties.user.OTHER_ID), item.properties.user.OTHER_ID))).getView();
	newWindow.open();
}

$.messages.addEventListener('androidback' , function (e) {
	Alloy.Globals.goToHome ($, $.messages);
});

var homeButtonFunc = function () {
	Alloy.Globals.goToHome ($, $.messages);
};

var makeTitleNameString = function (name) {
    	var result = "{\"name\":[";
    		result += "{";
    		result +="\"USER_NAME\":" + "\"" + name + "\"";
    		result += "}";
    	result += "]}";
    	return result;
};

var makeJsonConversationString = function (index, otherID) {
    	var result = "{\"messages\":[";
    	for (var j = 0; j < dataArray[index].length; j++) {
    		result += "{";
    		var otherUserID = dataArray[index][j].TO_ID == Alloy.Globals.
    		thisUserID ? dataArray[index][j].FROM_ID : dataArray[index][j].TO_ID;	
    		var otherUserName = getOtherName(otherUserID);
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
    	result += "], \"name\":" + "\"" + otherUserName + "\",";
    	result += "\"id\":" + "\"" + otherID + "\"";
    	result += "}";
    	Titanium.API.log("HERETWICE: " + result);
    	return result;
};

var onCompose = function onCompose(e) {
	Titanium.API.log("ONCOMPOSE");
	for (var i = 0; i < dataArray.length; i++) {
   		Titanium.API.log("ID: " + dataArray[i][0].TO_ID + " " + dataArray[i][0].FROM_ID);
   	}
	Alloy.Globals.Navigate ($, $.messages, Alloy.createController('newMessage').getView());
	var newWindow = Alloy.createController('newMessage', dataArray).getView();
	newWindow.open ();
};

/**
 * Listen for the refresh event, and re-initialize
 */
Ti.App.addEventListener("refresh-data", function(e){
	init();
});


/**
 * Initialize View
 */
init();

