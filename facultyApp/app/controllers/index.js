//Reads the name of the client from database
function readName(){
	//function to use HTTP to connect to a web server and transfer the data. 
	var sendit = Ti.Network.createHTTPClient({ 
	onerror: function(e){ 	
		Ti.API.debug(e.error); 	
		alert('There was an error during the connection Main Menu'); 	
	}, 	
	timeout:1000, 
	});

	//Here you have to change it for your local ip 
	sendit.open('GET', '52.32.54.34/php/read_user_list.php');  
	sendit.send();

	sendit.onload = function() {
		var json = JSON.parse(this.responseText);
		var json = json.NAME;

		for( var i=0; i<json.length; i++) 
		{
			if ( json[i].USER_ID == Alloy.Globals.thisUserID) //READING JUSTIN GUERRA
			{
				$.profileBar.title = json[i].NAME;			
			}	
		}
	};
}

// Here your window's event listener for android back button
$.index.addEventListener('androidback' , function(e){
    Titanium.API.log("Can't go back on Main Menu");
});

$.profileButton.addEventListener('click', function(e)
{
	Alloy.Globals.MMNavigate ($, $.index, Alloy.createController('profile').getView());
});

$.messagesButton.addEventListener('click', function(e)
{
	Alloy.Globals.MMNavigate ($, $.index, Alloy.createController('messages').getView());
});

$.searchButton.addEventListener('click', function(e)
{
	Alloy.Globals.MMNavigate ($, $.index, Alloy.createController('search').getView());
});

$.matchesButton.addEventListener('click', function(e)
{
	Alloy.Globals.MMNavigate ($, $.index, Alloy.createController('matches').getView());
});

$.connectionsButton.addEventListener('click', function(e)
{
	Alloy.Globals.MMNavigate ($, $.index, Alloy.createController('connections').getView());
});

$.viewedMeButton.addEventListener('click', function(e)
{
	Alloy.Globals.MMNavigate ($, $.index, Alloy.createController('viewedMe').getView());
});

$.profileBar.addEventListener('click', function(e)
{
	Alloy.Globals.MMNavigate ($, $.index, Alloy.createController('profile').getView());
});

$.index.open();
readName();
