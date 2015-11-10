

If you want to see the PHP files and all its glory you will need to access the 
server via a termainl. 

To access the server remotely you will need the 'UbuntuKey1.pem'
in the same directory you are opening your terminal.

Command to connect: ssh -i "UbuntuKey1.pem" ubuntu@52.32.54.34

Once you have logged into the server, you will need to navigate to the html directory.

Command: cd ~www-data/html/

There are two sections below: Insert & Read

/***************************************************************************************
 * 
 * These are the php files that handle inserts into the database for the application:
 * 
 ***************************************************************************************/
 - Insert into user table: http://52.32.54.34/php/insert_into_user.php
	- "INSERT INTO FacAppDB.USER(FIRST_NAME, LAST_NAME,".
        "PHONE, EDUCATION, CURRENT_PROJ,AREA_EXPERTISE, COMMITTEES,".
        "OTHER_INTRESTS, O_CONTACT_INFO,  FUNDING, EXPAND)".
        "VALUES ('$FIRST_NAME', '$LAST_NAME', '$PHONE', '$EDUCATION',".
        "'$CURRENT_PROJ','$AREA_EXPERTISE', '$COMMITTEES', '$OTHER_INTRESTS',".
        "'$O_CONTACT_INFO', '$FUNDING', '$EXPAND')";

 - Insert into message table:http://52.32.54.34/php/insert_into_message.php
	- “INSERT INTO FacAppDB.MESSAGE(CONVERSATION_ID, USER_ID,".
        "BODY) VALUES ('$CONVERSATION_ID','$USER_ID', '$BODY')";

- 


/***************************************************************************************
 * 
 * These are the php files that read from the database for the application:
 * 
 ***************************************************************************************/
 - Read into user table: http://52.32.54.34/php/read_user_list.php
	- "SELECT USER_ID, FIRST_NAME, LAST_NAME, PHONE, EDUCATION, CURRENT_PROJ, AREA_EXPERTISE, 		   COMMITTEES, OTHER_INTRESTS, O_CONTACT_INFO, FUNDING, EXPAND FROM USER"

- 













