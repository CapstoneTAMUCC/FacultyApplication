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
});

$.profile.open();