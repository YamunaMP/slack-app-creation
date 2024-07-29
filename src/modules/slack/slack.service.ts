import { Injectable } from '@nestjs/common';
import { findingListMessage } from 'src/providers/blocks/message/finding-list-message';
import { findingList } from 'src/data/finding-list';

@Injectable()
export class SlackService {
  constructor() {}

  async initSlackInteraction(boltApp: any) {
    boltApp.message(async ({ message, say, client }) => {
      if (message.channel_type === 'im' && !message.bot_id) {
        try {
          if (
            message.text
              .toLowerCase()
              .includes('top vulnerabilities for last week')
          ) {
            let items = findingList;
            let block = findingListMessage(items);
            await client.chat.postMessage({
              channel: message.channel,
              text: 'Top vulnerabilities found',
              blocks: block,
              unfurl_links: false,
            });
          }
        } catch (error) {
          console.error(error);
        }
      }
    });

    boltApp.shortcut(
      'create_ticket',
      async ({ ack, context, client, body }) => {},
    );
  }

  async initSlackEvent(boltApp: any) {}

  async initSlackAction(boltApp) {}

  async initSlackViewSubmission(boltApp) {}

  async initSlackCommand(boltApp) {}
}
