if (!isNewTransaction()) {
    const uid = getTransactionUid();
    findTransactionByUid(uid);
}

function getTransactionUid() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('uid');
}

function isNewTransaction() {
    return getTransactionUid() ? false : true;
}

function findTransactionByUid(uid) {
    showLoading();

    firebase.firestore().collection('transactions').doc(uid).get().then(doc => {
        hideLoading();
        if (doc.exists) {
            fillTransactionScreen(doc.data());
            toggleSaveButtonDisable();
        } else {
            alert("Documento não encontrado");
            window.location.href = "../home/home.html";
        }
    }). catch(() => {
        hideLoading();
        alert("Erro ao recuperar documento");
        window.location.href = "../home/home.html";
    });
}

function fillTransactionScreen(transaction) {
    if (transaction.type == "expense") {
        form.typeExpense().checked = true;
    } else {
        form.typeIncome().checked = true;
    }

    form.date().value = transaction.date;
    form.currency().value = transaction.money.currency;
    form.value().value = transaction.money.value;
    form.transactionType().value = transaction.transactionType;

    if (transaction.description) {
        form.description().value = transaction.description;
    }
}



function saveTransaction() {
    

    const transaction = createTransaction();
    if (isNewTransaction()) {
        save(transaction);
    } else {
        update(transaction);
    }
    
    
}

function save(transaction) {
    showLoading();
    firebase.firestore().collection('transactions').add(transaction).then (() => {
        hideLoading();
        window.location.href = "../home/home.html";
    }). catch(() => {
        hideLoading();
        alert("Erro ao salvar transação")
    }).catch(() => {
        hideLoading();
        alert("Erro ao atualizar transação");
    });
}

function update(transaction) {
    showLoading();
    firebase.firestore().collection("transactions").doc(getTransactionUid()).update(transaction).then(() => {
        hideLoading();
        window.location.href = "../home/home.html";
    })
}

function createTransaction() {
    return {
        type: form.typeExpense().checked ? "expense" : "income",
        date: form.date().value,
        money: {
            currency: form.currency().value,
            value: parseFloat(form.value().value)
        },
        transactionType: form.transactionType().value,
        description: form.description().value,
        user: {
            uid: firebase.auth().currentUser.uid
        }
    };
}

function onChangeDate() {
    const date = form.date().value;
    form.dateRequiredError().style.display = !date ? "block" : "none";
    toggleSaveButtonDisable();
}

function onChangeValue() {
    const value = form.value().value;
    form.valueRequiredError().style.display = !value ? "block" : "none";

    form.valueLessOrEqualToZeroError().style.display = value <= 0 ? "block" : "none";
    toggleSaveButtonDisable();
}

function onChangeTransactionType() {
    const transactionType = form.transactionType().value;
    form.transactionTypeRequiredError().style.display = !transactionType ? "block" : "none";
    toggleSaveButtonDisable();
}

function toggleSaveButtonDisable() {
    form.saveButton().disabled = !isFormValid();
}

function isFormValid() {
    const date = form.date().value;
    if (!date) {
        return false;
    }

    const value = form.value().value;
    if (!value || value <=0) {
        return false;
    }

    const transactionType = form.transactionType().value;
    if (!transactionType) {
        return false;
    }
    return true;
}

const form = {
    date: () => document.getElementById('date'),
    dateRequiredError: () => document.getElementById('date-required-error'),
    saveButton: () => document.getElementById('save-button'),
    value: () => document.getElementById('value'),
    valueRequiredError: () => document.getElementById('value-required-error'),
    valueLessOrEqualToZeroError: () => document.getElementById('value-less-or-equal-to-zero-error'),
    transactionType: () => document.getElementById('transaction-type'),
    transactionTypeRequiredError: () => document.getElementById('transaction-type-required-error'),
    typeExpense: () => document.getElementById('expense'),
    typeIncome: () => document.getElementById('income'),
    currency: () => document.getElementById('currency'),
    description: () => document.getElementById('description')
}