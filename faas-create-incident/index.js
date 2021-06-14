const { buildResponse } = require('/opt/commons')
const axios = require('axios');

const config = require('./config.json');
const log = require('/opt/log')(config);

const username = config.azureDevops.username;
const personalToken = config.azureDevops.personalToken;
const basicAccess = username + ':' + personalToken;
const basicAccess64 = Buffer.from(basicAccess).toString("base64");

const createIncidentURL = config.azureDevops.createIncidentURL;

module.exports.handler = async (event) => {
  try {
    log.event(event);

    const body = JSON.parse(event.body);

    log.debug('Validating if it is an incident.');

    if (body.TopicGroupName.toUpperCase() === 'INCIDENTE SISTÊMICO') {

      const item = [
        {
          "op": "add",
          "path": "/fields/System.Title",
          "from": null,
          "value": body.Summary
        },
        {
          "op": "add",
          "path": "/fields/System.Description",
          "from": null,
          "value": body.DescriptionAsText
        },
        {
          "op": "add",
          "path": "/fields/System.AreaPath",
          "from": null,
          "value": config.azureDevops.fields.areaPath
        }
      ]

      const createIncident = {
        url: createIncidentURL,
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAccess64}`,
          'Content-Type': config.azureDevops.contentType
        },
        data: item
      }

      const response = await axios(createIncident);

      if (response.status === 200) return buildResponse(200, response);

    } else {
      log.error(event);
      return buildResponse(400, { message: 'The requisition is not a systemic incident! Check your subject category.' })
    }
  } catch (error) {
    log.error(error.message, error)
    return buildResponse(500, { message: `InternalServerError - ${error.message}` })
  }
}