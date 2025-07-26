Serverless Job Board on AWS

This project is a full-stack, serverless job board application built entirely on Amazon Web Services (AWS). It demonstrates a modern, scalable, and cost-effective cloud architecture using AWS Lambda, API Gateway, DynamoDB, and S3.

The frontend is a single-page application built with Vue.js, providing a clean and interactive user experience.
Architecture Overview

The application avoids traditional servers by leveraging a serverless, event-driven architecture.

Core API Flow (Creating/Viewing Jobs):

    Frontend (Vue.js) sends an HTTP request (e.g., GET /jobs or POST /jobs).

    Amazon API Gateway receives the request and acts as the front door to the backend. It's configured to trigger the appropriate Lambda function based on the route and method.

    AWS Lambda (get-jobs or create-job) executes the business logic. The Node.js function queries or writes to the DynamoDB table.

    Amazon DynamoDB acts as the NoSQL database, storing all job listings in a Jobs table. Data is returned to the Lambda function.

    The Lambda function formats a response and sends it back through API Gateway to the frontend.

Resume Upload Flow (Secure File Uploads):

    Frontend sends a request to a /apply endpoint on API Gateway, including the applicant's info.

    API Gateway triggers a dedicated get-presigned-url Lambda function.

    The Lambda function generates a secure, temporary, one-time upload URL (a pre-signed URL) for a specific path in an S3 bucket (e.g., resumes/jobId-applicantId.pdf). It does not handle the file itself.

    The Lambda returns this pre-signed URL to the frontend.

    The Frontend uses this URL to upload the resume file directly and securely to Amazon S3.

    (Optional Extension) The file upload to S3 can be configured to trigger a final process-resume Lambda function to perform actions like updating the application status in DynamoDB or sending a notification email via Amazon SES.

Technical Stack

    Frontend: Vue.js, Tailwind CSS

    Cloud Provider: Amazon Web Services (AWS)

    Compute: AWS Lambda (Node.js runtime)

    API Layer: Amazon API Gateway (for RESTful endpoints)

    Database: Amazon DynamoDB (NoSQL)

    Storage: Amazon S3 (for secure resume uploads)

Backend Lambda Functions

The backend consists of several small, single-purpose Lambda functions written in Node.js.

    get-jobs: Scans the DynamoDB table and returns all job listings.

    create-job: Adds a new job listing to the DynamoDB table.

    get-presigned-url: Generates a secure URL for uploading resumes to S3.

How to Run

Frontend:
The index.html file is self-contained. To run it, serve it with a simple local server:

# Navigate to the file's directory
# For Python 3
python -m http.server

Then open http://localhost:8000 in your browser.

Backend:
The backend requires deployment to an AWS account using tools like the AWS Management Console, AWS SAM, or the Serverless Framework. Each function would be deployed as a separate Lambda, connected to an API Gateway endpoint and granted the necessary IAM permissions to interact with DynamoDB and S3.
