const config = require('./../../config.json')
const log = require('/opt/log')(config)

const notificationService = require('../notifications/email')
const { getCustomers } = require('../service/integration')

module.exports = async (applicationUuid, contractNumber, data) => {
  const borrowerDocument = data.operation.borrowerDocument
  const investorDocument = data.operation.investorDocument

  const borrower = await getCustomers(applicationUuid, borrowerDocument)
  if (!Object.keys(borrower).length) return buildResponse(204, {})

  const investor = await getCustomers(applicationUuid, investorDocument)
  if (!Object.keys(investor).length) return buildResponse(204, {})

  log.debug('Enviando e-mail para o Tomador.')
  await notificationService.sendTakerOfferEffectEmail(borrower, investor, contractNumber, data)

  log.debug('Enviando e-mail para o Investidor.')
  await notificationService.sendInvestorOfferEffectEmail(investor, borrower, contractNumber, data)
}