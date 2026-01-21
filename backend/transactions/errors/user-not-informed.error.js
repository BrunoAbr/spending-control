export class UserNotInformedError extends Error {

    constructor() {
        super("Usuario nao informado");
        this.name = "user-not-informed";
        this.code = 500;
    }

}