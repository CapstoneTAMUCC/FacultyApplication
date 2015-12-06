/*
 * Controller for Main Menu
 * Purpose: Provide functionality for the client's Main Menu, which allows
 * 			the client to navigate to any section
 */

// Reads the name of the client from database
function readName() {
	
	// Function to use HTTP to connect to a web server and transfer the data. 
	var sendit = Ti.Network.createHTTPClient({ 
		onerror: function(e){ 	
			Ti.API.debug(e.error); 	
			alert('There was an error during the connection Main Menu'); 	
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

		for( var i=0; i<json.length; i++) 
		{
			if ( json[i].USER_ID == Alloy.Globals.thisUserID) //READING JUSTIN GUERRA
			{
				$.profileBar.title = json[i].NAME;		
				$.profilePicture.image = json[i].PHOTO;	
			}	
		}
	};
}

// Called when logout button is pressed, navigates to login page
function logoutFunction()
{
	Alloy.Globals.MMNavigate ($, $.mainMenu, Alloy.createController('index').getView());
}

// Here your window's event listener for android back button
$.mainMenu.addEventListener('androidback' , function(e){
    Titanium.API.log("Can't go back on Main Menu");
});

/*
 * Called when Profile button is pressed
 * Navigates to client's Profile section
 */
$.profileButton.addEventListener('click', function(e)
{
	Alloy.Globals.MMNavigate ($, $.mainMenu, Alloy.createController('profile').getView());
});

/*
 * Called when Messages button is pressed
 * Navigates to client's Inbox
 */
$.messagesButton.addEventListener('click', function(e)
{
	Alloy.Globals.MMNavigate ($, $.mainMenu, Alloy.createController('messages').getView());
});

/*
 * Called when Search button is pressed
 * Navigates to Search section
 */
$.searchButton.addEventListener('click', function(e)
{
	Alloy.Globals.MMNavigate ($, $.mainMenu, Alloy.createController('search').getView());
});

/*
 * Called when Matches button is pressed
 * Navigates to client's Matches section
 */
$.matchesButton.addEventListener('click', function(e)
{
	Alloy.Globals.MMNavigate ($, $.mainMenu, Alloy.createController('matches').getView());
});

/*
 * Called when Connection button is pressed
 * Navigates to list of client's established contacts in Connections section
 */
$.connectionsButton.addEventListener('click', function(e)
{
	Alloy.Globals.MMNavigate ($, $.mainMenu, Alloy.createController('connections').getView());
});

/*
 * Called when Viewed Me button is pressed
 * Navigates to list of users who have viewed the client's profile
 */
$.viewedMeButton.addEventListener('click', function(e)
{
	Alloy.Globals.MMNavigate ($, $.mainMenu, Alloy.createController('viewedMe').getView());
});

/*
 * Called when the Proile Bar button is pressed
 * Navigates to client's Profile section
 */
$.profileBar.addEventListener('click', function(e)
{
	Alloy.Globals.MMNavigate ($, $.mainMenu, Alloy.createController('profile').getView());
});

/*
 * Called when Profile button is pressed
 * Navigates to client's Profile section
 */
$.profilePicture.addEventListener('click', function(e)
{
	Alloy.Globals.MMNavigate ($, $.mainMenu, Alloy.createController('profile').getView());
});

/*
 * Called when Credits button is pressed
 * Navigates to Credits page
 */
$.creditsButton.addEventListener('click', function(e)
{
	Alloy.Globals.MMNavigate ($, $.mainMenu, Alloy.createController('credits').getView());
});

// Open Main Menu view
$.mainMenu.open();

// Read client name
readName();
