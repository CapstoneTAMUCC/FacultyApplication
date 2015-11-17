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

$.profileView.addEventListener('androidback' , function (e) {
	Titanium.API.log("I AM USING ANDROID BACK IN PROFILEVIEW!");
	//Alloy.Globals.Navigate ($, $.profileView, Alloy.createController('profile').getView());	//maybe this will work
	$.profileView.close();	//might be a better option for speed?
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
readTextfieldData();
readAgencyData();
readResearchData();
Titanium.API.log("Alloy.Globals.profileViewID is -->", Alloy.Globals.profileViewID);
