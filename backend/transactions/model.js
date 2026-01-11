import { TransactionRepository } from "./repository.js";

export class Transaction {

    date;
    description;
    moeny;
    transactionType;
    type;
    user;   

    #repository;

    constructor() {
        this.#repository = new TransactionRepository();
    }

    findByUser() {
        if(!this.user?.uid) {
            return Promise.reject({
                code: 500,
                message: "usuario nao informado"
            })
        }
        return this.#repository.findByUserUid(this.user.uid);
    }

}