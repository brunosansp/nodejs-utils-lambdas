const config = require('../config.json')
const log = require('/opt/log')(config)

const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.AWS_REGION })
const s3 = new AWS.S3();

const documentClient = new AWS.DynamoDB.DocumentClient({});

const moveFile = async (bucketOri, bucketDest, from, to) => {
  await s3.copyObject({
    Bucket: bucketDest,
    CopySource: `/${bucketOri}/${from}`,
    Key: to,
  }).promise();

  await s3.deleteObject({
    Bucket: bucketOri,
    Key: from,
  }).promise();
}

const getFile = async (nameFile, receivedDate) => {
  const { Item: file } = await documentClient.get({
    TableName: config.aws.tableName,
    Key: { nameFile, receivedDate },
  }).promise();
  log.debug('File ::: ', JSON.stringify(file));
  log.debug('LOG getFile ::: ', file)
  return file;
};

const putData = async (itemUpdate) => {
  const response = await documentClient.put({
    TableName: config.aws.tableName,
    Item: itemUpdate,
    ReturnValues: 'ALL_OLD'
  }).promise()
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.reject(err));
  return response;
}

module.exports = { getFile, putData, moveFile };