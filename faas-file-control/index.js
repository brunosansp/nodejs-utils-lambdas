const { getFile, putData, moveFile } = require('./src/controller')
const { buildResponse } = require('/opt/commons');
const momentTimezone = require('moment-timezone');

const config = require('./config.json');
const log = require('/opt/log')(config);

module.exports.handler = async function (event) {
  let data

  const status = Object.freeze({
    RECEIVED: 'RECEIVED',
    PROCESSED: 'PROCESSED',
    ERROR: 'ERROR',
    REPROCESSED: 'REPROCESSED'
  })

  try {
    log.debug('LOG event ::: ', JSON.stringify(event))

    if (event.Records && event.Records.length) data = { ...event.Records[0] }
    else data = event.body ? JSON.parse(event.body) : event

    const receivedDate = data.eventTime.substring(0, 10);
    const processedDate = momentTimezone().tz('America/Sao_Paulo').format('YYYY-MM-DD');
    const reprocessedDate = momentTimezone().tz('America/Sao_Paulo').format('YYYY-MM-DD');
    const processedTimestamp = momentTimezone().tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss.sss');
    const receivedTimestamp = momentTimezone().tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss.sss');
    const reprocessedTimestamp = momentTimezone().tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss.sss');

    log.debug('LOG data ::: ', data);
    log.debug('LOG data.s3.bucket ::: ', data.s3.bucket);
    log.debug('LOG data.s3.object ::: ', data.s3.object);

    const pathFile = data.s3.object.key
    const bucket = data.s3.bucket.name
    const [, destructuredPathFile] = data.s3.object.key.split('/');
    const destructuredNameFile = destructuredPathFile.split('.');
    const nameFile = destructuredNameFile[0].toUpperCase();
    const fileType = destructuredNameFile[1].toUpperCase();

    const response = await getFile(nameFile, receivedDate, fileType);
    console.log(response)

    const itemReceived = { nameFile, receivedDate, fileType, status: status.RECEIVED, receivedTimestamp }

    const itemProcessed = {
      nameFile,
      receivedDate,
      fileType,
      receivedTimestamp: response && response.receivedTimestamp ? response.receivedTimestamp : null,
      processedDate,
      status: status.PROCESSED,
      processedTimestamp
    }

    const itemError = {
      nameFile,
      receivedDate,
      processedDate,
      fileType,
      status: status.ERROR,
      receivedTimestamp: response && response.receivedTimestamp ? response.receivedTimestamp : null,
      processedTimestamp
    }

    const itemReprocessed = {
      nameFile,
      fileType,
      receivedDate: response && response.receivedDate ? response.receivedDate : null,
      receivedTimestamp: response && response.receivedTimestamp ? response.receivedTimestamp : null,
      reprocessedDate,
      reprocessedTimestamp,
      status: status.REPROCESSED
    }

    const itemReprocessedAfterError = {
      nameFile,
      fileType,
      receivedDate: response && response.receivedDate ? response.receivedDate : null,
      receivedTimestamp: response && response.receivedTimestamp ? response.receivedTimestamp : null,
      processedDate: response && response.processedDate ? response.processedDate : null,
      processedTimestamp: response && response.processedTimestamp ? response.processedTimestamp : null,
      reprocessedDate,
      reprocessedTimestamp,
      status: status.REPROCESSED
    }

    if (pathFile.startsWith('received/')) {
      if (response) {
        if (response.status.toUpperCase() === status.RECEIVED)
          throw buildResponse(400, { message: 'Ítem já recebido anteriormente!' });
        if ([status.PROCESSED, status.REPROCESSED].indexOf(response.status.toUpperCase()) > -1)
          throw buildResponse(400, { message: 'Já processado anteriormente!' })
        if (response.status.toUpperCase() === status.ERROR) {
          await putData(itemError);
          return buildResponse(200, { itemError, message: 'Arquivo recebido com erro!' });
        }
      }
      await putData(itemReceived);
      const checkMask = new RegExp(`^received/${config.slipProcessMask}`)
      console.log(data.s3.object.key)
      if (checkMask.exec(data.s3.object.key)) {
        console.log('aqui')
        const bucketOri = bucket
        const bucketDest = bucket
        await moveFile(bucketOri, bucketDest, pathFile, pathFile.replace('received/', 'slip-process/'))
        console.log('success')
      }
      return buildResponse(201, itemReceived);
    }

    if (pathFile.startsWith('processed/')) {
      if (response) {
        if ([status.PROCESSED, status.REPROCESSED].indexOf(response.status.toUpperCase()) > -1)
          throw buildResponse(400, { message: 'Já processado anteriormente!' });
        if (response.status.toUpperCase() === status.RECEIVED) {
          await putData(itemProcessed);
          return buildResponse(200, { itemProcessed, message: 'Processado com sucesso!' });
        }
        if (response.status.toUpperCase() === status.ERROR) {
          await putData(itemReprocessedAfterError);
          return buildResponse(200, { itemReprocessed, message: 'Reprocessado com sucesso!' });
        }
      }
      await putData(itemProcessed);
      return buildResponse(201, { itemProcessed, message: 'Processado com sucesso! OBS: Fluxo errado.' });
    }

    if (pathFile.startsWith('error/')) {
      if (response) {
        if ([status.PROCESSED, status.REPROCESSED].indexOf(response.status.toUpperCase()) > -1)
          throw buildResponse(400, { message: 'Já processado anteriormente!' });
        if (response.status.toUpperCase() === status.RECEIVED) {
          await putData(itemError);
          throw buildResponse(200, { message: 'Registro com erro!' });
        }
      }
      await putData(itemError);
      throw buildResponse(201, { message: 'Arquivo recebido com status ERROR.' });
    }
  } catch (err) {
    console.log(err);
  }
}