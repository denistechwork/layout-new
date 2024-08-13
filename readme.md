# Layout-new

Simple layout according to the task. We have some buttons and also menu both in desktop and for mobile devices.
It has one page but I included some functionality using RestAPI service https://dummyjson.com/docs/auth#auth-login for authentication.
You can log using username and password of different dummy users https://dummyjson.com/users .
Initial form from the task is using email and password, but this one provides logging in only with username-password pair, that is why I changed it.
Functionality includes changes in interface, also button, where first and last name of users are displayed and log out operation also making effect on interface. So it is like a little simulation.
Also you can push this button to see some additional info about users.
There are also token verification not only for login operation, but also for session time, after expiration of which it is checking for token and then making request using refresh one, for additional session time.
Project is based on Vanilla JavaScript as to show some core knowledge of the language.

Run the index.html file initially to see how it works.
