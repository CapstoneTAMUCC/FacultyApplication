var data = [];
var namesJson = [];
var dataArray = arguments[0] || {};// Any passed in arguments will fall into this property

function init(){
	//function to use HTTP to connect to a web server and transfer the data.
	var connection = Ti.Network.createHTTPClient({ 
	  	onerror: function(e){ 
			Ti.API.debug(e.error); 
			alert('There was an error during the connection'); 
	    },
	    timeout:1000,
	});                      
	
	//Here you have to change it for your local ip 
	connection.open('POST', '52.32.54.34/php/read_contact_list.php');
	var params = ({ "USER_ID": '1' });  
	connection.send(params);
	//Function to be called upon a successful response 
	connection.onload = function(){ 
	    var json = JSON.parse(this.responseText); 
	    var json = json.OTHER_USER_ID;
	    //if the database is empty show an alert 
	    if(json.length == 0){
			Titanium.API.log("CRAP");
	    }
	    
	    //function to use HTTP to connect to a web server and transfer the data. 
		var conn = Ti.Network.createHTTPClient({ 
			onerror: function(e){ 	
					Ti.API.debug(e.error); 	
					alert('There was an error during the connection'); 
			
				}, 	
			timeout:1000, 
		});
		
		//Here you have to change it for your local ip 
		conn.open('GET', '52.32.54.34/php/read_user_list.php');  
		conn.send();
		
		conn.onload = function() {
			namesJson = JSON.parse(this.responseText);
			namesJson = namesJson.NAME;
		  	    
		  	var row = Ti.UI.createPickerRow({title: "Select", id: "select"});
		  	data.push (row);
		  	                  
			//Insert the JSON data to the table view 
			for( var i=0; i<json.length; i++){ 
		      	
		      	Titanium.API.log("OTHER_USER_ID: " + json[i].OTHER_USER_ID);          
				
				var row = Ti.UI.createPickerRow({title: getOtherName(namesJson, json[i].OTHER_USER_ID), id: json[i].OTHER_USER_ID});
				row.add(Titanium.UI.createLabel({
				    left: 0,
				    text: row.title,
				    color: 'black',
				    font: {
				        fontFamily:'Arial',
				        fontSize: '14dp',
				        fontStyle: 'normal',
				        fontWeight: 'normal'
				    }
				}));
				data.push(row);
			              
			}
		
			$.picker.add(data);
			$.picker.setSelectedRow(0, 0, false);
			
			// Called when a name is selected
			$.picker.addEventListener('change',function(e){
		   		Titanium.API.log('change: '+ $.picker.getSelectedRow(0).title);
			});
			//	$.column1.add(data);
		};
	};
};

function onSelectButton (e) {
	var newWindow = Alloy.createController('conversation', JSON.parse(makeJsonConversationString(dataArray, exists(dataArray, $.picker.getSelectedRow(0).id), $.picker.getSelectedRow(0).id))).getView();
	newWindow.open ();
}

var exists = function(array, otherUserID) {
   	for (var i = 0; i < array.length; i++) {
   		Titanium.API.log("ID: " + array[i][0].TO_ID + " " + array[i][0].FROM_ID);
   		if (array[i][0].TO_ID === otherUserID ||
   			array[i][0].FROM_ID === otherUserID) {
   			return i;	
   		}
   	}
   	
  	return -1;
}; 

var homeButtonFunc = function () {
	Alloy.Globals.goToHome ($, $.conversation);
};
		
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
		
var getOtherName = function (array, otherID) {
	for(var i=0; i<array.length; i++) {
		if ( array[i].USER_ID == otherID)
		{
			return array[i].NAME;
		}
	}
	return "Not found";
};

var homeButtonFunc = function () {
	Alloy.Globals.goToHome ($, $.newMessage);
};

$.newMessage.addEventListener('androidback' , function (e) {
	Alloy.Globals.Navigate ($, $.newMessage, Alloy.createController('messages').getView());
});

/*
var c = Titanium.Network.createHTTPClient();
    c.onload = function()
        {
            var xml=this.responseXML.documentElement;
            doc=xml.getElementsByTagName("PLANT");
            for(var a=0;a<doc.length;a++)
            {
                data.push(Ti.UI.createPickerRow({title:doc.item(a).getElementsByTagName("COMMON").item(0).text}));
            }
            $.picker.add(data);
        };
    c.onerror = function(e)
        {
            Ti.API.info('XHR Error ' + e.error);
        };
    c.open('GET', 'http://www.w3schools.com/xml/plant_catalog.xml');
    c.send();
    */
init ();
$.newMessage.open();