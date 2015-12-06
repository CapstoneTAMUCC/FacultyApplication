/*
 * Controller for Profile Views
 * Purpose: Provide functionality for viewing of other users' profile 
 * 			information
 */

/**
 * Instantiate the local variables for this controller
 * Store arguments passed to controller
 */
var _args = arguments[0] || {};

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
	    		result +="\"PHOTO\":" + "\"" + getOtherPhoto(dataArray[index][j].FROM_ID) + "\",";
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
    var params = ({ "USER_ID": Alloy.Globals.thisUserID});  
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
 *	Called when client wants to send message to user
 *  Navigates to conversation between user and client
 */
var onSendMessage = function(e){
	var newWindow = Alloy.createController('conversation', JSON.parse(makeJsonConversationString(dataArray,
		exists(Alloy.Globals.profileViewID), Alloy.Globals.profileViewID), Alloy.Globals.profileViewID)).getView();
	newWindow.open();
	Titanium.API.log('You clicked on send message!');
};

/**
 *	This function is used to convert regular buttons to checkboxes
 * 
 * 	@param {Object} the button
 */
function checkboxFunction(e)
{
	if(false == e.source.value) {
        e.source.value = true;
        e.source.backgroundColor = '#007690';
        e.source.title = '\u2713';
    } else{
        e.source.value = false;
        e.source.backgroundColor = '#aaa';
        e.source.title = '';
    }
}

/**
 *	This function sets the Connect button's status based on user's relationship with the profile he/she is viewing
 */
function setConnectButtonStatus()
{
	// If set to true, means that we know the button's status
	var statusFound = false;	
	
	// FIRST CHECK --> CHECK TO SEE IF THE PROFILE I AM VIEWING IS ALREADY A CONTACT OF MINE
	var request1 = Ti.Network.createHTTPClient({ 
		onerror: function(e){ 	
			Ti.API.debug(e.error); 	
			alert('There was an error during the connection'); 	
		}, 	
		timeout:1000, 
	});

	// Open request
	request1.open('POST', '52.32.54.34/php/read_contact_list.php');  
	var params = ({ "USER_ID": Alloy.Globals.thisUserID }); 
	request1.send(params);
	
	// Called on load of connection
	request1.onload = function() {
		var json = JSON.parse(this.responseText);
		var json = json.OTHER_USER_ID;
		
		for( var i = 0; i < json.length; i++)
		{
			// THIS MEANS HE IS MY CONTACT
			if (json[i].OTHER_USER_ID == Alloy.Globals.profileViewID )	
			{
				$.button1.title = '\u2713 Friends';
				$.button1.backgroundColor = '#07ce00';
				
				// DECLINE BUTTON
				$.button2.visible = 'false';
				statusFound = true;
				break;
			}
		}
	};	// End of onload function
	
	if (statusFound == false)
	{
		// SECOND CHECK --> CHECK TO SEE IF I ALREADY SENT A REQUEST TO THE PROFILE I AM VIEWING
		var request2 = Ti.Network.createHTTPClient({ 
			onerror: function(e){ 	
				Ti.API.debug(e.error); 	
				alert('There was an error during the connection'); 	
			}, 	
			timeout:1000, 
		});
	
		// Here you have to change it for your local ip 
		request2.open('POST', '52.32.54.34/php/read_pending_list.php');  
		var params = ({ "USER_ID": Alloy.Globals.profileViewID }); 
		request2.send(params);
		
		// Called on load of connection
		request2.onload = function() {
			var json = JSON.parse(this.responseText);
			var json = json.OTHER_USER_ID;
			
			for( var i = 0; i < json.length; i++)
			{
				if (json[i].OTHER_USER_ID == Alloy.Globals.thisUserID )	//THIS MEANS THE CLIENT ALREADY SENT A CONTACT REQUEST
				{
					Titanium.API.log("I am within if statement 1");
					$.button1.title = 'Pending';
					$.button1.backgroundColor = '#696969';
					
					// DECLINE BUTTON
					$.button2.visible = 'false';
					statusFound = true;
					break;
				}
			}
		};	// End of onload function
	}
	
	if (statusFound == false)
	{
		// THIRD CHECK --> CHECK TO SEE IF THE PROFILE I AM VIEWING SENT ME A REQUEST
		var request3 = Ti.Network.createHTTPClient({ 
			onerror: function(e){ 	
				Ti.API.debug(e.error); 	
				alert('There was an error during the connection'); 	
			}, 	
			timeout:1000, 
		});
	
		// Here you have to change it for your local ip 
		request3.open('POST', '52.32.54.34/php/read_pending_list.php');  
		var params = ({ "USER_ID": Alloy.Globals.thisUserID }); 
		request3.send(params);
		
		// Called on load of connection
		request3.onload = function() {
			var json = JSON.parse(this.responseText);
			var json = json.OTHER_USER_ID;
			
			for( var i = 0; i < json.length; i++)
			{
				// THIS MEANS THAT HE SENT US A REQUEST ALREADY
				if (json[i].OTHER_USER_ID == Alloy.Globals.profileViewID )	
				{
					Titanium.API.log("I am within if statement 2");
					$.button1.title = 'Accept';
					$.button1.backgroundColor = '#07ce00';
					
					// DECLINE BUTTON
					$.button2.visible = 'true';
					statusFound = true;
					break;
				}
			}
		};
	}
}

/**
 *	This is for providing click functionality to first button (Connect or Pending or Accept)
 * 
 * 	@param {Object} the button information
 */
function button1Click(e)
{
	if (e.source.title == 'Connect')
	{
		var request = Ti.Network.createHTTPClient({ 	
		onerror: function(e){ 
			Ti.API.debug(e.error); 
			alert('There was an error during the connection PROFILE VIEW'); 
		}, 
		timeout:1000, 	         
		});  
		
		// Request the data from the web service, Here you have to change it for your local ip 
	    request.open("POST","52.32.54.34/php/insert_into_pending.php"); 
		
		var params = ({ "USER_ID": 				Alloy.Globals.profileViewID,	
						"OTHER_USER_ID": 		Alloy.Globals.thisUserID,
						});
	
		request.send(params);
		
		// Set the button to Pending, I sent a request, now we are waiting for a response
		e.source.title = 'Pending';
		e.source.backgroundColor = '#696969';
	}
	else if (e.source.title == 'Accept')
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
		
		// Set the button to checkmark and get rid of decline button, we are now contacts
		e.source.title = '\u2713 Friends';
		e.source.backgroundColor = '#07ce00'; 
		$.button2.visible = 'false';
	}
}

/**
 *	This is for providing click functionality to DECLINE BUTTON
 * 
 * 	@param {Object} the button information
 */
function button2Click(e)
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
	
	// Decline button disappears once again
	e.source.visible = 'false';	
}

/**
 *	Use the androidback event to go back to Main Menu
 */
$.profileView.addEventListener('androidback' , function (e) {
	
	// Use the appropriate Navigate paramaters based on where we came from
	if (Alloy.Globals.comingFrom == 'connections')
	{
		Alloy.Globals.Navigate ($, $.profileView, Alloy.createController('connections').getView());	
	}
	else if (Alloy.Globals.comingFrom == 'matches')
	{;
		Alloy.Globals.Navigate ($, $.profileView, Alloy.createController('matches').getView());	
	}
	else if (Alloy.Globals.comingFrom == 'search')
	{
		Alloy.Globals.Navigate ($, $.profileView, Alloy.createController('search').getView());	
	}
	else if (Alloy.Globals.comingFrom == 'viewedMe')
	{
		Alloy.Globals.Navigate ($, $.profileView, Alloy.createController('viewedMe').getView());	
	}	
});

/**
 *	Home button function will take you to Main Menu
 */
var homeButtonFunc = function () {	;
	Alloy.Globals.goToHome ($, $.profileView);
};

/**
 *	This function is used to set checkboxes to true(checked)
 *  Marks the checkbox (for READ function)
 * 	@param {Object} the button(checkbox)
 */
function setCheckboxTrue(e)	
{
	e.value = true;
	e.backgroundColor = '#007690';
	e.title = '\u2713';
}

/**
 *	This function reads the 6 main information on About tab
 */
function readTextfieldData(){
	
	// function to use HTTP to connect to a web server and transfer the data. 
	var sendit = Ti.Network.createHTTPClient({ 
		onerror: function(e){ 	
			Ti.API.debug(e.error); 	
			alert('There was an error during the connection2222'); 	
		}, 	
		timeout:1000, 
	});

	// Here you have to change it for your local ip 
	sendit.open('GET', '52.32.54.34/php/read_user_list.php');  
	sendit.send();

	// Called on load of connection
	sendit.onload = function() {
		var json = JSON.parse(this.responseText);
		var json = json.NAME;

		// Find the profile we are viewing
		for( var i=0; i<json.length; i++) 
		{
			if ( json[i].USER_ID == Alloy.Globals.profileViewID) 
			{
				// Set the text fields based on the information gathered from the database
				$.nameField.value = json[i].NAME;
				$.educationText.value = json[i].EDUCATION;
				$.projectText.value = json[i].CURRENT_PROJ;
				$.expertiseText.value = json[i].AREA_EXPERTISE;
				$.committeeText.value = json[i].COMMITTEES;
				$.otherInterestText.value = json[i].OTHER_INTERESTS;
				$.contactInfoText.value = json[i].O_CONTACT_INFO;
				$.profilePicture.image = json[i].PHOTO;
				
				// Set the first question on questionnaire tab
				if (json[i].EXPAND == 1) { setCheckboxTrue($.question1yes); }
				else { setCheckboxTrue($.question1no); }
				
				// Set the second question on questionnaire tab
				if (json[i].FUNDING == 1) { setCheckboxTrue($.question2yes); }
				else { setCheckboxTrue($.question2no); }	
			}	
		}
	};
}

/**
 *	This function reads/populates Agency information for profile
 */
function readAgencyData(){
	// Function to use HTTP to connect to a web server and transfer the data. 
	var sendit = Ti.Network.createHTTPClient({ 
		onerror: function(e){ 	
			Ti.API.debug(e.error); 	
			alert('There was an error during the connection555'); 	
		}, 	
		timeout:1000, 
	});

	// Here you have to change it for your local ip 
	sendit.open('GET', '52.32.54.34/php/read_agency_list.php');  
	sendit.send();

	// Sent on load of connection
	sendit.onload = function() {
		var json = JSON.parse(this.responseText);
		var json = json.USER_ID;

		for( var i=0; i<json.length; i++) 
		{
			if ( json[i].USER_ID == Alloy.Globals.profileViewID) 
			{		
				// Find the user and populate checkboxes accordingly		
				if (json[i].TAMU == 1) { setCheckboxTrue($.tamuCheckbox); }		
				if (json[i].PVAMU == 1) { setCheckboxTrue($.prairieCheckbox); }
				if (json[i].TSU == 1) { setCheckboxTrue($.tarletonCheckbox); }		
				if (json[i].TAMUCC == 1) { setCheckboxTrue($.tamuccCheckbox); }
				if (json[i].TAMUK == 1) { setCheckboxTrue($.tamukCheckbox); }		
				if (json[i].WTAMU == 1) { setCheckboxTrue($.westamCheckbox); }
				if (json[i].TAMUC == 1) { setCheckboxTrue($.tamucCheckbox); }		
				if (json[i].TAMUT == 1) { setCheckboxTrue($.tamutCheckbox); }
				if (json[i].TAMUCT == 1) { setCheckboxTrue($.tamuctCheckbox); }		
				if (json[i].TAMUSA == 1) { setCheckboxTrue($.tamusaCheckbox); }
				if (json[i].TAMHSC == 1) { setCheckboxTrue($.tamhscCheckbox); }		
				if (json[i].TAMAR == 1) { setCheckboxTrue($.tamarCheckbox); }
				if (json[i].TAMEEPS == 1) { setCheckboxTrue($.tameesCheckbox); }		
				if (json[i].TAMAEXS == 1) { setCheckboxTrue($.tamaesCheckbox); }
				if (json[i].TAMFS == 1) { setCheckboxTrue($.tamfsCheckbox); }		
				if (json[i].TAMTI == 1) { setCheckboxTrue($.tamtiCheckbox); }
				if (json[i].TAMVMDL == 1) { setCheckboxTrue($.tamvmdlCheckbox); }					
			}	
		}
	};
}

/**
 *	This function reads/populates Areas of Research information for profile
 */
function readResearchData(){
	// Function to use HTTP to connect to a web server and transfer the data. 
	var sendit = Ti.Network.createHTTPClient({ 
		onerror: function(e){ 	
			Ti.API.debug(e.error); 	
			alert('There was an error during the connection555'); 	
		}, 	
		timeout:1000, 
	});

	// Here you have to change it for your local ip 
	sendit.open('GET', '52.32.54.34/php/read_area_of_research.php');  
	sendit.send();

	// Called on load of connection
	sendit.onload = function() {
		var json = JSON.parse(this.responseText);
		var json = json.USER_ID;

		for( var i=0; i<json.length; i++) 
		{
			if ( json[i].USER_ID == Alloy.Globals.profileViewID) 
			{		
				// Find the user and set the checkboxes accordingly		
				if (json[i].FOOD_SAFETY == 1) { setCheckboxTrue($.foodSafetyCheckbox); }
				if (json[i].NUTRITION == 1) { setCheckboxTrue($.nutritionCheckbox); }	
				if (json[i].PUBLIC_HEALTH == 1) { setCheckboxTrue($.publicHealthCheckbox); }	
				if (json[i].PRODUCTION_ECON == 1) { setCheckboxTrue($.productionEconCheckbox); }	
				if (json[i].TRADE == 1) { setCheckboxTrue($.tradeCheckbox); }	
				if (json[i].PUBLIC_POLICY == 1) { setCheckboxTrue($.publicPolicyCheckbox); }	
				if (json[i].ANIMAL_HEALTH == 1) { setCheckboxTrue($.animalHealthCheckbox); }	
				if (json[i].FISH == 1) { setCheckboxTrue($.fishCheckbox); }	
				if (json[i].BIO_ENERGY == 1) { setCheckboxTrue($.bioenergyCheckbox); }	
				if (json[i].WILDLIFE == 1) { setCheckboxTrue($.wildlifeCheckbox); }								
			}	
		}
	};
}

/*
 * Initialize view
 */
popArrays ();				// Populate arrays
$.profileView.open();		// OPEN PROFILE VIEW WINDOW
setConnectButtonStatus();	// SET THE FIRST BUTTON
readTextfieldData();		// GET 6 MAIN INFORMATION ON ABOUT TAB
readAgencyData();			// GET AGENCY INFORMATION ON QUESTIONNAIRE TAB
readResearchData();			// GET AREAS OF RESEARCH INFORMATION ON QUESTIONNAIRE TAB