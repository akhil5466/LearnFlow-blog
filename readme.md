**LearnFlow - Blog Application**

# Description
LearnFlow is a video streaming platform where users can browse videos on the home screen and stream them in the video player. Users can like, comment, and share videos, with the ability to see the number of likes and views each video has received. Additionally, users can reply to comments, with a user interface that distinguishes between new and replied comments.

# Features
•Google sign-in and registration.
•Role selection during registration (creator or student).
•Liking, commenting, and sharing videos publicly (no authentication required).
•Infinite nesting allowed for comment replies.
•Videos are marked as viewed after a user watches 20% of the content.
•Creators can upload videos, which are stored in an AWS S3 bucket.
•Video streaming in chunks fetched from the S3 bucket.
•Deployment on an AWS EC2 instance.
•Clean and responsive user interface.
•Backend design using MVC architecture.

# Technology Stack
•MongoDB
•Express.js
•EJS Template Engine (Frontend)
•Node.js

# Setup
1.Clone the repository from GitHub.
2.Run npm install to install all dependencies.
3.Create a keys.js file in the config directory and define the following keys:
4.mongoURI: Connection URL for the MongoDB database.
5.googleClientID: Google OAuth Credentials Client ID.
6.googleClientSecret: Google OAuth Credentials Client Secret.
7.awsAccessKeyID: AWS IAM User Access Key ID (with access to the S3 bucket).
8.awsSecretAccessKey: AWS IAM User Access Key Secret (with access to the S3 bucket).
9.Run npm run dev to start the server.
Visit http://localhost:3000/ in your browser.

# Upcoming Features
•Adding email and password-based authentication.
•Migrating the frontend to React.js.
•Switching content delivery from S3 to CloudFront for faster, cached responses.
•Adding routes for editing and deleting posts.

# Authors
•Akhil Sai Reddy