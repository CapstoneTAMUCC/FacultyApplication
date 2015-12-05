/**
 *  This function searches the database to find the userID and then opens the profile
 */
function openProfile(){
	
	//function to use HTTP to connect to a web server and transfer the data. 
	var SSO = Ti.Network.createHTTPClient({ 
	onerror: function(e){ 	
		Ti.API.debug(e.error); 	
		alert('There was an error during the connection'); 	
	},
	timeout:1000, 
	});
	
	SSO.open('GET', '52.32.54.34/php/read_user_list.php');  
	SSO.send();
	
	SSO.onload = function() {
		var json = JSON.parse(this.responseText);
		var json = json.NAME;
		var found = false;
		
		//Find our user based on input
		for( var i=0; i<json.length; i++) 
		{
			if (json[i].USER_ID === $.userIDText.value)
			{
				Alloy.Globals.thisUserID = json[i].USER_ID;	//this is the userID that will be used throughout the program
				Alloy.Globals.MMNavigate ($, $.index, Alloy.createController('mainMenu').getView());	//open main menu
				found = true;
				break;
			}
		}
		
		if(!found)
		{
			alert("User Not found!");
		}
	};
};
$.index.open();	//open the Login screen