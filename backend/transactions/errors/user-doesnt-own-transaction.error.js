export class UserDoesntOwnTransactionError extends Error {

    constructor() {
        super("Usuario nao autorizado");
        this.name = "user-doesnt-own-transaction";
        this.code = 403;
    }
}