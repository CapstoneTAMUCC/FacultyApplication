$.profileButton.addEventListener('click', function(e)
{
	var newWindow = Alloy.createController('profile').getView();
	newWindow.open();
});

$.messagesButton.addEventListener('click', function(e)
{
	var newWindow = Alloy.createController('messages').getView();
	newWindow.open();
});

$.searchButton.addEventListener('click', function(e)
{
	var newWindow = Alloy.createController('search').getView();
	newWindow.open();
});

$.matchesButton.addEventListener('click', function(e)
{
	var newWindow = Alloy.createController('matches').getView();
	newWindow.open();
});

$.connectionsButton.addEventListener('click', function(e)
{
	var newWindow = Alloy.createController('connections').getView();
	newWindow.open();
});

$.viewedMeButton.addEventListener('click', function(e)
{
	var newWindow = Alloy.createController('viewedMe').getView();
	newWindow.open();
});

$.profileBar.addEventListener('click', function(e)
{
	var newWindow = Alloy.createController('profile').getView();
	newWindow.open();
});

$.index.open();