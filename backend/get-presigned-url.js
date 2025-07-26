// get-presigned-url.js
// This function generates a secure, pre-signed URL for uploading a resume to S3.

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

// Initialize S3 client
const client = new S3Client({});

// The name of your S3 bucket for resumes
const Bucket = "serverless-job-board-resumes";

export const handler = async (event) => {
  try {
    // Get the desired filename from the request body
    const { fileName, jobId } = JSON.parse(event.body);
    
    // Generate a unique key for the S3 object to prevent overwrites
    const uniqueId = randomUUID();
    const key = `resumes/${jobId}/${uniqueId}-${fileName}`;

    // Create the command for the PutObject operation
    const command = new PutObjectCommand({
      Bucket,
      Key: key,
      ContentType: "application/pdf", // Expecting PDF files
    });

    // Generate the pre-signed URL, valid for 5 minutes
    const signedUrl = await getSignedUrl(client, command, { expiresIn: 300 });

    // Return the pre-signed URL to the client
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Enable CORS
      },
      body: JSON.stringify({
        uploadUrl: signedUrl,
        key: key, // The key can be useful for the client to know
      }),
    };
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    // Return an error response
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Could not generate upload URL.", error: error.message }),
    };
  }
};

