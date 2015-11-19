
/**
 * Function to inialize the View, gathers data from the flat file and sets up the ListView
 */
function openSSO(){
	
	var SSO = Titanium.Network.createHTTPClient();
		    url = "https://sso-test.tamus.edu/logon.aspx";
		    
	Titanium.Platform.openURL(url);
	
	
	 
	//var obj = JSON.stringify(user);
        
		   SSO.onload = function() {
		        //Titanium.API.info('Status: ' + this.status);
		        /*var json = JSON.parse(this.responseText);
		        Titanium.API.info('json object '+jsonObject);
		        
		        Titanium.API.log("string is: ", this.responseText);
		        
		        Alloy.Globals.MMNavigate ($, $.index, Alloy.createController('profile').getView());
		        //fire an app-level event to notify the UI that the JSON data is available
		        Ti.App.fireEvent(url, jsonObject);*/
		       
		       Ti.API.info("Received text: " + this.responseText);
         		alert('success');
		    };
		    
		    SSO.onerror = function(e) {
		        // should do something more robust
		        Titanium.API.info('userLogin error: '+e.error);
		    };
		
			SSO.open('POST',url);
			SSO.send();
 }
 


         