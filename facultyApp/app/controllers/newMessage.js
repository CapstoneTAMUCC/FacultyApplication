/*
 * Controller for New Message page
 * Purpose: Provide functionality for allowing the client to compose new messages
 * 			to users who are established contacts
 */

// Arrays to store data retreived from server
var data = [];
var namesJson = [];

// Any passed in arguments will fall into this property
var dataArray = arguments[0] || {}; 

// Create picker and other constructs for initialized view
function init() {
	
	// Function to use HTTP to connect to a web server and transfer the data.
	var connection = Ti.Network.createHTTPClient({ 
	  	onerror: function(e){ 
			Ti.API.debug(e.error); 
			alert('There was an error during the connection'); 
	    },
	    timeout:1000,
	});                  
	
	// Here you have to change it for your local ip 
	connection.open('POST', '52.32.54.34/php/read_contact_list.php');
	var params = ({ "USER_ID": Alloy.Globals.thisUserID });  
	connection.send(params);
	
	// Function to be called upon a successful response 
	connection.onload = function(){ 
	    var json = JSON.parse(this.responseText); 
	    var json = json.OTHER_USER_ID;
	    
	    // If the database is empty show an alert 
	    if(json.length == 0){
			Titanium.API.log("CRAP");
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
		  	                  
			// Insert the JSON data to the table view 
			for( var i=0; i<json.length; i++){ 
		      	
		      	Titanium.API.log("OTHER_USER_ID: " + json[i].OTHER_USER_ID);          
				
				var row = Ti.UI.createPickerRow({title: getOtherName(namesJson, json[i].OTHER_USER_ID), id: json[i].OTHER_USER_ID});
				row.add(Titanium.UI.createLabel({
				    left: 0,
				    text: row.title,
				    color: 'black',
				    font: {
				        fontFamily:'Arial',
				        fontSize: '14dp',
				        fontStyle: 'normal',
				        fontWeight: 'normal'
				    }
				}));
				data.push(row);
			              
			}
		
			// Add picker options and automatically select first contact
			$.picker.add(data);
			$.picker.setSelectedRow(0, 0, false);
			
			// Called when a name is selected
			$.picker.addEventListener('change',function(e){
		   		Titanium.API.log('change: '+ $.picker.getSelectedRow(0).title);
			});
		};
	};
};

/*
 * Called when select button is pressed
 * Navigates to conversation view for selected user and client
 */
function onSelectButton (e) {
	var newWindow = Alloy.createController('conversation', 
		JSON.parse(makeJsonConversationString(dataArray, exists(dataArray, $.picker.getSelectedRow(0).id), 
			$.picker.getSelectedRow(0).id))).getView();
	newWindow.open ();
}

/**
 * Determine if otherUserID exists in dataArray
 * If it does, return index
 */
var exists = function(array, otherUserID) {
   	for (var i = 0; i < array.length; i++) {
   		Titanium.API.log("ID: " + array[i][0].TO_ID + " " + array[i][0].FROM_ID);
   		if (array[i][0].TO_ID === otherUserID ||
   			array[i][0].FROM_ID === otherUserID) {
   			return i;	
   		}
   	}
   	
  	return -1;
}; 

/**
 *	Home button function will take you to Main Menu
 */
var homeButtonFunc = function () {
	Alloy.Globals.goToHome ($, $.conversation);
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

// Called when Home button is clicked, navigates home
var homeButtonFunc = function () {
	Alloy.Globals.goToHome ($, $.newMessage);
};

// Override Android back functionality to return to Main Menu
$.newMessage.addEventListener('androidback' , function (e) {
	Alloy.Globals.Navigate ($, $.newMessage, Alloy.createController('messages').getView());
});

// Initialize view
init ();

// Open view
$.newMessage.open();