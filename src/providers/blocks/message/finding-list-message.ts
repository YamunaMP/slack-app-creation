import {
  BlockCollection,
  Header,
  Section,
  StaticSelect,
  Option,
  Image,
  Divider,
  Context,
  Actions,
  Button,
} from 'slack-block-builder';

export function findingListMessage(finding) {
  let statusOptions = [];
  let statuses = ['Open', 'Closed', 'In Progress'];
  statuses.forEach((status) => {
    statusOptions.push(
      Option({
        text: status,
        value: status,
      }),
    );
  });
  let items = finding.results;
  let blocks = [];
  blocks.push(
    Header()
      .text(`Top ${finding.totalItems} Vulnerabilities are found`)
      .blockId('header'),
  );
  for (let item of items) {
    let statusIntialOption = Option({
      text: item.status,
      value: item.status,
    });
    blocks.push(
      Section()
        .text(`<${item.TicketMetaData.link}|${item.Name}>`)
        .accessory(StaticSelect().options(statusOptions).initialOption(statusIntialOption)),
    
      Context()
        .elements(
          `Cloud Provider `,
          Image()
            .imageUrl(item.cloudWorkspace.cloudProviderLogoUrl)
            .altText('Cloud Provider Logo'),
        ),
      Section()
        .text(
          `*Resource:* ${item.resourceName}\n *Score:* ${item.riskScore}`
        )
        .accessory(
          Image()
            .imageUrl(item.resourceTypeLogo)
            .altText('Resource Type Logo'),
        ),
        Context()
        .elements(
          `Finding Source `,
          Image()
            .imageUrl(item.FindingSourceLogo)
            .altText('Finding Source Logo'),
        ),
      Divider()
    );
  }

  blocks.push(
    Section()
      .text(` `)
      .accessory(
        Button()
          .url(`https://demo-app.opus.security`)
          .text('View all 365 Results'),
      ),
  );
  return BlockCollection(blocks);
}
