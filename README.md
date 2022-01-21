# Capstone:  Pear Suite Customer Panel

**Introduction to Pear Suite**
Pear Suite is a startup with a public facing site (pearsuite.com) and also an app component (app.pearsuite.com) that is building from a minimum viable product (MVP) stage. Pear Suite's customers are organizations that are using the app as a  platform to interact with their members.

As of now there is no ability for a customer to view their membership status, renewal date, or service invoices. They will (hopefully) also be able to extend their login credentials to directly transfer to the Pear Suite App.

**User Story**
A user (Pear Suite customer) of this platform will be able to login from the existing customer facing website (pearsuite.com) to login through Google OAuth (This is preferred, as the pearsuite app will use this same login credential. But this will be the last priority of work and isn't required for a MVP -Note 1) to the customer portal (to be built via Django).  Once logged in, a user will be able to access their account information to view their active membership status, subscription renewal date, and their invoice history through the Intuit Quickbooks API (2). They will also be able click a link to be redirected to the Pear Suite App, which will pass along the correct login credentials.

Pear Suite admins will also be able to access the platform, and will be able to access the wide range of reports (accounting & banking reports in pdf or JSON format) a user can currently access through the full Intuit site. 


**Functionality**

The user will access the login page from the existing pearsuite.com page. After logging in, they will be able to access user specific information pulled from the quickbooks api - query a payment status, get an invoice (see information itself via JSON, or get a PDF, and querey company info). 

**Data Model**

The data models will be focused on Pear Suite Administration and Customer user types. The data pulled from QuickBooks can be pulled by request via their API, so to pull data and store it within a Django server is duplicative (and a security concern).

[img - classes](./classes.drawio.svg)

**Schedule**

Week 1 - Admin User development. Build functionality for admin users to retrieve information on CompanyIDs (needed to pull client/customer specific reporting). This will be critical to build the functionality for customers to recieve invoices.

Weeks 2 &3 - User Development. Build functionality for customers to pull up to date reporting in JSON or pdf formats (focus is for invoice retrieval)

Week 4 - GoogleOAuth develpment. This will enable users to login via google OAuth to use the platform and to seamlessly transition from the Django application to the Pear Suite App


**Notes**
1 - Google OAuth - https://developers.google.com/identity/sign-in/web/sign-in
2 - QuickBooks API -  https://developer.intuit.com/app/developer/homepage & https://developer.intuit.com/app/developer/qbo/docs/api/accounting/most-commonly-used/account. Python library for quickbooks - https://pypi.org/project/python-quickbooks/ GitHub Repo with instructions to deploy QuickBooks OAuth2 via Django and Python - https://github.com/IntuitDeveloper/SampleOAuth2_UsingPythonClient