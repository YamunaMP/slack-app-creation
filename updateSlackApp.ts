import { WebClient } from '@slack/web-api';
import fs from 'fs';
import path from 'path';

// Environment variables
const slackToken = process.env.SLACK_APP_TOKEN || '';
const slackAppId = process.env.SLACK_APP_ID || '';

const client = new WebClient(slackToken);

async function updateSlackApp() {
  try {
    const manifestPath = path.resolve(__dirname, 'manifest.yml');
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');

    // Update app using Slack API
    const response = await client.apps.manifestUpdate({
      app_id: slackAppId,
      manifest: manifestContent
    });

    console.log('App updated successfully:', response);
  } catch (error) {
    console.error('Error updating app:', error);
  }
}

updateSlackApp();
