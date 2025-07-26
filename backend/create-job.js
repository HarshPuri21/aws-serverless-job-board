// create-job.js
// This function creates a new job listing in the DynamoDB table.

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

// Initialize DynamoDB clients
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// The name of your DynamoDB table
const TableName = "Jobs";

export const handler = async (event) => {
  try {
    // The request body is a string, so it needs to be parsed
    const jobData = JSON.parse(event.body);

    // Create a new job item with a unique ID and timestamp
    const newJob = {
      jobId: randomUUID(),
      postedDate: new Date().toISOString(),
      ...jobData,
    };

    // Create the command to put the new item in the table
    const command = new PutCommand({
      TableName,
      Item: newJob,
    });

    // Execute the command
    await docClient.send(command);

    // Return a successful response
    return {
      statusCode: 201, // 201 Created
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Enable CORS
      },
      body: JSON.stringify(newJob),
    };
  } catch (error) {
    console.error("Error creating job:", error);
    // Return an error response
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Could not create job.", error: error.message }),
    };
  }
};

