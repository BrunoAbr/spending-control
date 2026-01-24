import { TransactionNotFoundError, TransactionUidNotFoundError } from "../errors/transaction-uid-not-found.error.js";
import { TransactionUidNotInformedError } from "../errors/transaction-uid-not-informed.error.js";
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
            await model.findByUid();


            expect(model).toEqual(createTransaction());
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
})
