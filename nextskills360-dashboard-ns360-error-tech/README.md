NS360 Dashboard Documentation
=============================

NS360 dashboard ([https://nextskills360-dashboard.web.app/](https://nextskills360-dashboard.web.app/)) is a platform that displays data generated from different activities on the progame coding toy [https://www.nextskills360.in/](https://www.nextskills360.in/). Its main purpose is to provide a user-friendly interface for tracking projects, schools, classes, and generating detailed reports.

Features
--------

### Multi-user Login System with Roles

The dashboard has a multi-user login system with role-based access control (RBAC). Users can log in with their registered mobile number and an OTP sent to their mobile number. The dashboard has seven roles: admin, program head, guest program head, principal, guest principal, teacher, and student. Each role has specific permissions, and admins have complete control over the entire dashboard.

### Navigation Menu Items

The dashboard has four navigation menu items - Projects, Reports, World Gallery, and Settings. Clicking on each menu item takes users to different sections of the dashboard.

### Projects Section

The Projects section displays a list of all the projects of different academic years with the project's status: completed, ongoing or not started. Only admins can edit these project statuses.

### Reports Section

The Reports section shows a detailed report at project level with the number of schools participated, scans, points, app support tickets count, whats app support tickets count, top 3 teachers, top 3 students at project level, and many other features. When clicking on the schools' count card, users can see a list of schools participating in the project. They can select any school to view a detailed report at school level similar to the project level. The Reports section also shows detailed assessment results in beautiful graphs, lists of students, teachers registered, and more.

### World Gallery Section

The World Gallery section displays all photos and videos uploaded by users. Admins can approve or disapprove these posts and set them into one of three categories: featured, program-in-action, progame activities, or disapprove and move them into the disapproved category. This section has a project selection dropdown to view project-wise photos and videos.

### Settings Section

The admin can add new users with roles of program head, guest program head, principal, or guest principal from this section. They can also change UI settings for no of teachers used, no of teachers registered, no of students used, no of students registered to show those items to other user roles or not at the project level.

Contributing to the Codebase
----------------------------

To contribute to Next Skills 360 dashboard codebase, follow these steps:

1.  Clone the project
2.  Run `yarn install` command
3.  Run the command `yarn start`

Technology Stack
----------------

The dashboard is built with React, Redux & React Context API for state management, React Router for Navigation Routing, and Material UI V5. We used CSS-in-JS where CSS is composed using JavaScript instead of defined in external files. Additionally, we use react-firebase-hooks and firebase for handling firestore database and firebase authentication.

Conclusion
----------

Overall, Next Skills 360 dashboard provides a user-friendly interface for tracking various aspects of coding programs, generating detailed reports, and managing multiple user roles. By following the given instructions, contributors can easily contribute to the codebase, helping to improve and enhance the dashboard's functionality.