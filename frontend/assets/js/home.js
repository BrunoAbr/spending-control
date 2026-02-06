function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html";
    }).catch(() => {
        alert("Erro ao fazer logout");
    })
}

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        user.getIdToken().then(token => {}); 
        findTransactions(user);
    }
})

function newTransaction() {
    window.location.href = "../transaction/transaction.html";
}

function findTransactions(user) {
    showLoading();
    const [selectDateYear, selectDateMonth] = selectDate()
    transactionService.findByUserAndMonth(selectDateYear, selectDateMonth).then(transactions => {
        hideLoading();
        addTransactionsToScreen(transactions.transactions);
        addSummaryValueToScreen(transactions.summary);
    }).catch(error => {
        hideLoading();
        console.log(error);
        alert('Erro ao recuperar transações!');
    }
    )
}



function addTransactionsToScreen(transactions) {
    const orderedList = document.getElementById('transactions');

    transactions.forEach(transaction => {
        const li = createTransactionListItem(transaction);
        li.appendChild(createDeleteButton(transaction));
        li.appendChild(createParagraph(formatDate(transaction.date)))
        li.appendChild(createParagraph(formatMoney(transaction.money)));
        li.appendChild(createParagraph(transaction.type));

        if (transaction.description) {
            li.appendChild(createParagraph(transaction.description));
        }

        orderedList.appendChild(li);
    });
}

function createTransactionListItem(transaction) {
    const li = document.createElement('li');
        li.classList.add(transaction.type);
        li.id = transaction.uid;
        li.addEventListener('click', () => {
            console.log(transactions)
            window.location.href = "../transaction/transaction.html?uid=" + transaction.uid;
        })
        return li;
}


function createDeleteButton(transaction) {
    const deleteButton = document.createElement('button');
        deleteButton.innerHTML = "Remover";
        deleteButton.classList.add("outline", "danger")
        deleteButton.addEventListener("click", event => {
            event.stopPropagation();
            askRemoveTransaction(transaction);
        })
    return deleteButton;
}

function createParagraph(value) {
    const element = document.createElement('p');
        element.innerHTML = value;
        return element;
}


function askRemoveTransaction(transaction) {
    const shouldRemove = confirm("Deseja remover a transação?")
    if (shouldRemove) {
        removeTransaction(transaction);
    }

}

function removeTransaction(transaction) {
    showLoading();
    transactionService.remove(transaction).then(() => {
        hideLoading();
        document.getElementById(transaction.transactions.uid).remove();
    }).catch(error => {
        hideLoading();
        console.log(error);
        alert("Erro ao remover transação");
    })
}

function formatMoney(money) {
    return `${money.currency} ${money.value.toFixed(2)}`
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-br', {timeZone: 'UTC'});
}

function onChangeDate() {
    findTransactions();
}

function selectDate() {
    cleanTransactionToScreen()
    const selectedDate = document.querySelector("input[type='month']").value;
    const [selectDateYear, selectDateMonth] = selectedDate.split("-");
    return [selectDateYear, selectDateMonth];
}

function cleanTransactionToScreen() {
    const ol = document.getElementById("transactions");
    ol.innerHTML = "";
}



function addSummaryValueToScreen(summary) {
    const income = document.getElementById("income-value").textContent = `R$ ${formatToMoney(summary.income)}`;
    const expense = document.getElementById("expense-value").textContent = `R$ ${formatToMoney(summary.expense)}`;
    const balance = document.getElementById("balance-value").textContent = `R$ ${formatToMoney(summary.balance)}`;
    console.log(summary)
}

function formatToMoney(value) {
    const money = value.toLocaleString('pt-br', {minimumFractionDigits: 2});
    return money
}