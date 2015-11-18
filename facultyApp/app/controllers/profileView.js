var _args = arguments[0] || {};

function checkboxFunction(e)
{
	if(false == e.source.value) {
        e.source.value = true;
        e.source.backgroundColor = '#007690';
        e.source.title = '\u2713';
    } else{
        e.source.value = false;
        e.source.backgroundColor = '#aaa';
        e.source.title = '';
    }
}

function setConnectButtonStatus()
{
	var statusFound = false;	//if set to true, means that we know the button's status
	
	//FIRST CHECK --> CHECK TO SEE IF THE PROFILE I AM VIEWING IS ALREADY A CONTACT OF MINE
	var request1 = Ti.Network.createHTTPClient({ 
	onerror: function(e){ 	
		Ti.API.debug(e.error); 	
		alert('There was an error during the connection PENDING'); 	
	}, 	
	timeout:1000, 
	});

	//Here you have to change it for your local ip 
	request1.open('POST', '52.32.54.34/php/read_contact_list.php');  
	var params = ({ "USER_ID": Alloy.Globals.thisUserID }); 
	request1.send(params);
	request1.onload = function() {
		var json = JSON.parse(this.responseText);
		var json = json.OTHER_USER_ID;
		
		for( var i = 0; i < json.length; i++)
		{
			if (json[i].OTHER_USER_ID == Alloy.Globals.profileViewID )	//THIS MEANS HE IS MY CONTACT
			{
				Titanium.API.log("I am within if statement 1");
				$.button1.title = '\u2713 Friends';
				$.button1.backgroundColor = '#07ce00';
				$.button2.visible = 'false';	//DECLINE BUTTON
				statusFound = true;
				break;
			}
		}
	};	//end of onload function
	
	if (statusFound == false)
	{
		Titanium.API.log("2nd status check");
		//SECOND CHECK --> CHECK TO SEE IF I ALREADY SENT A REQUEST TO THE PROFILE I AM VIEWING
		var request2 = Ti.Network.createHTTPClient({ 
		onerror: function(e){ 	
			Ti.API.debug(e.error); 	
			alert('There was an error during the connection PENDING'); 	
		}, 	
		timeout:1000, 
		});
	
		//Here you have to change it for your local ip 
		request2.open('POST', '52.32.54.34/php/read_pending_list.php');  
		var params = ({ "USER_ID": Alloy.Globals.profileViewID }); 
		request2.send(params);
		request2.onload = function() {
			var json = JSON.parse(this.responseText);
			var json = json.OTHER_USER_ID;
			
			for( var i = 0; i < json.length; i++)
			{
				if (json[i].OTHER_USER_ID == Alloy.Globals.thisUserID )	//THIS MEANS THE CLIENT ALREADY SENT A CONTACT REQUEST
				{
					Titanium.API.log("I am within if statement 1");
					$.button1.title = 'Pending';
					$.button1.backgroundColor = '#696969';
					$.button2.visible = 'false';	//DECLINE BUTTON
					statusFound = true;
					break;
				}
			}
		};	//end of onload function
	}
	
	if (statusFound == false)
	{
		Titanium.API.log("3rd status check");
		//THIRD CHECK --> CHECK TO SEE IF THE PROFILE I AM VIEWING SENT ME A REQUEST
		var request3 = Ti.Network.createHTTPClient({ 
		onerror: function(e){ 	
			Ti.API.debug(e.error); 	
			alert('There was an error during the connection PENDING'); 	
		}, 	
		timeout:1000, 
		});
	
		//Here you have to change it for your local ip 
		request3.open('POST', '52.32.54.34/php/read_pending_list.php');  
		var params = ({ "USER_ID": Alloy.Globals.thisUserID }); 
		request3.send(params);
		request3.onload = function() {
			var json = JSON.parse(this.responseText);
			var json = json.OTHER_USER_ID;
			
			for( var i = 0; i < json.length; i++)
			{
				if (json[i].OTHER_USER_ID == Alloy.Globals.profileViewID )	//THIS MEANS THAT HE SENT US A REQUEST ALREADY
				{
					Titanium.API.log("I am within if statement 2");
					$.button1.title = 'Accept';
					$.button1.backgroundColor = '#07ce00';
					$.button2.visible = 'true';	//DECLINE BUTTON
					statusFound = true;
					break;
				}
			}
		};
	}
}

function button1Click(e)
{
	if (e.source.title == 'Connect')
	{
		var request = Ti.Network.createHTTPClient({ 	
		onerror: function(e){ 
			Ti.API.debug(e.error); 
			alert('There was an error during the connection PROFILE VIEW'); 
		}, 
		timeout:1000, 	         
		});  
		//Request the data from the web service, Here you have to change it for your local ip 
	    request.open("POST","52.32.54.34/php/insert_into_pending.php"); 
		
		var params = ({ "USER_ID": 				Alloy.Globals.profileViewID,	
						"OTHER_USER_ID": 		Alloy.Globals.thisUserID,
						});
	
		request.send(params);
		
		//Set the button to Pending, I sent a request, now we are waiting for a response
		e.source.title = 'Pending';
		e.source.backgroundColor = '#696969';
	}
	else if (e.source.title == 'Accept')
	{
		//Add this profile to my contacts 
		var request1 = Ti.Network.createHTTPClient({ 	
		onerror: function(e){ 
			Ti.API.debug(e.error); 
			alert('There was an error during the connection PROFILE VIEW'); 
		}, 
		timeout:1000, 	         
		});  
		//Request the data from the web service, Here you have to change it for your local ip 
	    request1.open("POST","52.32.54.34/php/insert_into_contact.php"); 
		
		var params = ({ "USER_ID": 				Alloy.Globals.thisUserID,	
						"OTHER_USER_ID": 		Alloy.Globals.profileViewID,
						});
	
		request1.send(params);
		
		
		//Add myself to this profile's contacts list
		var request2 = Ti.Network.createHTTPClient({ 	
		onerror: function(e){ 
			Ti.API.debug(e.error); 
			alert('There was an error during the connection PROFILE VIEW'); 
		}, 
		timeout:1000, 	         
		});  
		//Request the data from the web service, Here you have to change it for your local ip 
	    request2.open("POST","52.32.54.34/php/insert_into_contact.php"); 
		
		var params = ({ "USER_ID": 				Alloy.Globals.profileViewID,	
						"OTHER_USER_ID": 		Alloy.Globals.thisUserID,
						});
	
		request2.send(params);
		
		
		//Delete him from my pending list
		var request3 = Ti.Network.createHTTPClient({ 	
		onerror: function(e){ 
			Ti.API.debug(e.error); 
			alert('There was an error during the connection PROFILE VIEW'); 
		}, 
		timeout:1000, 	         
		});  
		//Request the data from the web service, Here you have to change it for your local ip 
	    request3.open("POST","52.32.54.34/php/delete_pending.php"); 
		
		var params = ({ "USER_ID": 				Alloy.Globals.thisUserID,	
						"OTHER_USER_ID": 		Alloy.Globals.profileViewID,
						});
	
		request3.send(params);
		
		//Set the button to checkmark and get rid of decline button, we are now contacts
		e.source.title = '\u2713';
		e.source.backgroundColor = '#07ce00'; 
		$.button2.visible = 'false';
	}
}

//Decline the request
function button2Click(e)
{
	//Delete him from my pending
	var request = Ti.Network.createHTTPClient({ 	
	onerror: function(e){ 
		Ti.API.debug(e.error); 
		alert('There was an error during the connection PROFILE VIEW'); 
	}, 
	timeout:1000, 	         
	});  
	//Request the data from the web service, Here you have to change it for your local ip 
    request.open("POST","52.32.54.34/php/delete_pending.php"); 
	
	var params = ({ "USER_ID": 				Alloy.Globals.thisUserID,	
					"OTHER_USER_ID": 		Alloy.Globals.profileViewID,
					});

	request.send(params);
	
	e.source.visible = 'false';	//Decline button disappears once again
}

$.profileView.addEventListener('androidback' , function (e) {
	Titanium.API.log("I AM USING ANDROID BACK IN PROFILEVIEW!");
	if (Alloy.Globals.comingFrom == 'connections')
	{
		Titanium.API.log("COMING FROM CONNECTIONS!");
		Alloy.Globals.Navigate ($, $.profileView, Alloy.createController('connections').getView());	
	}
	else if (Alloy.Globals.comingFrom == 'matches')
	{
		Titanium.API.log("COMING FROM MATCHES!");
		Alloy.Globals.Navigate ($, $.profileView, Alloy.createController('matches').getView());	
	}
	else if (Alloy.Globals.comingFrom == 'search')
	{
		Titanium.API.log("COMING FROM SEARCH!");
		Alloy.Globals.Navigate ($, $.profileView, Alloy.createController('search').getView());	
	}
	else if (Alloy.Globals.comingFrom == 'viewedMe')
	{
		Titanium.API.log("COMING FROM VIEWED ME!");
		Alloy.Globals.Navigate ($, $.profileView, Alloy.createController('viewedMe').getView());	
	}
	
	//$.profileView.close();	//might be a better option for speed?
});

var homeButtonFunc = function () {	//might be problematic 
	Titanium.API.log("I AM USING HOME IN PROFILEVIEW!");
	Alloy.Globals.goToHome ($, $.profileView);
};

function setCheckboxTrue(e)	//marks the checkbox (for READ function)
{
	e.value = true;
	e.backgroundColor = '#007690';
	e.title = '\u2713';
}

function readTextfieldData(){
	//function to use HTTP to connect to a web server and transfer the data. 
	var sendit = Ti.Network.createHTTPClient({ 
	onerror: function(e){ 	
		Ti.API.debug(e.error); 	
		alert('There was an error during the connection2222'); 	
	}, 	
	timeout:1000, 
	});

	//Here you have to change it for your local ip 
	sendit.open('GET', '52.32.54.34/php/read_user_list.php');  
	sendit.send();

	sendit.onload = function() {
		Ti.API.log('I am here!!!');
		var json = JSON.parse(this.responseText);
		var json = json.NAME;

		for( var i=0; i<json.length; i++) 
		{
			if ( json[i].USER_ID == Alloy.Globals.profileViewID) //used to be 1234 only without quotations READING JUSTIN GUERRA
			{
				$.nameField.value = json[i].NAME;
				$.educationText.value = json[i].EDUCATION;
				$.projectText.value = json[i].CURRENT_PROJ;
				$.expertiseText.value = json[i].AREA_EXPERTISE;
				$.committeeText.value = json[i].COMMITTEES;
				$.otherInterestText.value = json[i].OTHER_INTERESTS;
				$.contactInfoText.value = json[i].O_CONTACT_INFO;
				
				Ti.API.log('I am here 3');
				
				if (json[i].EXPAND == 1) { setCheckboxTrue($.question1yes); }
				else { setCheckboxTrue($.question1no); }
				
				if (json[i].FUNDING == 1) { setCheckboxTrue($.question2yes); }
				else { setCheckboxTrue($.question2no); }
				
			}	
		}
	};
	
	Ti.API.log('end of readData function!');
}

function readAgencyData(){
	//function to use HTTP to connect to a web server and transfer the data. 
	var sendit = Ti.Network.createHTTPClient({ 
	onerror: function(e){ 	
		Ti.API.debug(e.error); 	
		alert('There was an error during the connection555'); 	
	}, 	
	timeout:1000, 
	});

	//Here you have to change it for your local ip 
	sendit.open('GET', '52.32.54.34/php/read_agency_list.php');  
	sendit.send();

	sendit.onload = function() {
		var json = JSON.parse(this.responseText);
		var json = json.USER_ID;

		for( var i=0; i<json.length; i++) 
		{
			if ( json[i].USER_ID == Alloy.Globals.profileViewID) //READING JUSTIN GUERRA
			{				
				if (json[i].TAMU == 1) { setCheckboxTrue($.tamuCheckbox); }		
				if (json[i].PVAMU == 1) { setCheckboxTrue($.prairieCheckbox); }
				if (json[i].TSU == 1) { setCheckboxTrue($.tarletonCheckbox); }		
				if (json[i].TAMUCC == 1) { setCheckboxTrue($.tamuccCheckbox); }
				if (json[i].TAMUK == 1) { setCheckboxTrue($.tamukCheckbox); }		
				if (json[i].WTAMU == 1) { setCheckboxTrue($.westamCheckbox); }
				if (json[i].TAMUC == 1) { setCheckboxTrue($.tamucCheckbox); }		
				if (json[i].TAMUT == 1) { setCheckboxTrue($.tamutCheckbox); }
				if (json[i].TAMUCT == 1) { setCheckboxTrue($.tamuctCheckbox); }		
				if (json[i].TAMUSA == 1) { setCheckboxTrue($.tamusaCheckbox); }
				if (json[i].TAMHSC == 1) { setCheckboxTrue($.tamhscCheckbox); }		
				if (json[i].TAMAR == 1) { setCheckboxTrue($.tamarCheckbox); }
				if (json[i].TAMEEPS == 1) { setCheckboxTrue($.tameesCheckbox); }		
				if (json[i].TAMAEXS == 1) { setCheckboxTrue($.tamaesCheckbox); }
				if (json[i].TAMFS == 1) { setCheckboxTrue($.tamfsCheckbox); }		
				if (json[i].TAMTI == 1) { setCheckboxTrue($.tamtiCheckbox); }
				if (json[i].TAMVMDL == 1) { setCheckboxTrue($.tamvmdlCheckbox); }					
			}	
		}
	};
	
	Ti.API.log('end of readData function!');
}

function readResearchData(){
	//function to use HTTP to connect to a web server and transfer the data. 
	var sendit = Ti.Network.createHTTPClient({ 
	onerror: function(e){ 	
		Ti.API.debug(e.error); 	
		alert('There was an error during the connection555'); 	
	}, 	
	timeout:1000, 
	});

	//Here you have to change it for your local ip 
	sendit.open('GET', '52.32.54.34/php/read_area_of_research.php');  
	sendit.send();

	sendit.onload = function() {
		var json = JSON.parse(this.responseText);
		var json = json.USER_ID;

		for( var i=0; i<json.length; i++) 
		{
			if ( json[i].USER_ID == Alloy.Globals.profileViewID) //READING JUSTIN GUERRA
			{				
				if (json[i].FOOD_SAFETY == 1) { setCheckboxTrue($.foodSafetyCheckbox); }
				if (json[i].NUTRITION == 1) { setCheckboxTrue($.nutritionCheckbox); }	
				if (json[i].PUBLIC_HEALTH == 1) { setCheckboxTrue($.publicHealthCheckbox); }	
				if (json[i].PRODUCTION_ECON == 1) { setCheckboxTrue($.productionEconCheckbox); }	
				if (json[i].TRADE == 1) { setCheckboxTrue($.tradeCheckbox); }	
				if (json[i].PUBLIC_POLICY == 1) { setCheckboxTrue($.publicPolicyCheckbox); }	
				if (json[i].ANIMAL_HEALTH == 1) { setCheckboxTrue($.animalHealthCheckbox); }	
				if (json[i].FISH == 1) { setCheckboxTrue($.fishCheckbox); }	
				if (json[i].BIO_ENERGY == 1) { setCheckboxTrue($.bioenergyCheckbox); }	
				if (json[i].WILDLIFE == 1) { setCheckboxTrue($.wildlifeCheckbox); }								
			}	
		}
	};
	
	Ti.API.log('end of readData function!');
}

$.profileView.open();
setConnectButtonStatus();
readTextfieldData();
readAgencyData();
readResearchData();
Titanium.API.log("Alloy.Globals.profileViewID is -->", Alloy.Globals.profileViewID);
