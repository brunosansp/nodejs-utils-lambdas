const { buildResponse, readTracking, updateTracking, errorTracking } = require('/opt/commons')

const config = require('./config.json')
const log = require('/opt/log')(config)

const handlers = {
  'OFFER_EFFECTED': require('./src/handlers/offerEffectHandler')
}

module.exports.handler = async (event) => {
  let message, body

  try {
    log.debug(JSON.stringify(event))

    if (event.Records && event.Records.length) message = { ...event.Records[0] }
    else throw buildResponse(500, { message: 'Mandatory attributes not found' })

    if (!await readTracking(message))
      throw { onGoing: true, message: `MessageID: ${message.messageId} - Message in process or already complete.` }

    body = JSON.parse(JSON.parse(message.body).Message)
    log.debug('BODY ::: ', JSON.stringify(body))

    const { transactionType, applicationUuid, contractNumber, data } = body

    if (!transactionType || !applicationUuid || !contractNumber || !applicationUuid)
      throw buildResponse(400, { message: 'Payload transactionType, applicationUuid, contractNumber or data is missing.' })

    const func = handlers[transactionType]
    if (!func)
      throw buildResponse(400, { message: '' })

    await func(applicationUuid, contractNumber, data)

    await updateTracking(message)

    return buildResponse(200, { message: `Notificação enviada com sucesso.` })

  } catch (error) {
    if (!error.onGoing && error.statusCode !== 200) {
      log.debug('Payload for errorTracking ::: ', JSON.stringify(body))
      await errorTracking(message, body, error)
    }
    log.error('[main error]', JSON.stringify(error))
    throw new Error(error)
  }
}