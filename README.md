# nbeefull

Nutrition bee is mainly targeted the students and professionals who are studying Nutrition science. 
I have used monolithic, 3-tier architecture for it. We have around active 200+ users and almost 30-50 logins daily. Some of the core features are beta-tested successfully and integrated. And the app is in production. Let's discuss some of the core features:
1. Authentication: I have used PassportJS for authentication and token management. The library is so handy and made my task easy.
2. Admin Panel: A separate admin panel has been made with AdminBro(AdminJS) which is an admin panel for the NodeJS app. I connected it with my MongoDB Database.
3. Payment Gateway and Payment Confirmation: Users can use pay through MFS services(Bkash, Nagad, Rocket). After payment
successfully done by the user, they will get a confirmation mail. I used NodeMailer for mailing.
4. API Building: I have used ExpressJS for API building. Some of the common GET, POST, PUT, and DELETE APIs.
5. Encrypted Video: Course videos are encrypted and can not be downloaded easily on a local machine. (But Not Impossible 😛) 
5. Forget Password Option: If a user forgets the password then it can be retrieved through the mail. I used NodeMailer here.
6. Quizzes and Auto marking: In this app, the user can participate in quizzes and the acquired points will be saved to the database automatically. If the user fails to get 80% then will not get the certificate. This process is done automatically.
7. Automated Certification: The user can get the certificate if he/she passes the quizzes. After successfully passing, a new option 
will be appeared for the specific course, "Get Certificate". This option will be hidden unless the user passes.
Some Features are on the alpha test and will be deployed soon:
1. Not more than 2 devices: A User can only log in through 2 devices(Laptop/desktop/mobile/tab). The specific two devices will be logged in our database and without these two devices log-in will be restricted. This feature will be implemented to eradicate, "One account, multiple users". This feature is under test and will be deployed soon. 
2. Integrating Load Balancer and Reverse Proxy: As the users are increasing daily. We are thinking of integrating the load balancer and
reverse proxy for smooth flow and safety. 
3. Three Nines Availability: I am focused to increased the uptime in a year. So three nine is enough for the app. This is on the process.
4. In-app Offline view: Some of the users faces slow internet issue so an in-app offline view(downloaded video in the app) will be available soon.
In the end, I want to say I had to play multiple roles in building and deploying the app. However, I am a team player so I missed collaboration the most here. But overall the experience was amazing!
Visit our course hub:
https://lnkd.in/gp2VW7dQ
Facebook Page:
https://lnkd.in/gN2cKJ-W

Production: https://course.nutritionbee.net/


