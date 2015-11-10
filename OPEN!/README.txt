

If you want to see the PHP files and all its glory you will need to access the 
server via a termainl. 

To access the server remotely you will need the 'UbuntuKey1.pem'
in the same directory you are opening your terminal.

Command to connect: ssh -i "UbuntuKey1.pem" ubuntu@52.32.54.34

Once you have logged into the server, you will need to navigate to the html directory.

Command: cd ~www-data/html/

/*******************************************************************************
 * 
 * These are the php files that you can call from with the application:
 * 
 *******************************************************************************/
 - Insert into user table: http://52.32.54.34/php/insert_into_user.php


