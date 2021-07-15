const config = require('./../../config.json')
const log = require('/opt/log')(config)
const { notifications: { 'templatesEmail': template } } = require('../../config.json');

const { takerOfferEffectEmail, investorConfirmationOfferEffectEmail } = template
const moment = require('moment-timezone');
const sns = require('./../aws/sns')

module.exports.sendTakerOfferEffectEmail = (borrower, investor, contractNumber, body) => {

  const { channel, segmentType, title, version } = takerOfferEffectEmail
  const { givenName: investorGivenName } = investor.body
  const { givenName, email: emailBorrower } = borrower.body
  const { number, dueDate, value } = body.installments[0]

  const channels = {
    email: {
      channel: channel,
      segmentType: segmentType,
      title: title,
      version: version,
      toAddress: emailBorrower[0].email,
      data: {
        givenName: givenName,
        investorName: investorGivenName,
        contractNumber: contractNumber,
        requestedValue: body.operation.requestedAmount,
        effectedTime: moment().tz('America/Sao_Paulo').format('HH:mm'),
        effectedDate: moment().tz('America/Sao_Paulo').format('DD-MM-YYYY'),
        number: number,
        dueDate: dueDate,
        value: value,
        document: body.operation.borrowerDocument
      }
    }
  }
  const payloadBorrower = channels.email
  log.debug("sendTakerOfferEffectEmail :::", payloadBorrower)

  return sns(payloadBorrower)
}


module.exports.sendInvestorOfferEffectEmail = (investor, borrower, contractNumber, body) => {

  const { channel, segmentType, title, version } = investorConfirmationOfferEffectEmail
  const { givenName: takerGivenName } = borrower.body
  const { givenName, email: emailInvestor } = investor.body
  const { number, dueDate, value } = body.installments[0]

  const channels = {
    email: {
      channel: channel,
      segmentType: segmentType,
      title: title,
      version: version,
      toAddress: emailInvestor[0].email,
      data: {
        givenName: givenName,
        takerName: takerGivenName,
        contractNumber: contractNumber,
        number: number,
        dueDate: dueDate,
        value: value,
        document: body.operation.investorDocument
      }
    }
  }
  const payloadInvestor = channels.email
  log.debug("investorConfirmationOfferEffectEmail :::", payloadInvestor)

  return sns(payloadInvestor)
}