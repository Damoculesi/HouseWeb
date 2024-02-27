const numParticipantsPage = document.getElementById('num-participants-page');
const numParticipantsInput = document.getElementById('num-participants');
const numSubmitBtn = document.getElementById('num-submit');
const namesPage = document.getElementById('participants-names-page');
const expensePage = document.getElementById('expenses');
const payer = document.getElementById('payer');
const amount = document.getElementById('amount');
const debtorsSelect = document.getElementById('debtors');
const expenseSubmitBtn = document.getElementById('expense-submit-button');
const confirmPage = document.getElementById('confirmation-page')
const addMoreBtn = document.getElementById('add-more');
const calcTotalBtn = document.getElementById('calculate-total');
const resultPage = document.getElementById('result-page')
const debtorsDiv = document.getElementById('debtors');
const payerDiv = document.getElementById('payer');
const nameInputs = document.getElementsByClassName('participant-name');

const namesSubmitButton =document.getElementById("names-submit")

let participantNames = [];
let balances = {};
let finalTransactions = {};
let expenses = {};
let numParticipants = 0

//-------number of participants functions
const checkValidNum = () => {
    // Validate the number of participants
    if (numParticipants <= 0) {
        alert('Please enter a valid number of participants.');
        return;
    }
    
}
const createParticipantInputs = numParticipants => {
    // Clear the namesPage
    namesPage.innerHTML = '';

    const namesLabel = document.createElement('label');
    namesLabel.textContent = "Names of participants: "
    namesPage.appendChild(namesLabel)

    // Create the specified number of nameInput elements for participant names
    for (let i = 0; i < numParticipants; i++) {
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'participant-name'; // Use a class to style the inputs if needed
        nameInput.id = `participant-${i+1}`
        nameInput.placeholder = `Participant ${i + 1} Name`;
        nameInput.required = true; // Make the nameInput field required to ensure a name is entered
        namesPage.appendChild(nameInput);
    }

    // Create a submit button for participant names
    const namesSubmitButton = document.createElement('button');
    namesSubmitButton.type = 'button'; // Use 'button' if you will handle the click event with JavaScript
    namesSubmitButton.id = 'names-submit';
    namesSubmitButton.textContent = 'Submit Names';
    namesPage.appendChild(namesSubmitButton);

    namesSubmitButton.addEventListener('click', () => {
        collectNames();
        changeDisplay1To2(namesPage, expensePage);
        createPayerRadioButtons(participantNames);
        createDebtorCheckboxes(participantNames);});
}

//-------names functions
const collectNames =() => {
    for (let input of nameInputs) {
        if (input.value.trim() !== '') {
            participantNames.push(input.value.trim());
        }
    }
}

function createDebtorCheckboxes(names) {
    // Clear previous checkboxes if they exist
    debtorsDiv.innerHTML = '<p>split with:</p>';

    // Create a checkbox for each participant name
    names.forEach((name, index) => {
        const label = document.createElement('label');
        label.style.display = 'block'; // Ensures each checkbox appears on a new line

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'debtor-options';
        checkbox.className = 'split-with-participants'
        checkbox.value = name; // Use the participant's name as the value

        label.appendChild(checkbox);

        const labelText = document.createTextNode(` ${name}`);
        label.appendChild(labelText);

        debtorsDiv.appendChild(label);
    });
}

function createPayerRadioButtons(names) {
    // Clear previous radio buttons if they exist
    payerDiv.innerHTML = '<p>paid by:</p>';

    // Create a radio button for each participant name
    names.forEach((name, index) => {
        const label = document.createElement('label');

        const radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.name = 'payer-options';
        radioButton.value = name; // Use the participant's name as the value

        label.appendChild(radioButton);

        const labelText = document.createTextNode(` ${name}`);
        label.appendChild(labelText);

        const lineBreak = document.createElement('br');

        payerDiv.appendChild(label);
        payerDiv.appendChild(lineBreak);
    });
}

//-------universal functions
const changeDisplay1To2 = (display1, display2) => {
    display1.classList.add('hide'); // hide 
    display2.classList.remove('hide'); // show 
}

//-------expenses chart building functions
const calculateFn = () => {
    const totalAmount = parseInt(amount.value);
    console.log("total amount for current expense: " + totalAmount)

    let splitWithParticipants = [];
    const checkBoxes = document.querySelectorAll(".split-with-participants");
    checkBoxes.forEach(checkbox => {
        if (checkbox.checked) {
            splitWithParticipants.push(checkbox.value);
        }
    });

    console.log("Who are associated with this expense: " + splitWithParticipants)
    // Extract the payer name:
    const selectedPayerName = document.querySelector('input[name="payer-options"]:checked').value;
    console.log("payer: " + selectedPayerName)
    const numOfPeople = splitWithParticipants.length;
    const pricePerParticipant = totalAmount / numOfPeople;

    // Initialize payer object if not already present
    if (!expenses[selectedPayerName]) {
        expenses[selectedPayerName] = {};
    }

    // Ensure the payer is not included in the splitWithParticipants array
    splitWithParticipants = splitWithParticipants.filter(debtor => debtor !== selectedPayerName);

    // Add each debtor to the payer's object, excluding the payer.
    splitWithParticipants.forEach(debtor => {
        if (!expenses[selectedPayerName][debtor]) {
            expenses[selectedPayerName][debtor] = 0;
        }
        // Exclude the payer
        expenses[selectedPayerName][debtor] += pricePerParticipant;
    });
    console.log("expenses chart below: ")
    console.log(expenses)
}

//-------reduce transactions functions

/** 
 *  uses the expenses chart to 
 *  simplify to individual balances 
 */
const calculateBalances = () => {
    for(let payer in expenses){
        balances[payer] = 0;
    }
    for (let payer in expenses) {
        for (let debtor in expenses[payer]) {
            let amount = expenses[payer][debtor];
            balances[payer] -= amount; // Subtract from sender
            balances[debtor] = (balances[debtor] || 0) + amount; // Add to debtor
        }
    }
    console.log("balances for each person below")
    console.log(balances)
    separateAndSortAndProcessBalances(balances)
}
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
    console.log("sorted receiver balance: " + sortedReceivers)
    console.log("sorted giver balance: " + sortedGivers)
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

//------result functions
function displayTransactions(transactions) {

    let transactionList = '<div style="line-height:1.6;">Final Results:<br>';

    // Create a counter for transaction numbering
    let counter = 1;

    for (const giver in transactions) {
        for (const receiver in transactions[giver]) {
            const amount = transactions[giver][receiver].toFixed(2);
            transactionList += `<div>${counter}. <span style="border:1px solid #000; padding:2px;"><strong>${giver}</strong></span> owes <span style="border:1px solid #000; padding:2px;"><strong>${receiver}</strong></span> <span style="border:1px solid #000; padding:2px;"><strong>$${amount}</strong></span></div>`;
            counter++;
        }
    }

    transactionList += '</div>';
    resultPage.innerHTML = transactionList;
}
const resultFn = () => {
    calculateBalances();
    console.log("final transaction(s) need to be made: " + finalTransactions);
    displayTransactions(finalTransactions);
}




//--------------SUBMIT BUTTONS------------------------

//1st page ---NUM of PARTY---
numSubmitBtn.addEventListener('click', () => {
    numParticipants = parseInt(numParticipantsInput.value, 10);
    checkValidNum();
    changeDisplay1To2(numParticipantsPage, namesPage);
    createParticipantInputs(numParticipants);
    console.log("User inputted " + numParticipants +" participants")
});

//2nd page ---NAMES---
//inside the createParticipantInputs function

//3rd page ---EXPENSE---
expenseSubmitBtn.addEventListener('click', ()=>{
    changeDisplay1To2(expensePage, confirmPage);
    calculateFn();
})

//4th page ---CONFIRMATION---
addMoreBtn.addEventListener('click', () => {
    changeDisplay1To2(confirmPage, expensePage)
});
calcTotalBtn.addEventListener('click', () => {
    changeDisplay1To2(confirmPage, resultPage)
    resultFn();
});

//5th page ---RESULT---
//no button here
