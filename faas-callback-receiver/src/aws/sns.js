'use strict';

const {
  AWS,
} = require('/opt/commons');
const { snsTopic: { 'notification-queue': notificationQueue } } = require('../../config.json');

const sns = new AWS.SNS();

module.exports = async (data) => {
  return sns.publish({
    Message: JSON.stringify(data),
    TopicArn: notificationQueue,
  }).promise();
}