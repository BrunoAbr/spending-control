export class TransactionNotFoundError extends Error {

    constructor() {
        super("Tranasacao nao encontrado")
        this.name = "transaction-uid-not-found";
        this.code = 404;
    }


}