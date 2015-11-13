var args = arguments[0] || {};
var thisUserID = 1;

/**
 * Function to inialize the View, gathers data from the flat file and sets up the ListView
 */
function init(){
    	//Emptying the data to refresh the view 
		var json = args;                  

    	//Insert the JSON data to the table view 

   		for( var i=0; i<json.length; i++){ 
        	var row = Ti.UI.createTableViewRow({ 
        		title: json[i].BODY, 
            	hasChild : true, 
     		});
        
        	Titanium.API.log("OTHER_ID: " + json[i].OTHER_ID);                                        
     		Titanium.API.log("TO: " + json[i].TO_ID);
     		Titanium.API.log("FROM: " + json[i].FROM_ID);
     		Titanium.API.log("BODY: " + json[i].BODY);   
     		Titanium.API.log("DATE: " + json[i].DATE);   
     		Titanium.API.log("STATUS: " + json[i].STATUS);       
     		Titanium.API.log();                     
		};  
		
		conversations = json;
		
		/**
	 	* IF the users array exists
	 	*/
		if(conversations) {
		
			/**
		 	* Setup our Indexes and Sections Array for building out the ListView components
		 	* 
		 	*/
			indexes = [];
			var sections = [];
			var conversationGroups  = _.groupBy(conversations, function(item){
		 		return item.DATE;
			});
        
        	/**
         	* Iterate through each group created, and prepare the data for the ListView
         	* (Leverages the UnderscoreJS _.each function)
         	*/
			_.each(conversationGroups, function(group){

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
					title: "what is this"
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
 * This function handles the click events for the rows in the ListView.
 * We want to capture the user property associated with the row, and pass
 * it into the profile View
 * 
 * @param {Object} Event data passed to the function
 */
function onItemClick(e){
	
}	
		
/**
 *	Convert an array of data from a JSON file into a format that can be added to the ListView
 * 
 * 	@param {Object} Raw data elements from the JSON file.
 */
var preprocessForListView = function(rawData) {
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
				searchableText: "",
				user: item,
				editActions: [
					{title: "Does this even matter", color: item.isNew ? "#C41230" : "#038BC8" }
				],
				canEdit:true
			},
			userName: {text: item.FROM_ID == thisUserID ? "Me" : item.OTHER_NAME},
			userEmail: {text: ""},
			messageBody: {text: item.BODY},
			lastUpdated: {text: item.DATE}
		};
	});	
};

$.replyButton.addEventListener('click', function(e)
{
	var request = Ti.Network.createHTTPClient({  
    	onerror: function(e){ 
        	Ti.API.debug(e.error); 
    		alert('There was an error during the connection'); 
    	}, 
       		timeout:1000, 
    	}); 
    	 
    //	Titanium.API.log("Am I getting this correctly? " + messageBox.value);
		//Request the data from the web service, Here you have to change it for your local ip 
        request.open("POST","52.32.54.34/php/insert_into_message.php");
        var newMessage = ({"FROM_ID": Alloy.Globals.thisUserID,
          	               "TO_ID":  args[0].OTHER_ID, 
             	           "DATE": makeDate (new Date()), 
                           "BODY": $.messageText.value, 
                   	       "STATUS": 1, 
      	});
      	args.push(newMessage);
        request.send(newMessage);
       	$.messageText.value = '';
        init(); 
}); 

$.conversation.addEventListener('androidback' , function (e) {
	Alloy.Globals.Navigate ($, $.conversation, Alloy.createController('messages').getView());
});

var homeButtonFunc = function () {
	Alloy.Globals.goToHome ($, $.conversation);
};

var makeDate = function (date) {
	var day = date.getDate();
	var hour = date.getHours();
	var min = date.getMinutes();
	var sec = date.getSeconds();
	var result = "";
	
	result += date.getFullYear() + "-";
	result += date.getMonth() + "-";
	result += (day < 10 ? ("0" + day) : day) + " ";
	result += (hour < 10 ? ("0" + hour) : hour) + ":";
	result += (min < 10 ? ("0" + min) : min) + ":";
	result += (sec < 10 ? ("0" + sec) : sec);
	
	Titanium.API.log("Current time: " + result);
	return result;
};
		
/**
 * Listen for the refresh event, and re-initialize
 */
Ti.App.addEventListener("refresh-data", function(e){
	init();
});

var onDelete = function onDelete(e){
};

var onCompose = function onCompose(e){
};

/**
 * Initialize View
 */
init();
		              