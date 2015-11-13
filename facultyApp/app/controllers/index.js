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