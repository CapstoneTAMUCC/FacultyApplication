/*
 * Controller for Profile section
 * Purpose: Provide functionality for the client's Profile section
 */

/**
 *	This function is used to convert regular buttons to checkboxes
 * 
 * 	@param {Object} the button
 */
function checkboxFunction(e)
{
	if(false == e.source.value) {
        e.source.value = true;
        e.source.backgroundColor = '#007690';
        e.source.title = '\u2713';
    } else {
        e.source.value = false;
        e.source.backgroundColor = '#aaa';
        e.source.title = '';
    }
}

/**
 *	Use the androidback event to go back to Main Menu
 */
$.profile.addEventListener('androidback' , function (e) {
	Alloy.Globals.goToHome ($, $.profile);
});

/**
 *	Home button function will take you to Main Menu
 */
var homeButtonFunc = function () {
	Alloy.Globals.goToHome ($, $.profile);
};

/**
 *	Edit button enables editing all fields on click
 *  For About section
 */
$.editButton1.addEventListener('click', function(e)
{
	// Begin editing
	if (false == e.source.value) {
		e.source.value = true;
		e.source.title = 'DONE';
		e.source.backgroundColor = 'black';
		$.nameField.enabled = 'true';
		$.nameField.backgroundColor = 'black';
		$.educationText.enabled = 'true';
		$.contactInfoText.enabled = 'true';
		$.projectText.enabled = 'true';
		$.expertiseText.enabled = 'true';
		$.committeeText.enabled = 'true';
		$.otherInterestText.enabled = 'true';
	}
	
	// Finish editing
	else {
		e.source.value = false;
		e.source.title = 'EDIT';
		e.source.backgroundColor = '#800000';
		$.nameField.enabled = 'false';
		$.nameField.backgroundColor = '#800000';
		$.educationText.enabled = 'false';
		$.contactInfoText.enabled = 'false';
		$.projectText.enabled = 'false';
		$.expertiseText.enabled = 'false';
		$.committeeText.enabled = 'false';
		$.otherInterestText.enabled = 'false';
	}
});

/**
 *	Edit button enables editing all fields on click 
 *  This is the one on Questionnaire tab
 */
$.editButton2.addEventListener('click', function(e)
{
	// Begin editing
	if (false == e.source.value) {
		e.source.value = true;
		e.source.title = 'DONE';
		e.source.backgroundColor = 'black';
		$.question1yes.enabled = 'true';
		$.question1no.enabled = 'true';
		$.question2yes.enabled = 'true';
		$.question2no.enabled = 'true';
		$.tamuCheckbox.enabled = 'true';
		$.tamuccCheckbox.enabled = 'true';
		$.tamukCheckbox.enabled = 'true';
		$.tamucCheckbox.enabled = 'true';
		$.tamutCheckbox.enabled = 'true';
		$.tamuctCheckbox.enabled = 'true';
		$.tamusaCheckbox.enabled = 'true';
		$.prairieCheckbox.enabled = 'true';
		$.tarletonCheckbox.enabled = 'true';
		$.westamCheckbox.enabled = 'true';
		$.tamhscCheckbox.enabled = 'true';
		$.tamarCheckbox.enabled = 'true';
		$.tameesCheckbox.enabled = 'true';
		$.tamaesCheckbox.enabled = 'true';
		$.tamfsCheckbox.enabled = 'true';
		$.tamtiCheckbox.enabled = 'true';
		$.tamvmdlCheckbox.enabled = 'true';
		$.foodSafetyCheckbox.enabled = 'true';
		$.nutritionCheckbox.enabled = 'true';
		$.publicHealthCheckbox.enabled = 'true';
		$.productionEconCheckbox.enabled = 'true';
		$.tradeCheckbox.enabled = 'true';
		$.publicPolicyCheckbox.enabled = 'true';
		$.animalHealthCheckbox.enabled = 'true';
		$.fishCheckbox.enabled = 'true';	
		$.bioenergyCheckbox.enabled = 'true';
		$.wildlifeCheckbox.enabled = 'true';
	}
	
	// Finish editing
	else {
		e.source.value = false;
		e.source.title = 'EDIT';
		e.source.backgroundColor = '#800000';
		$.question1yes.enabled = 'false';
		$.question1no.enabled = 'false';
		$.question2yes.enabled = 'false';
		$.question2no.enabled = 'false';
		$.tamuCheckbox.enabled = 'false';
		$.tamuccCheckbox.enabled = 'false';
		$.tamukCheckbox.enabled = 'false';
		$.tamucCheckbox.enabled = 'false';
		$.tamutCheckbox.enabled = 'false';
		$.tamuctCheckbox.enabled = 'false';
		$.tamusaCheckbox.enabled = 'false';
		$.prairieCheckbox.enabled = 'false';
		$.tarletonCheckbox.enabled = 'false';
		$.westamCheckbox.enabled = 'false';
		$.tamhscCheckbox.enabled = 'false';
		$.tamarCheckbox.enabled = 'false';
		$.tameesCheckbox.enabled = 'false';
		$.tamaesCheckbox.enabled = 'false';
		$.tamfsCheckbox.enabled = 'false';
		$.tamtiCheckbox.enabled = 'false';
		$.tamvmdlCheckbox.enabled = 'false';
		$.foodSafetyCheckbox.enabled = 'false';
		$.nutritionCheckbox.enabled = 'false';
		$.publicHealthCheckbox.enabled = 'false';
		$.productionEconCheckbox.enabled = 'false';
		$.tradeCheckbox.enabled = 'false';
		$.publicPolicyCheckbox.enabled = 'false';
		$.animalHealthCheckbox.enabled = 'false';
		$.fishCheckbox.enabled = 'false';	
		$.bioenergyCheckbox.enabled = 'false';
		$.wildlifeCheckbox.enabled = 'false';
	}
});

/**
 *	Click functionality to first checkbox of first question on questionnaire tab
 */
$.question1yes.addEventListener('click', function(e)
{
	if(false == e.source.value) {
        e.source.value = true;
        e.source.backgroundColor = '#007690';
        e.source.title = '\u2713';
        if ($.question1no.value == true)
        {
        	$.question1no.value = false;
	        $.question1no.backgroundColor = '#aaa';
	        $.question1no.title = '';
        }
    }
    else
    {
    	e.source.value = false;
        e.source.backgroundColor = '#aaa';
        e.source.title = '';
    }
});

/**
 *	Click functionality to second checkbox of first question on questionnaire tab
 */
$.question1no.addEventListener('click', function(e)
{
	if(false == e.source.value) {
        e.source.value = true;
        e.source.backgroundColor = '#007690';
        e.source.title = '\u2713';
        if ($.question1yes.value == true)
        {
        	$.question1yes.value = false;
	        $.question1yes.backgroundColor = '#aaa';
	        $.question1yes.title = '';
        }
    }
    else
    {
    	e.source.value = false;
        e.source.backgroundColor = '#aaa';
        e.source.title = '';
    }
});

/**
 *	Click functionality to first checkbox of second question on questionnaire tab
 */
$.question2yes.addEventListener('click', function(e)
{
	if(false == e.source.value) {
        e.source.value = true;
        e.source.backgroundColor = '#007690';
        e.source.title = '\u2713';
        if ($.question2no.value == true)
        {
        	$.question2no.value = false;
	        $.question2no.backgroundColor = '#aaa';
	        $.question2no.title = '';
        }
    }
    else
    {
    	e.source.value = false;
        e.source.backgroundColor = '#aaa';
        e.source.title = '';
    }
});

/**
 *	Click functionality to second checkbox of second question on questionnaire tab
 */
$.question2no.addEventListener('click', function(e)
{
	if(false == e.source.value) {
        e.source.value = true;
        e.source.backgroundColor = '#007690';
        e.source.title = '\u2713';
        if ($.question2yes.value == true)
        {
        	$.question2yes.value = false;
	        $.question2yes.backgroundColor = '#aaa';
	        $.question2yes.title = '';
        }
    }
    else
    {
    	e.source.value = false;
        e.source.backgroundColor = '#aaa';
        e.source.title = '';
    }
});

/**
 *	This function is used to get checkbox value 1 if true 2 if false
 * 
 * 	@param {Object} the button(checkbox)
 */
function getCheckboxValue(e)	//will be used in insertData
{
	if (e.value == true)
	{
		return 1;
	}
	else
	{
		return 0;
	}
}

/**
 *	This function is used to set checkboxes to true(checked)
 * 
 * 	@param {Object} the button(checkbox)
 */
function setCheckboxTrue(e)
{
	e.value = true;
	e.backgroundColor = '#007690';
	e.title = '\u2713';
}

/**
 *	This function reads the 6 main information on About tab
 */
function readTextfieldData(){
	// Function to use HTTP to connect to a web server and transfer the data. 
	var sendit = Ti.Network.createHTTPClient({ 
	onerror: function(e){ 	
		Ti.API.debug(e.error); 	
		alert('There was an error during the connection2222'); 	
	}, 	
	timeout:1000, 
	});

	// Here you have to change it for your local ip 
	sendit.open('GET', '52.32.54.34/php/read_user_list.php');  
	sendit.send();

	sendit.onload = function() {
		Ti.API.log('I am here!!!');
		var json = JSON.parse(this.responseText);
		var json = json.NAME;

		for( var i=0; i<json.length; i++) 
		{
			// Used to be 1234 only without quotations READING JUSTIN GUERRA
			if ( json[i].USER_ID == Alloy.Globals.thisUserID) 
			{
				$.nameField.value = json[i].NAME;
				$.educationText.value = json[i].EDUCATION;
				$.projectText.value = json[i].CURRENT_PROJ;
				$.expertiseText.value = json[i].AREA_EXPERTISE;
				$.committeeText.value = json[i].COMMITTEES;
				$.otherInterestText.value = json[i].OTHER_INTERESTS;
				$.contactInfoText.value = json[i].O_CONTACT_INFO;
				$.profilePicture.image = json[i].PHOTO;
				
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

/**
 *	This function reads/populates Agency information for profile
 */
function readAgencyData(){
	// Function to use HTTP to connect to a web server and transfer the data 
	var sendit = Ti.Network.createHTTPClient({ 
	onerror: function(e){ 	
		Ti.API.debug(e.error); 	
		alert('There was an error during the connection555'); 	
	}, 	
	timeout:1000, 
	});

	// Here you have to change it for your local ip 
	sendit.open('GET', '52.32.54.34/php/read_agency_list.php');  
	sendit.send();

	sendit.onload = function() {
		var json = JSON.parse(this.responseText);
		var json = json.USER_ID;

		for( var i=0; i<json.length; i++) 
		{
			// User global client ID
			if ( json[i].USER_ID == Alloy.Globals.thisUserID) 
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
}

/**
 *	This function reads/populates Areas of Research information for profile
 */
function readResearchData(){
	// Function to use HTTP to connect to a web server and transfer the data. 
	var sendit = Ti.Network.createHTTPClient({ 
	onerror: function(e){ 	
		Ti.API.debug(e.error); 	
		alert('There was an error during the connection555'); 	
	}, 	
	timeout:1000, 
	});

	// Here you have to change it for your local ip 
	sendit.open('GET', '52.32.54.34/php/read_area_of_research.php');  
	sendit.send();

	sendit.onload = function() {
		var json = JSON.parse(this.responseText);
		var json = json.USER_ID;

		for( var i=0; i<json.length; i++) 
		{
			// Use global client ID
			if ( json[i].USER_ID == Alloy.Globals.thisUserID)
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

/**
 *	This function updates Profile's information (Used by SAVE button)
 */
function updateData(){
	var request = Ti.Network.createHTTPClient({ 	
		onerror: function(e){ 
			Ti.API.debug(e.error); 
			alert('There was an error during the connection'); 
		}, 
		timeout:1000, 	         
	});  
	// Request the data from the web service, Here you have to change it for your local ip 
    request.open("POST","52.32.54.34/php/update_user_list.php"); 

	var params = ({ "USER_ID": 				Alloy.Globals.thisUserID,	
					"NAME": 				$.nameField.value, 
					"EDUCATION": 			$.educationText.value, 
					"CURRENT_PROJ": 	    $.projectText.value, 
					"AREA_EXPERTISE":       $.expertiseText.value, 
					"COMMITTEES" : 			$.committeeText.value, 
					"OTHER_INTERESTS": 		$.otherInterestText.value,  
					"O_CONTACT_INFO": 		$.contactInfoText.value,
					"FUNDING": 				getCheckboxValue($.question2yes),
					"EXPAND": 				getCheckboxValue($.question1yes),
					"TAMU": 				getCheckboxValue($.tamuCheckbox),
					"PVAMU": 				getCheckboxValue($.prairieCheckbox),
					"TSU": 					getCheckboxValue($.tarletonCheckbox),
					"TAMUCC": 				getCheckboxValue($.tamuccCheckbox),
					"TAMUK": 				getCheckboxValue($.tamukCheckbox),
					"WTAMU": 				getCheckboxValue($.westamCheckbox),
					"TAMUC": 				getCheckboxValue($.tamucCheckbox),
					"TAMUT": 				getCheckboxValue($.tamutCheckbox),
					"TAMUCT": 				getCheckboxValue($.tamuctCheckbox),
					"TAMUSA": 				getCheckboxValue($.tamusaCheckbox),
					"TAMHSC": 				getCheckboxValue($.tamhscCheckbox),
					"TAMAR": 				getCheckboxValue($.tamarCheckbox),
					"TAMEEPS": 				getCheckboxValue($.tameesCheckbox),
					"TAMAEXS": 				getCheckboxValue($.tamaesCheckbox),
					"TAMFS": 				getCheckboxValue($.tamfsCheckbox),
					"TAMTI": 				getCheckboxValue($.tamtiCheckbox),
					"TAMVMDL": 				getCheckboxValue($.tamvmdlCheckbox),
					"FOOD_SAFETY": 			getCheckboxValue($.foodSafetyCheckbox),
					"NUTRITION": 			getCheckboxValue($.nutritionCheckbox),
					"PUBLIC_HEALTH": 		getCheckboxValue($.publicHealthCheckbox),
					"PRODUCTION_ECON": 		getCheckboxValue($.productionEconCheckbox),
					"TRADE": 				getCheckboxValue($.tradeCheckbox),
					"PUBLIC_POLICY": 		getCheckboxValue($.publicPolicyCheckbox),
					"ANIMAL_HEALTH": 		getCheckboxValue($.animalHealthCheckbox),
					"FISH": 				getCheckboxValue($.fishCheckbox),
					"BIO_ENERGY": 			getCheckboxValue($.bioenergyCheckbox),
					"WILDLIFE": 			getCheckboxValue($.wildlifeCheckbox),
					});

	request.send(params);
	alert('Saved successfully!');
}

//OPEN PROFILE WINDOW
$.profile.open();	

//GET 6 MAIN INFORMATION ON ABOUT TAB
readTextfieldData();	

//GET AGENCY INFORMATION ON QUESTIONNAIRE TAB
readAgencyData();		

//GET AREAS OF RESEARCH INFORMATION ON QUESTIONNAIRE TAB
readResearchData();		