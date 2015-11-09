var user = Alloy.Collections.user; 

var counter = 1;  
  
function showId(e) {  
 if (e.row.model) {  
  //alert(e.row.model);  
  var detailObj=user.get(e.row.model);  
  Titanium.API.log(detailObj); 
 }  
}  
  
function addTestUser(e) {  
 // create the test fighter model
 var model = Alloy.createModel('user', {  
  FIRST_NAME: 'First name ' + counter,  
  LAST_NAME: 'Last name ' + counter  
 });  
 counter++;  
 
 var filteredArray = user.where({FIRST_NAME: 'justin'})[0].get('LAST_NAME');
 Titanium.API.log(filteredArray);
 // add model to the collection and save it to sqlite  
 user.add(model);  
 model.save();  
  
 // let's refresh so we can see the ids coming from the   
 // autoincrement field in the sqlite database in the   
 // row click alerts  
 user.fetch();  
}  

user.fetch(); 
$.test.open();  