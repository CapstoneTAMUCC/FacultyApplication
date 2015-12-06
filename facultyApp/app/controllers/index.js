/*
 * Controller for Login page
 * Purpose: Provide functionality for Login page of app
 */

// Open client's profile
function openProfile()
{
	// Check to make sure the user does not enter an empty string
	if ($.userIDText.value == '' || $.userIDText.value == ' ')
	{
		alert('Please enter a User ID');
	}
	else
	{
		// Function to use HTTP to connect to a web server and transfer the data. 
		var request = Ti.Network.createHTTPClient({ 
			onerror: function(e){ 	
				Ti.API.debug(e.error); 	
				alert('There was an error during the connection'); 	
			},
			timeout:1000, 
		});
		
		request.open('GET', '52.32.54.34/php/read_user_list.php');  
		request.send();
		
		// Called on load of connection
		request.onload = function() {
			var json = JSON.parse(this.responseText);
			var json = json.NAME;
			var found = false;
			
			// Find our user based on input
			for( var i=0; i<json.length; i++) 
			{
				if (json[i].USER_ID === $.userIDText.value)
				{
					// Store photo url into global variable (to be used in Messages section)
					Alloy.Globals.thisUserPhoto = json[i].PHOTO;
					
					// This is the userID that will be used throughout the program	
					Alloy.Globals.thisUserID = json[i].USER_ID;	
					
					// Open main menu
					Alloy.Globals.MMNavigate ($, $.index, Alloy.createController('mainMenu').getView());
					found = true;
					break;
				}
			}
			
			if(!found)
			{
				alert("User Not found!");
			}
		};
	}
};

// Open Login page
$.index.open();
