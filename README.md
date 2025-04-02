# HireWatch
INFR-3810 Final Project Group 13.

[ER Diagram](https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=Hirewatch_ER-Diagram.drawio&dark=0#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1sKUwnw5gEiBAWIROwO6uEC0WFNjFq6s8%26export%3Ddownload)

# **About the Application**

#### Authors
Abin Malayil, Ash Lingeswaran, Kapiraj Sivakumar, Zach D’Angelo  
INFR3810 \- Database Systems  
Ontario Tech University  
March 30th, 2025

## **Tech Overview of Web App**

### App Description

HireWatch is a web application that was created for users to find their dream jobs. This application allows users to sign up or log in and schedule interviews with the job of their choice. Users can furthermore view reviews of specific companies that other users have placed, view the jobs that they have applied for, as well as any jobs that the user has saved in case they would like to book an interview for it. The web application focuses on users who are desperately trying to find the job of their dreams, as well as those who are just trying to find a job to either start their life journey or near the end of it.

### Technology Overview

Pythonanywhere was used for two different purposes. One for the making of the database, and the other for the backend purpose of the web application. The first purpose was for the backend. This piece of technology helped with making the web application function the way it was projected to work. Files such as the “flask\_app.py” were used to code the back end of the application. Queries that go into MySQL to extract information from the database were written here. The file included other coding that was overall meant to make the web application function properly. Furthermore, many different libraries were used in this file, including the jsonify library, which allowed for a connection between the backend and the frontend. This file also included an exception error so users understood what the error was or why it occurred. Pythonanywhere also could import many other files, which is how the database information was obtained. Overall, this technology allowed the web application to not only function properly but also to import any additional information of importance that would be needed for the web application.

Within Pythonanywhere, mySQL was used. This is where the database resides. Initially, the SQL file that held all the data for each table was created, and by using Pythonanywhere, the SQL file was imported into the database, which gave it all the information for each table. The tables included information about any users who were signed up, the available jobs, interviews, and more. The information for each database was obtained using the coding technique called Python. By using this, actual information about users and jobs, such as the names of users or the job title, was obtained and implemented into the database. The main library used for this was the library called “faker”, which allowed the creation of randomly generated variables or attributes, which made implementing information into the database far less tedious and made it much more efficient and simpler. In summary, this piece of technology allowed for the creation of the database, as well as allowed input for all the necessary information that each table of the database required.

The front end of this web application was created by using many different types of methods. JavaScript, HTML, and CSS were all very important when creating the web application, with each providing its features to make the web application as clean and easy to use as possible. JavaScript was the most important part of the front end, as it not only handled different errors and different features within the application but also allowed for the front end and back end to link with each other. The library called “axios” was used to try and get any information from the database. Furthermore, depending on the active page, JavaScript included code that would prompt users who were not logged in to the application to login before they can access specific pages in the web application. HTML formatting was also included in any JavaScript. This allowed for the actual web page to have a neater way of displaying any type of information the JavaScript file intended it to display. Finally, the CSS files were implemented to further design the page, which improved the look of the web application.

GitHub was any piece of software that was used. This piece of technology helped keeping a backup version of the frontend and backend in case of a catastrophic failure. GitHub allowed for multiple people to create multiple different branches, as well as the creation of multiple versions of the code.

The final piece of technology that was used for the web application to function properly was Render. Render allows for the web application to not just be a local only deployment, but an actual published  URL deployment so that many other users can access the web application and use the features implemented into the web application.

### App & Feature Tutorial

To access the web application from anywhere, go to the following [link](https://hirewatch.onrender.com/) or type “hirewatch.onrender.com” into any sort of internet browser. The felow are simple guides on how to perform specific features implemented into the web application.

**Signing Up**  
	To sign up in the web application, click the navigation button and select “Sign Up”, which will prompt users to the sign up page. Enter all necessary information, with the year variable being between 1-4. If all information is correctly inputted, a message will appear stating the user was successfully registered, else, an incorrect variable(s) was submitted.  
Alternatively, some pages require users to be logged in to access the page. In this case, users can click “Sign Up” to register their accounts.  

**Logging In**  
	Some pages from the application will prompt users to login before accessing the page. Go to any of those pages, and the following will be displayed when logged out.  
Users need to add their email address for their username, along with the password they used to create the account. After pressing “Login”, users will be redirected to the home page. If an error occurs, the login page will address what the error was.

**Searching Jobs**  
	To search for jobs in the database, navigate to the navigation button and select “Search Jobs”. This will direct users to the search jobs page. For a successful search, users must type a couple of letters within a job title.  
To filter for jobs, click the filter button, which will display two additional search bars, asking for a company name or a location. These filters are not required to fill out; however, by using these, a narrower search is available for users looking for a specific job at a specific place.  

**Saved Jobs**  
	For users to view their saved jobs, they must initially login. Afterwards, users can navigate to their saved jobs by clicking the navigation button, and clicking “Saved Jobs”. This will display the users saved jobs.  
To save a job, navigate to the “Search Jobs” page, search for a job of the user's liking, and click the save button next to the job URL.  

**Applied Jobs**  
	For users to view the jobs they applied for, click the navigation button and click “Applied”. Users will be prompted to log in if they are not already logged in. Once logged in, users will be able to view which jobs they have applied for.   

**Interviews**  
	To view scheduled interviews, click the navigation button and select “View Interviews”. Users will be prompted to log in if they are not already logged in. Once logged in, users will be able to view their booked interviews.  
To cancel an interview, simply press the “Cancel Interview” button to remove a booking. To book an interview, navigate to the “Applied” page and select “Schedule Interview”.  
Add all the required information. As long as the formatting is correct, users will successfully have an interview booked.

**View Reviews**  
	For users to view reviews, go to the navigation button, and select “Reviews”. This will direct users to the Reviews page where they can see reviews of different companies from different users.  

**Sign Out**  
	For users to sign out of an account, navigate to the navigation button, click the “Welcome, *FirstName LastName*” and select “Sign Out”.  

