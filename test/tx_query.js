module.exports = async function(transaction){
    console.log("===== Querying Transaction status")
    let transaction_query = {
        query_reference: process.env.TEST_QUERY_REFERENCE,
        third_party_reference: process.env.TEST_THIRD_PARTY_REFERENCE
    }
    await transaction.query(transaction_query)
        .then(function(response){
            console.log('Success on Transaction Query')
            console.log(response)
        })
        .catch(function(response){
            console.log('Error on Transaction Query')
            console.log(response)
        })

}