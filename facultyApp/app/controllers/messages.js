/**
 * Instantiate the local variables for this controller
 */
var _args = arguments[0] || {}, // Any passed in arguments will fall into this property
	App = Alloy.Globals.App, // reference to the APP singleton object
	$FM = require('newsmgr'),  // newsManager object (see lib/utilities.js)
	users = null,  // Array placeholder for all users
	indexes = [];  // Array placeholder for the ListView Index (used by iOS only);
	

/**
 * Appcelerator Analytics Call
 */
var title = _args.title ? _args.title.toLowerCase() : "directory";
Ti.Analytics.featureEvent(Ti.Platform.osname+"."+title+".viewed");  
	          
 function insertStuff(){ 
	var request = Ti.Network.createHTTPClient({ 

   		onload:alert("Your chore has been submitted"), 

    	onerror: function(e){ 

        	Ti.API.debug(e.error); 

    		alert('There was an error during the conexion'); 

    	}, 

       		timeout:1000, 
    	});  

		//Request the data from the web service, Here you have to change it for your local ip 

        request.open("POST","52.32.54.34/php/insert_into_message.php"); 
                   
        var params = ({ "MESSAGE_ID": '555',
           				"FROM_ID": '1',
                        "TO_ID":  '1', 
                        "DATE": ' ', 
                        "BODY": 'HELLO', 
                        "STATUS": '-1', 
        });
                                       
        request.send(params); 
        Titanium.API.log("SDFFSDF: " + params);

};  

var dataArray = []; 
var thisUserID = 1;

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
    connection.open('GET', '52.32.54.34/php/read_message_list.php');
 //   connection.open('GET', '52.32.54.34/php/conversation_list.php');
    var params = ({ "USER_ID": '1' });  
    connection.send();
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
        	var row = Ti.UI.createTableViewRow({ 
        		title: json[i].BODY, 
            	hasChild : true, 
     		});
        
        	Titanium.API.log("MESSAGE_ID: " + json[i].MESSAGE_ID);                                          
     		Titanium.API.log("TO: " + json[i].TO_ID);
     		Titanium.API.log("FROM: " + json[i].FROM_ID);
     		Titanium.API.log("BODY: " + json[i].BODY);   
     		Titanium.API.log("DATE: " + json[i].DATE);   
     		Titanium.API.log("STATUS: " + json[i].STATUS); 
     		Titanium.API.log("LENGTH: " + dataArray.length);       

			var otherUserID = json[i].TO_ID == thisUserID ? json[i].FROM_ID : json[i].TO_ID;
			
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
	
		/**
	 	* Populate the users variable from the file this call returns an array
	 	*/
	//	conversations = JSON.parse(file.read().text).conversations;
		conversations = JSON.parse(makeJsonInboxString ()).conversations;
	
		/**
	 	* Sorts the `conversations` array by the lastName property of the user (leverages UnderscoreJS _.sortBy function)
	 	*/
	//	conversations = _.sortBy(conversations, function(conversation){
	//		return conversation.DATE;
	//	});
	
	//	conversations = conversations.reverse();
	
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
    
    var makeJsonInboxString = function () {
    	var result = "{\"conversations\":[";
    	for (var i = 0; i < dataArray.length; i++) {
    		for (var j = dataArray[i].length - 1; j < dataArray[i].length; j++) {
    			var otherUserID = dataArray[i][j].TO_ID == thisUserID ? dataArray[i][j].FROM_ID : dataArray[i][j].TO_ID;
    			result += "{";
    			result +="\"MESSAGE_ID\":" + "\"" + dataArray[i][j].MESSAGE_ID + "\",";
    			result +="\"TO_ID\":" + "\"" + dataArray[i][j].TO_ID + "\",";
    			result +="\"FROM_ID\":" + "\"" + dataArray[i][j].FROM_ID + "\",";
    			result +="\"OTHER_ID\":" + "\"" + otherUserID + "\",";
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
			userName: {text: item.OTHER_ID},
			userEmail: {text: ""},
			messageBody: {text: item.BODY},
			lastUpdated: {text: item.DATE}
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
	
	Titanium.API.log("WUT: " + item.properties.user.OTHER_ID);
	Titanium.API.log("WUT2: " + exists(item.properties.user.OTHER_ID));
	printArray();
	//Titanium.API.log("HAHA: " + JSON.stringify(item, null, 4));
	var newWindow = Alloy.createController('conversation', JSON.parse(makeJsonConversationString(exists(item.properties.user.OTHER_ID))).messages).getView();
	newWindow.open();
}

var makeJsonConversationString = function (index) {
    	var result = "{\"messages\":[";
    	for (var j = 0; j < dataArray[index].length; j++) {
    		result += "{";
    		var otherUserID = dataArray[index][j].TO_ID == thisUserID ? dataArray[index][j].FROM_ID : dataArray[index][j].TO_ID;
    		result +="\"MESSAGE_ID\":" + "\"" + dataArray[index][j].MESSAGE_ID + "\",";
    		result +="\"TO_ID\":" + "\"" + dataArray[index][j].TO_ID + "\",";
    		result +="\"FROM_ID\":" + "\"" + dataArray[index][j].FROM_ID + "\",";
    		result +="\"OTHER_ID\":" + "\"" + otherUserID + "\",";
    		result +="\"BODY\":" + "\"" + dataArray[index][j].BODY + "\",";
    		result +="\"STATUS\":" + "" + dataArray[index][j].STATUS + ",";
    		result +="\"DATE\":" + "\"" + dataArray[index][j].DATE + "\"";
    		result += "}";
    		if (j != dataArray [index].length - 1) {
    			result += ",";
    		}
    	}
    	result += "]}";
    	Titanium.API.log("HERETWICE: " + result);
    	return result;
};

var onDelete = function onDelete(e){
	var newWindow = Alloy.createController('conversation').getView();
	newWindow.open();
};

var onCompose = function onCompose(e){
	var newWindow = Alloy.createController('conversation').getView();
	newWindow.open();
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

