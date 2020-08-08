module.exports = function(transaction){
    console.log("====== C2B Transaction")
    console.log("\n\nAttempting transaction of " + process.env.TEST_AMOUNT + "MTs from: " + process.env.TEST_MSISDN)

    let purchase = {
        amount: process.env.TEST_AMOUNT,
        msisdn: process.env.TEST_MSISDN,
        reference: process.env.TEST_REFERENCE,
        third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
    }

    transaction.c2b(purchase)
        .then(function(response){
            console.log('Success on C2B transaction')
            console.log(response)
        })
        .catch(function(response){
            console.log('Error on C2B transaction')
            console.log(response)
        })

}