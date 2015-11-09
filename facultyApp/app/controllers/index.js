$.profileButton.addEventListener('click', function(e)
{
	var newWindow = Alloy.createController('test').getView();
	newWindow.open();
	$.index.close();
});

$.messagesButton.addEventListener('click', function(e)
{
	var newWindow = Alloy.createController('messages').getView();
	newWindow.open();
	$.index.close();
});

$.searchButton.addEventListener('click', function(e)
{
	var newWindow = Alloy.createController('search').getView();
	newWindow.open();
	$.index.close();
});

$.matchesButton.addEventListener('click', function(e)
{
	var newWindow = Alloy.createController('matches').getView();
	newWindow.open();
	$.index.close();
});

$.connectionsButton.addEventListener('click', function(e)
{
	var newWindow = Alloy.createController('connections').getView();
	newWindow.open();
	$.index.close();
});

$.viewedMeButton.addEventListener('click', function(e)
{
	var newWindow = Alloy.createController('viewedMe').getView();
	newWindow.open();
	$.index.close();
});

$.profileBar.addEventListener('click', function(e)
{
	var newWindow = Alloy.createController('profile').getView();
	newWindow.open();
	$.index.close();
});

$.index.open();