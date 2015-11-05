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

/** 
 * Function to inialize the View, gathers data from the flat file and sets up the ListView
 */
function init(){
	
	/**
	 * Access the FileSystem Object to read in the information from a flat file (lib/userData/messageData.js)
	 * DOCS: http://docs.appcelerator.com/platform/latest/#!/api/Titanium.Filesystem
	 */
	var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + "userData/messageData.json"); 
	
	/**
	 * Populate the users variable from the file this call returns an array
	 */
	users = JSON.parse(file.read().text).conversations;
	
	/**
	 * Sorts the `conversations` array by the lastName property of the user (leverages UnderscoreJS _.sortBy function)
	 */
	users = _.sortBy(users, function(user){
		return user.lastUpdated;
	});
	
	users = users.reverse();
	
	/**
	 * IF the users array exists
	 */
	if(users) {
		
		/**
		 * Setup our Indexes and Sections Array for building out the ListView components
		 * 
		 */
		indexes = [];
		var sections = [];
		var userGroups  = _.groupBy(users, function(item){
		 	return item.lastUpdated;
		});
        
        /**
         * Iterate through each group created, and prepare the data for the ListView
         * (Leverages the UnderscoreJS _.each function)
         */
		_.each(userGroups, function(group){

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
				title: group[0].lastName.charAt(0)
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
				searchableText: item.firstName + ' ' + item.lastName,
				user: item,
				editActions: [
					{title: "Does this even matter", color: item.isNew ? "#C41230" : "#038BC8" }
				],
				canEdit:true
			},
			userName: {text: item.firstName+" "+item.lastName},
			userCompany: {text: item.firstName},
			userPhoto: {image: item.photo},
			userEmail: {text: item.firstName},
			messageBody: {text: item.message},
			lastUpdated: {text: item.lastUpdated}
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
//	Alloy.Globals.Navigator.open("profile", item.properties.user);
	var newWindow = Alloy.createController('conversation').getView();
	newWindow.open();
}

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

