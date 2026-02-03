import { TransactionNotFoundError, TransactionUidNotFoundError } from "../errors/transaction-uid-not-found.error.js";
import { TransactionUidNotInformedError } from "../errors/transaction-uid-not-informed.error.js";
import { UserDoesntOwnTransactionError } from "../errors/user-doesnt-own-transaction.error.js";
import { UserNotInformedError } from "../errors/user-not-informed.error.js";
import { Transaction } from "../model.js"

describe("Transaction model", () => {

    const transactionRepositoryMock = {
        findByUserUid: () => Promise.resolve([
            {uid: "transaction1"}, {uid: "transaction2"}
        ])
    };

    describe("given find user by uid", () => {
        
        
    test("when user is not informed, then return error 500", async () => {
        const model = new Transaction();

        const response = model.findByUser();

        await expect(response).rejects.toBeInstanceOf(UserNotInformedError);
    })

    test("when user is not informed, then return error 500", async () => {
        const model = new Transaction();
        model.user = {};

        const response = model.findByUser();

        await expect(response).rejects.toBeInstanceOf(UserNotInformedError);
    })

    test("when user is informed, then return transactions", async () => {
        const model = new Transaction(transactionRepositoryMock);
        model.user = {uid: "anyUserUid"};

        const response = model.findByUser();

        await expect(response).resolves.toEqual([
            {uid: "transaction1"}, {uid: "transaction2"}
        ]);
    })

    describe("given find transaction by uid", () => {

        test("then return transaction", async () => {
            const model = new Transaction({
                findByUid: () => Promise.resolve(createTransaction())
            });
            model.uid = 1;
            model.user = {uid: "anyUserUid"};

            await model.findByUid();


            expect(model).toEqual(createTransaction());
        })

        test("when user doesnt own transaction, then return 403 error", async () => {
            const transactionDb = createTransaction();
            transactionDb.user = {uid: {uid: "anyOtherUserUid"}};
            
            const model = new Transaction({
                findByUid: () => Promise.resolve(transactionDb)
            });
            model.uid = 9;
            model.user = {uid: "anyUserUid"};

            await expect(model.findByUid()).rejects.toBeInstanceOf(UserDoesntOwnTransactionError);
        })

        test("when uid not present, then return error 500", async () => {
            const model = new Transaction();

            await expect(model.findByUid()).rejects.toBeInstanceOf(TransactionUidNotInformedError);
        })

        test("when transaction not found, then return error 404", async () => {
            const model = new Transaction({
                findByUid: () => Promise.resolve(null)
            });
            model.uid = 9;

            await expect(model.findByUid()).rejects.toBeInstanceOf(TransactionNotFoundError);
        })

        
    })

    describe("ginven create new transaction", () => {

        const params = {
            date: "anyDate",
            description: "anyDescription",
            money: {
                currency: "anyCurrency",
                value:10
            },
            transactionType: "Supermercado",
            type: "income",
            user: {
                uid: "anyUserUid"
            }
        };

        const repositoryMock = {
                _hasSaved: false,
                save() {
                    this._hasSaved = true;
                    return Promise.resolve({uid: 1});
                }
            }

        test("then return new transaction", async () => {
            const model = new Transaction(repositoryMock);

            await model.create(params);

            const newTransaction = createTransaction();

            expect(model).toEqual(newTransaction);
        })

        test("then save transaction" , async () => {
            
            
            const model = new Transaction(repositoryMock);

            await model.create(params);

            expect(repositoryMock._hasSaved).toBeTruthy();
        })

    })

    describe('given update transaction', () => {

        let repositoryMock;

        beforeEach(() => {
            repositoryMock = {
                _hasUpdated: false,
                findByUid() {
                    return Promise.resolve({user: {uid: "anyUserUid"}});
                },
                update() {
                    this._hasUpdated = true;
                    return Promise.resolve();
                }
            }
        })
        
        test("then return updated transaction", async () => {
            const model = new Transaction(repositoryMock);
            model.uid = 1;
            model.user = {uid: "anyUserUid"};
            
            const params = createTransaction();
            await model.update(params);

            const updatedTransaction = createTransaction();

            expect(model).toEqual(updatedTransaction);
        })
        
        test("then update transaction", async () => {
            const model = new Transaction(repositoryMock);
            model.uid = 1;
            model.user = {uid: "anyUserUid"};
            
            const params = createTransaction();
            await model.update(params);

            const updatedTransaction = createTransaction();

            expect(repositoryMock._hasUpdated).toBeTruthy();
        })
        
        test("when transaction doesnt belong to user, then return error", async () => {
            const model = new Transaction({
                findByUid: () => Promise.resolve({user: {uid: "anyOtherUserUid"}})
            });
            model.uid = 1;
            model.user = {uid: "anyUserUid"};
            
            const params = createTransaction();

            await expect(model.update(params)).rejects.toBeInstanceOf(UserDoesntOwnTransactionError);
        })
        
        test("when transaction doesnt exist, then return not found error", async () => {
            const model = new Transaction({
                findByUid: () => Promise.resolve(null)
            });
            model.uid = 1;
            model.user = {uid: "anyUserUid"};
            
            const params = createTransaction();

            await expect(model.update(params)).rejects.toBeInstanceOf(TransactionNotFoundError);
        })
    })

    describe("given delete transaction", () => {

        let repositoryMock;

        beforeEach(() => {
            repositoryMock = {
                _hasDeleted: false,
                delete(){
                    this._hasDeleted = true;
                    return Promise.resolve();
                },
                findByUid() {
                    return Promise.resolve({user: {uid: "anyUserUid"}});
                }
            }
        })

        test("when success, then delete transaction", async () => {
            const model = new Transaction(repositoryMock);

            model.uid = "anyUid";
            model.user = {uid: "anyUserUid"};

            await model.delete()

            expect(repositoryMock._hasDeleted).toBeTruthy();
        })

        test("when transaction doesnt belong to user, the return error", async() => {
            const model = new Transaction(repositoryMock);

            model.uid = "anyUid";
            model.user = {uid: "anyOtherUserUid"};

            await expect(model.delete()).rejects.toBeInstanceOf(UserDoesntOwnTransactionError);
        })

        test("when transaction doesnt exist, the return error", async() => {
            const model = new Transaction({
                findByUid: () => Promise.resolve(null)
            });

            model.uid = "anyUid";
            model.user = {uid: "anyOtherUserUid"};

            await expect(model.delete()).rejects.toBeInstanceOf(TransactionNotFoundError);
        })
    })


    function createTransaction() {
            const transaction = new Transaction();
            transaction.uid = 1;
            transaction.date = "anyDate";
            transaction.description = "anyDescription";
            transaction.money = {
                currency: "anyCurrency",
                value: 10
            };
            transaction.transactionType = "Supermercado";
            transaction.type = "income";
            transaction.user = {
                uid: "anyUserUid"
            }
            return transaction;
        }

    })
})
