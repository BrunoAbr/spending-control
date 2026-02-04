import admin from 'firebase-admin';

export class TransactionRepository {

    findByUserUid(uid) {
        return admin.firestore().collection("transactions").where('user.uid', '==', uid).orderBy('date', 'desc').get().then(snapshot => {
                return snapshot.docs.map(doc => ({
                    ...doc.data(),
                    uid: doc.id
                }))
            })
    }

    findByUserAndMonth(uid, year, month) {

        return admin.firestore().collection('transactions')
            .where('user.uid', '==', uid)
            .orderBy('date', 'desc') // ainda funciona para strings ISO
            .get()
            .then(snapshot => {
            const transactions = snapshot.docs.map(doc => ({
                ...doc.data(),
                uid: doc.id
            }));

            // filtra pelo mês/ano
            return transactions.filter(t => {
                const [y, m] = t.date.split('-').map(Number);
                return y === year && m === month;
            });
            });
        }
    
    findByUid(uid) {
        return admin.firestore().collection("transactions").doc(uid).get().then(snapshot => snapshot.data())
    }

    save(transaction) {
        return admin.firestore().collection("transaction").add(JSON.parse(JSON.stringify(transaction))).then(response => ({uid: response.id}));
    }

    update(transaction) {
        return admin.firestore().collection("transactions").doc(transaction.uid).update( {
            date: transaction.date,
            description: transaction.description,
            money: transaction.money,
            transactionType: transaction.transactionType,
            type: transaction.type

        })
    }

    delete(transaction) {
        return admin.firestore().collection("transactions").doc(transaction.uid).delete();
    }
}