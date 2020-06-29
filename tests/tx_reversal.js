module.exports = async function(transaction){
    console.log("====== Reversing a transaction")

    let transaction_to_reverse = {
        amount: process.env.TEST_AMOUNT,
        transaction_id: process.env.TEST_TRANSACTION_ID,
        third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
    }
    
    await transaction.reverse(transaction_to_reverse)
        .then(function(response){
            console.log('Success on Transaction Reversal')
            console.log(response)
        })
        .catch(function(response){
            console.log('Error on Transaction Reversal')
            console.log(response)
        })
}