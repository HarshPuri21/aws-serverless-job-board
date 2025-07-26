// get-jobs.js
// This function retrieves all job listings from the DynamoDB table.

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB clients
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// The name of your DynamoDB table
const TableName = "Jobs";

export const handler = async (event) => {
  try {
    // Create the command to scan the entire table
    const command = new ScanCommand({
      TableName,
    });

    // Execute the command
    const response = await docClient.send(command);
    const jobs = response.Items;

    // Return a successful response with the jobs array
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Enable CORS
      },
      body: JSON.stringify(jobs),
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    // Return an error response
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Could not fetch jobs.", error: error.message }),
    };
  }
};

