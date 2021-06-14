const { handler } = require('./index');
(async () => {
  const event = await handler({

    body: '{"CustomField":{},"SlaName":null,"FlowName":null,"TotalInteractions":1,"LastInteraction":{"Person":{"Name":"Bruno Santos","Email":"bruno.santoss@crednovo.com.br"},"Comments":[{"Content":"Teste Octa / Webhook / AWS / Azure","IsPublic":true}],"Attachments":[],"PropertiesChanges":{"ChannelName":"Octadesk","PriorityName":"Alta","RequesterName":"Bruno Santos (brunoadsjp@gmail.com)","Status":"Novo","TopicGroupName":"Estação de Trabalho","TopicName":"Incidente","TypeName":"Incidente","Form":"Ticket Padrão"}},"Product":null,"CCO":[],"CC":[],"OpenDate":"2021-03-11T18:11:17.8269584Z","Tags":[],"TopicName":"Incidente","TopicGroupName":"Estação de Trabalho","CurrentStatusName":"Novo","GroupAssignedName":null,"AssignedMail":null,"AssignedName":null,"InboxDomain":null,"InboxMail":null,"OrganizationName":null,"RequesterMultiChannelId":null,"RequesterCustomerCode":null,"RequesterMail":"brunoadsjp@gmail.com","RequesterName":"Bruno Santos","ChannelName":"Octadesk","PriorityName":"Alta","TypeName":"Incidente","Description":"<p style=\\"color: rgb(102, 102, 102); white-space: pre-line;\\"><font color=\\"#888888\\"><span style=\\"font-size: 18px; white-space: nowrap;\\">Teste Octa / Webhook / AWS / Azure</span></font><br/></p><div><font color=\\"#888888\\"><span style=\\"font-size: 18px; white-space: nowrap;\\"><br/></span></font></div>","DescriptionAsText":"Teste Octa / Webhook / AWS / Azure","Summary":"Teste Octa / Webhook / AWS / Azure","Number":90,"RequesterCustomField":{},"MultiChannelField":{},"Survey":null}',

    payload: [
      {
        "op": "add",
        "path": "/fields/System.Title",
        "from": null,
        "value": "Testando criar Task via lambda com Personal Access Token"
      }
    ]
  });
  event.body = (typeof event.body === 'string') ? JSON.parse(event.body) : event.body;
  console.log('event:', event);
})();