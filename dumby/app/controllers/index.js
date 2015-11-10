
//Array to store the data from the todo list 

       var dataArray = [];        

       //We execute the function to show the data for the first view 

       getTodoList();          

       function getTodoList () { 

       //function to use HTTP to connect to a web server and transfer the data. 

              var sendit = Ti.Network.createHTTPClient({ 

                     onerror: function(e){ 

                           Ti.API.debug(e.error); 

                           alert('There was an error during the connection'); 

                     }, 

                  timeout:1000, 

              });                      

              //Here you have to change it for your local ip 

              sendit.open('GET', '52.32.54.34/read_user_list.php');  

              sendit.send(); 

              //Function to be called upon a successful response 

              sendit.onload = function(){ 

                     var json = JSON.parse(this.responseText); 

                     var json = json.FIRST_NAME; 

                     //if the database is empty show an alert 

                     if(json.length == 0){ 

                            $.tableView.headerTitle = "The database row is empty"; 

                     }                      

                     //Emptying the data to refresh the view 

                     dataArray = [];                      

                     //Insert the JSON data to the table view 

                     for( var i=0; i<json.length; i++){ 

                           var row = Ti.UI.createTableViewRow({ 

                                  title: json[i].FIRST_NAME, 

                                  hasChild : true, 

                           });        

                         dataArray.push(row);                 

                     };                      

                     $.tableView.setData(dataArray);                            

               }; 

       };   

       function insertData(){ 

              //if there is something in the textbox 

              if($.id.value != "" && $.id.value != null){ 

                     var request = Ti.Network.createHTTPClient({ 

                  onload:alert("Your chore has been submitted"), 

                  onerror: function(e){ 

                      Ti.API.debug(e.error); 

                      alert('There was an error during the conexion'); 

                  }, 

                  timeout:1000, 
                     });  

//Request the data from the web service, Here you have to change it for your local ip 

                     request.open("POST","52.32.54.34/insert_user_list_element.php"); 
                    
                    /*var a = '"USER_ID": $.id.value,"FIRST_NAME": $.fname.value, "LAST_NAME": $.lname.value, "PHONE": $.phone.value, "EDUCATION": $.education.value,';
                    var b = '"CURRENT_PROJ": $.project.value, "AREA_EXPERTISE": $.area.value, "COMMITTEES" : $.committees.value, "OTHER_INTRESTS" : $.oi.value,';
                    var c = '"O_CONTACT_INFO": $.oci.value,"FUNDING": $.funding.value,"EXPAND": $.expand.value';
                    */
                   
					var params = ({ "USER_ID": 				$.id.value,
												"FIRST_NAME": 			$.fname.value, 
												"LAST_NAME": 			$.lname.value, 
												"PHONE": 					$.phone.value, 
												"EDUCATION": 			$.education.value, 
												"CURRENT_PROJ": 	$.project.value, 
												"AREA_EXPERTISE": $.area.value, 
												"COMMITTEES" : 		$.committees.value, 
												"OTHER_INTRESTS":$.oi.value,  
												"O_CONTACT_INFO":$.oci.value,
												"FUNDING": 				$.funding.value,
												"EXPAND": 				$.expand.value,
												});
		          
                  	//var params = ({"USER_ID": "0","FIRST_NAME": $.fname.value, "LAST_NAME": $.lname.value, "PHONE": $.phone.value, "EDUCATION":$.education.value,});//"CURRENT_PROJ": "$.project.value", "AREA_EXPERTISE": "$.area.value","COMMITTEES" : "$.committees.value", "OTHER_INTRESTS" : "$.oi.value",  "O_CONTACT_INFO": "$.oci.value", "FUNDING":"-1","EXPAND": "-1",});                     
                  	request.send(params);
              } 

              else{ 
                     alert("Please write something in the textbox"); 
              }

              $.id.value = "";
              $.fname.value="";
              $.lname.value="";
              $.phone.value="";
              $.education.value="";
              $.project.value="";
              $.area.value="";
              $.committees.value="";
              $.oi.value="";
              $.oci.value="";
              $.funding.value="";
              $.expand.value="";

       };   

       $.mainTabGroup.open();

	
/*
       function insertData(){ 

              //if there is something in the textbox 

              if($.inserTxtF.value != "" && $.inserTxtF.value != null){ 

                     var request = Ti.Network.createHTTPClient({ 

                  onload:alert("Your chore has been submitted"), 

                  onerror: function(e){ 

                      Ti.API.debug(e.error); 

                      alert('There was an error during the conexion'); 

                  }, 

                  timeout:1000, 

                     });    

//Request the data from the web service, Here you have to change it for your local ip 

                     request.open("POST","http://52.32.54.34/insert_user_list_element.php"); 

                     var params = ({"id": "0" ,"todo": $.inserTxtF.value});  
                  	request.send(params); 
                  	
              } 

              else{ 

                     alert("Please write something in the textbox"); 

              }               

              $.inserTxtF.value = ""; 

       };   

       $.mainTabGroup.open();*/
