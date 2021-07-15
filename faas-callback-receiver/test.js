const { uuidv4 } = require('/opt/commons');
const { handler } = require('./index');
(async () => {

  let date = new Date()

  const event = {

    Records: [
      {
        messageId: uuidv4(),
        body: JSON.stringify({
          Type: "Notification",
          MessageId: uuidv4(),
          TopicArn: "arn:aws:sns:us-east-1:224387828024:partner-callback",
          Message: JSON.stringify({
            transactionType: 'OFFER_EFFECTED',
            contractNumber: 'OFW4MT1592939367984',
            applicationUuid: '00e1bf96-c7e3-4322-b1f0-6d308eb0333e',
            data: {
              operation: {
                uuid: uuidv4(),
                status: "VIGENTE",
                type: "EMPRESTIMO_PRIVADO",
                motive: "",
                requestedAmount: (Math.random() * (1500 - 100 + 1) + 100).toFixed(2),
                firstDeadLine: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                installments: Math.floor(Math.random() * (12 - 1 + 1) + 1),
                iof: 0,
                additionalIof: 0,
                internalRate: (Math.random() * (10 - 0.5 + 1) + 0.5).toFixed(2),
                monthRate: (Math.random() * (10 - 0.5 + 1) + 0.5).toFixed(2),
                yearRate: (Math.random() * (100 - 10 + 1) + 10).toFixed(2),
                monthCet: (Math.random() * (100 - 10 + 1) + 10).toFixed(2),
                yearCet: (Math.random() * (500 - 100 + 1) + 100).toFixed(2),
                totalIncome: (Math.random() * (1500 - 100 + 1) + 100).toFixed(2),
                totalInvestiment: (Math.random() * (1500 - 100 + 1) + 100).toFixed(2),
                totalInstallments: (Math.random() * (1500 - 100 + 1) + 100).toFixed(2),
                subTotal: (Math.random() * (500 - 100 + 1) + 100).toFixed(2),
                borrowerInstallmentsAmount: (Math.random() * (1500 - 100 + 1) + 100).toFixed(2),
                investorInstallmentsAmount: (Math.random() * (1500 - 100 + 1) + 100).toFixed(2),
                investorIr: (Math.random() * (500 - 100 + 1) + 100).toFixed(2),
                investorTotalIncome: (Math.random() * (1500 - 100 + 1) + 100).toFixed(2),
                investorDocument: "12714034802", //Math.floor(Math.random() * (99999999999 - 11111111111 + 1) + 11111111111),
                borrowerDocument: "12714034802"
              },
              installments: [
                {
                  number: Math.floor(Math.random() * (12 - 1 + 1) + 1),
                  dueDate: new Date(date.toISOString().slice(0, 10)),
                  daysOverDue: 0,
                  status: 'V',
                  debitBalance: (Math.random() * (1500 - 100 + 1) + 100).toFixed(2),
                  mainBalance: (Math.random() * (1500 - 100 + 1) + 100).toFixed(2),
                  commissionAmount: (Math.random() * (100 - 10 + 1) + 10).toFixed(2),
                  slipValue: (Math.random() * (1500 - 100 + 1) + 100).toFixed(2),
                  interestOverDueBalance: 0,
                  paymentLateBalance: 0,
                  iofOverDueBalance: 0,
                  penaltyBalance: 0,
                  principalPaid: 0,
                  interestPaid: 0,
                  penaltyPaid: 0,
                  otherValuesPaid: 0,
                  discount: 0,
                  value: (Math.random() * (1500 - 100 + 1) + 100).toFixed(2),
                  paidValue: (Math.random() * (1500 - 100 + 1) + 100).toFixed(2),
                  uuid: uuidv4(),
                  interestBalance: 0,
                  interestOverDuePaid: (Math.random() * (1500 - 100 + 1) + 100).toFixed(2)
                }
              ]
            }
          })
        }),
        attributes: {
          ApproximateReceiveCount: '1',
          SentTimestamp: `${new Date().getTime()}`,
          SenderId: 'AIDAIT2UOQQY3AUEKVGXU',
          ApproximateFirstReceiveTimestamp: `${new Date().getTime()}`,
        },
        eventSource: 'aws:sqs',
        eventSourceARN: 'arn:aws:sqs:us-east-1:224387828024:partner-callback',
      }
    ]
  }

  const result = await handler(event);
  result.body = (typeof result.body === 'string') ? JSON.parse(result.body) : result.body;
  console.log('result:', result);
})();