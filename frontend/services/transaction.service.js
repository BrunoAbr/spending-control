const transactionService = {
    findByUser: () => {
        return callAPI({
            method: "GET",
            url: "http://localhost:3000/transactions"
        })
    },
    findByUid: uid => {
        return callAPI({
            method: "GET",
            url: `http://localhost:3000/transactions/${uid}`
        })
    },
    findByUserAndMonth: (year, month) => {
        return callAPI({
            method: "GET",
            url: `http://localhost:3000/transactions/${year}/${month}`,
        })
    },
    remove: transaction => {
        return callAPI({
            method: "DELETE",
            url: `http://localhost:3000/transactions/${transaction.uid}`
        })
    },
    save: transaction => {
        return callAPI({
            method: "POST",
            url: `http://localhost:3000/transactions`,
            params: transaction
        })
    },
    update: transaction => {
        return callAPI({
            method: "PATCH",
            url: `http://localhost:3000/transactions/${transaction.uid}`,
            params: transaction
        })
    }
}

function callAPI({method, url, params}) {
    return new Promise(async (resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(
            method,
            url,
            true
        );
        xhr.setRequestHeader("Authorization", await firebase.auth().currentUser.getIdToken())
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
            const json = JSON.parse(this.responseText);
            if(this.status != 200) {
                    reject(json);
                }else {
                    resolve(json);
                }
            } 
        };

        xhr.send(JSON.stringify(params));
    })
}