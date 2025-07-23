import { type ChatPostMessageArguments, WebClient } from "@slack/web-api";

if (!process.env.SLACK_BOT_TOKEN) {
  console.warn("SLACK_BOT_TOKEN environment variable not set - Slack notifications disabled");
}

if (!process.env.SLACK_CHANNEL_ID) {
  console.warn("SLACK_CHANNEL_ID environment variable not set - Slack notifications disabled");
}

const slack = process.env.SLACK_BOT_TOKEN ? new WebClient(process.env.SLACK_BOT_TOKEN) : null;

/**
 * Sends a structured message to a Slack channel using the Slack Web API
 * @param message - Structured message to send
 * @returns Promise resolving to the sent message's timestamp
 */
async function sendSlackMessage(
  message: ChatPostMessageArguments
): Promise<string | undefined> {
  if (!slack || !process.env.SLACK_CHANNEL_ID) {
    console.warn("Slack not configured - skipping message");
    return undefined;
  }

  try {
    const response = await slack.chat.postMessage({
      ...message,
      channel: process.env.SLACK_CHANNEL_ID,
    });
    return response.ts;
  } catch (error) {
    console.error('Error sending Slack message:', error);
    throw error;
  }
}

/**
 * Send notification for new price change request
 */
export async function sendPriceChangeRequestNotification(request: {
  id: number;
  materialName: string;
  distributor: string;
  requestedPrice: string;
  currentPrice?: string;
  submittedBy: string;
}): Promise<string | undefined> {
  const changeText = request.currentPrice 
    ? `$${request.currentPrice} → $${request.requestedPrice}`
    : `$${request.requestedPrice}`;

  return await sendSlackMessage({
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '💰 New Price Change Request'
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Material:*\n${request.materialName}`
          },
          {
            type: 'mrkdwn',
            text: `*Distributor:*\n${request.distributor}`
          },
          {
            type: 'mrkdwn',
            text: `*Price Change:*\n${changeText}`
          },
          {
            type: 'mrkdwn',
            text: `*Requested by:*\n${request.submittedBy}`
          }
        ]
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '✅ Approve'
            },
            style: 'primary',
            value: `approve_${request.id}`,
            action_id: 'approve_price_change'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '❌ Reject'
            },
            style: 'danger',
            value: `reject_${request.id}`,
            action_id: 'reject_price_change'
          }
        ]
      }
    ]
  });
}

/**
 * Send notification for approved price change
 */
export async function sendPriceChangeApprovalNotification(details: {
  materialName: string;
  distributor: string;
  newPrice: string;
  oldPrice?: string;
  approvedBy: string;
}): Promise<string | undefined> {
  const changeText = details.oldPrice 
    ? `$${details.oldPrice} → $${details.newPrice}`
    : `$${details.newPrice}`;

  return await sendSlackMessage({
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '✅ Price Change Approved'
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Material:*\n${details.materialName}`
          },
          {
            type: 'mrkdwn',
            text: `*Distributor:*\n${details.distributor}`
          },
          {
            type: 'mrkdwn',
            text: `*Price Change:*\n${changeText}`
          },
          {
            type: 'mrkdwn',
            text: `*Approved by:*\n${details.approvedBy}`
          }
        ]
      }
    ]
  });
}

/**
 * Send notification for admin direct price update
 */
export async function sendAdminPriceUpdateNotification(details: {
  materialName: string;
  distributor: string;
  location: string;
  newPrice: string;
  oldPrice?: string;
  updatedBy: string;
}): Promise<string | undefined> {
  const changeText = details.oldPrice 
    ? `$${details.oldPrice} → $${details.newPrice}`
    : `$${details.newPrice}`;

  return await sendSlackMessage({
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '⚡ Admin Price Update'
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Material:*\n${details.materialName}`
          },
          {
            type: 'mrkdwn',
            text: `*Distributor:*\n${details.distributor}`
          },
          {
            type: 'mrkdwn',
            text: `*Location:*\n${details.location}`
          },
          {
            type: 'mrkdwn',
            text: `*Price Change:*\n${changeText}`
          },
          {
            type: 'mrkdwn',
            text: `*Updated by:*\n${details.updatedBy}`
          }
        ]
      }
    ]
  });
}

export { sendSlackMessage };
