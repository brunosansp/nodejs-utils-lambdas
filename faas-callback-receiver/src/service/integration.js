const { AWS, buildResponse } = require('/opt/commons');

const config = require('../../config.json');
const log = require('/opt/log')(config);

const lambda = new AWS.Lambda();

const invoke = async (functionName, payload) => {
  log.debug('Payload :::', payload);
  let result = await lambda.invoke({
    FunctionName: config.function[functionName],
    Payload: JSON.stringify(payload),
  })
    .promise();

  if (result.StatusCode !== 200) {
    log.error('Result :::', JSON.stringify(result));
    throw buildResponse(500, { message: `Ocorreu um erro ao invokar a lambda ${functionName}` });
  }

  result = JSON.parse(result.Payload);
  result.body = result.body ? JSON.parse(result.body) : undefined;

  if (result.statusCode >= 400) {
    log.error('Status Code :::', result.statusCode);
    log.error('BODY :::', result.body);
    throw buildResponse(400, { status: result.statusCode, message: `${functionName} - ${JSON.stringify(result.body, null, 2)}` });
  } else return result;
};

const getCustomers = async (applicationUuid, document) => {
  log.debug('GET customers::', applicationUuid, document);
  const params = {
    service: {
      contentType: 'application/json',
      urlService: `/customers/${applicationUuid}?document=${document}`,
      method: 'GET',
    },
  };
  return await invoke('integration-service-internal', params);
};

module.exports = { getCustomers }