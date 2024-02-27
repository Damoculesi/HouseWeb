finalTransactions = {}
balances = {A: -38, B: 18, C: 109, D: 45, E: -134}

/** 
 *  separate into 2 balances: giver and receiver
 *  if balance is negative--> receiver 
 *                positive--> giver
 *  and sort them from highest abs value to lowest.
 */
const separateAndSortAndProcessBalances = (balances) => {
    let receiverBalances = {};
    let giverBalances = {};
    for (let person in balances) {
        if (balances[person] < 0) {
            receiverBalances[person] = balances[person]; // Negative balance - receiver
        } else if (balances[person] > 0) {
            giverBalances[person] = balances[person]; // Positive balance - giver
        }
        // If the balance is zero, we do not need to include it as they are even
    }
    console.log(receiverBalances)
    console.log(giverBalances)
    // Sort giver balances from largest to smallest
    let sortedGivers = Object.entries(giverBalances).sort((a, b) => b[1] - a[1]);
    // Sort receiver balances from smallest to largest (more negative to less negative)
    let sortedReceivers = Object.entries(receiverBalances).sort((a, b) => a[1] - b[1]);
    console.log(sortedReceivers)
    console.log(sortedGivers)
    processTransactions(sortedGivers, sortedReceivers)
}
/** 
 *  simplify transactions
 *  by cancelling out givers and receivers
 */
const processTransactions = (sortedGivers, sortedReceivers) => {
    while (sortedGivers.length > 0 && sortedReceivers.length > 0) {
        let currentGiver = sortedGivers[0];
        let currentReceiver = sortedReceivers[0];

        // Compare the top items of the giver and receiver balances
        if (Math.abs(currentGiver[1]) <= Math.abs(currentReceiver[1])) {
            // If the giver amount is smaller than or equal to the receiver amount
            // Add the transaction
            addTransaction(currentGiver[0], currentReceiver[0], Math.abs(currentGiver[1]));
            //update receiver balance
            sortedReceivers[0][1] += sortedGivers[0][1];
            // Remove the giver from the giverBalances
            sortedGivers.shift();
        } else {
            // If the giver amount is greater than the receiver amount
            // Add the transaction
            addTransaction(currentGiver[0], currentReceiver[0], Math.abs(currentReceiver[1]));
            // Update the giver's balance
            sortedGivers[0][1] += sortedReceivers[0][1];
            // Remove the receiver from the receiverBalances
            sortedReceivers.shift();
        }
    }
}
/** 
 *  add eliminated transaction 
 *  to the final result list
 */
function addTransaction(giver, receiver, amount) {
    if (!finalTransactions[giver]) {
        finalTransactions[giver] = {};
    }
    if (!finalTransactions[giver][receiver]) {
        finalTransactions[giver][receiver] = 0
    }
    finalTransactions[giver][receiver] += amount;
}

separateAndSortAndProcessBalances(balances)
console.log(finalTransactions)