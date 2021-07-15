const { handler } = require('./index');
(async () => {
  const event = await handler({

    Records: [{
      eventVersion: '2.1',
      eventSource: 'aws:s3',
      awsRegion: 'us-east-1',
      eventTime: '2021-05-18T20:04:34.126Z',
      eventName: 'ObjectCreated:Put',
      userIdentity: { principalId: 'AWS:AROAQHTE52XCQICHR4XCI:bruno.santoss' },
      requestParameters: { sourceIPAddress: '177.69.88.81' },
      responseElements: {
        'x-amz-request-id': 'ZT2X24QDA95TV2BM',
        'x-amz-id-2': 'L9GE71nLNcKMawzYbyAfdlQKaNVuBtPOUqpktPuJdt0/328LSs3URtBBv0uM5v3g7RYztx8x4O58cKQLxxzvCD3CNefOTr8Xb5rASO1G3Vk='
      },
      s3: {
        s3SchemaVersion: '1.0',
        configurationId: 'received/*',
        bucket: {
          name: 'crednovo-files-hml',
          ownerIdentity: { principalId: 'A3GQPHOXC4YSF7' },
          arn: 'arn:aws:s3:::crednovo-files-hml'
        },
        object: {
          key: 'received/DEV-NEXX-999_12.txt',
          size: 8,
          eTag: 'f596ff34076eff1699636b77401b8985',
          sequencer: '0060A2CC558BA686BA'
        }
      }
    }]
  });
  // event.body = (typeof event.body === 'string') ? JSON.parse(event.body) : event.body;
  console.log('event:', event);
})();