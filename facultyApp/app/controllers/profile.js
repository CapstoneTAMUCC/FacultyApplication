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

$.editButton1.addEventListener('click', function(e)
{
	if (false == e.source.value) {
		e.source.value = true;
		e.source.title = 'DONE';
		e.source.backgroundColor = 'black';
		//$.additionalText1.enabled = 'true';
		//$.additionalText2.enabled = 'true';
		//$.additionalText3.enabled = 'true';
		$.nameField.enabled = 'true';
		$.nameField.backgroundColor = 'black';
		$.educationText.enabled = 'true';
		$.contactInfoText.enabled = 'true';
		$.projectText.enabled = 'true';
		$.expertiseText.enabled = 'true';
		$.committeeText.enabled = 'true';
		$.otherInterestText.enabled = 'true';
	}
	else {
		e.source.value = false;
		e.source.title = 'EDIT';
		e.source.backgroundColor = '#800000';
		//$.additionalText1.enabled = 'false';
		//$.additionalText2.enabled = 'false';
		//$.additionalText3.enabled = 'false';
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

$.editButton2.addEventListener('click', function(e)
{
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

function readData(){
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
		var json = JSON.parse(this.responseText);
		var json = json.NAME;
		for( var i=0; i<json.length; i++) {
			if ( json[i].USER_ID == '1234') //used to be 1234 only without quotations
			{
				$.nameField.value = json[i].NAME;
				$.educationText.value = json[i].EDUCATION;
				$.projectText.value = json[i].CURRENT_PROJ;
				$.expertiseText.value = json[i].AREA_EXPERTISE;
				$.committeeText.value = json[i].COMMITTEES;
				$.otherInterestText.value = json[i].OTHER_INTRESTS;
				$.contactInfoText.value = json[i].O_CONTACT_INFO;
				
				if (json[i].EXPAND == 1)
				{
					$.question1yes.value = true;
					$.question1yes.backgroundColor = '#007690';
					$.question1yes.title = '\u2713';
				}
				else
				{
					$.question1no.value = true;
					$.question1no.backgroundColor = '#007690';
					$.question1no.title = '\u2713';
				}
				
				if (json[i].FUNDING == 1)
				{
					$.question2yes.value = true;
					$.question2yes.backgroundColor = '#007690';
					$.question2yes.title = '\u2713';
				}
				else
				{
					$.question2no.value = true;
					$.question2no.backgroundColor = '#007690';
					$.question2no.title = '\u2713';
				}
			}	
		}
	};
	
	alert('end of readData function!');
}

function insertData(){ 
	var request = Ti.Network.createHTTPClient({ 

		//onload:alert("Your chore has been submitted"), 
	
		onerror: function(e){ 
			Ti.API.debug(e.error); 
			alert('There was an error during the connection'); 
		}, 
		timeout:1000, 	         
	});  

	//Request the data from the web service, Here you have to change it for your local ip 

    request.open("POST","52.32.54.34/php/insert_into_user.php"); 
       
	var params = ({ "USER_ID": 				'0123456789',
					"NAME": 				$.nameField.value, 
					"PHONE": 				'TEST1', 
					"EDUCATION": 			$.educationText.value, 
					"CURRENT_PROJ": 	    $.projectText.value, 
					"AREA_EXPERTISE":       $.expertiseText.value, 
					"COMMITTEES" : 			$.committeeText.value, 
					"OTHER_INTERESTS": 		$.otherInterestText.value,  
					"O_CONTACT_INFO": 		$.contactInfoText.value,
					"FUNDING": 				getCheckboxValue($.question2yes),
					"EXPAND": 				getCheckboxValue($.question1yes),
					});
      
	request.send(params);
	alert('Successfully saved!');
};


$.profile.open();
//readData();