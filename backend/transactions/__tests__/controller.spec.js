import { TransactionController } from "../controller.js";

describe("Transaction controller", () => {

    let request;
    let response;

    beforeEach(() => {
        request = {};
        response = new ResponseMock();
    })

    test("given find transaction by user, when success, then return transaction", (done) => {
        const transactions = [{uid: 1}, {uid: 2}];

        const controller = new TransactionController({
            findByUser: () => Promise.resolve(transactions)
        });

        controller.findByUser(request, response).then (() => {
            expect(response._json).toEqual(transactions);
            done();
        });

    })

    test("given find transaction by user, when fail, then return error", (done) => {
        const error = {code: 500}

        const controller = new TransactionController({
            findByUser: () => Promise.reject(error)
        });

        controller.findByUser(request, response).then(() => {
            expect(response._json).toEqual(error);
            done();
        })
    })

    test("given find transaction by user, when fail, then return error status 500", (done) => {
        const error = {code: 500}

        const controller = new TransactionController({
            findByUser: () => Promise.reject(error)
        });

        controller.findByUser(request, response).then(() => {
            expect(response._status).toEqual(500);
            done();
        })
    })

    describe("given find transaction by uid", () => {
        test("given success, then return status 200", async () => {
            const controller = new TransactionController({
                findByUid: () => Promise.resolve()
            });

            const request = {params: {uid: 1}};
            const response = new ResponseMock();


            await controller.findByUid(request, response);

            expect(response._status).toEqual(200);
        })

        
        test("given success, then return transaction", async () => {
            const transaction = {
                findByUid: () => Promise.resolve()
            }

            const controller = new TransactionController(transaction);

            const request = {params: {uid: 1}};
            const response = new ResponseMock();


            await controller.findByUid(request, response);

            expect(response._json).toEqual(transaction);
        })

        test("when fail, then return error status", async () => {
            const controller = new TransactionController({
                findByUid: () => Promise.reject({code: 500})
            });

            const request = {params: {uid: 1}};
            const response = new ResponseMock();


            await controller.findByUid(request, response);

            expect(response._status).toEqual(500);

        })

        test("when fail, then return error status", async () => {
            const controller = new TransactionController({
                findByUid: () => Promise.reject({code: 500})
            });

            const request = {params: {uid: 1}};
            const response = new ResponseMock();


            await controller.findByUid(request, response);

            expect(response._json).toEqual({code: 500});

        })

        
    })

    describe("given create new transaction", () => {

        test("when success, then return status 200", async () => {
            const controller = new TransactionController({
                create: () => Promise.resolve()
            });

            const request = {body: {}};

            const response = new ResponseMock();

            await controller.create(request, response);

            expect(response._status).toEqual(200);
        })

        test("when success, then return transaction", async () => {
            const transaction = {
                create: () => Promise.resolve()
            };
            const controller = new TransactionController(transaction);

            const request = {body: {}};

            const response = new ResponseMock();

            await controller.create(request, response);

            expect(response._json).toEqual(transaction);
        })

        test("then transaction should belong to user on request", async () => {
            const transaction = {
                create: () => Promise.resolve()
            };
            const controller = new TransactionController(transaction);

            const request = {body: {}, user: {uid: "anyUserUid"}};

            const response = new ResponseMock();

            await controller.create(request, response);

            expect(response._json.user).toEqual({uid: "anyUserUid"});
        })

        test("when fail, then return error status", async () => {
            const controller = new TransactionController({
                create: () => Promise.reject({code: 500})
            });

            const request = {body: {}};

            const response = new ResponseMock();

            await controller.create(request, response);

            expect(response._status).toEqual(500);
        })

        test("when fail, then return error", async () => {
            const controller = new TransactionController({
                create: () => Promise.reject({code: 500})
            });

            const request = {body: {}};

            const response = new ResponseMock();

            await controller.create(request, response);

            expect(response._json).toEqual({code: 500});
        })

    describe("given update transaction", () => {
        const user = {uid: "anyUserUid"};
        const request = {params: {uid: 1}, user};
        

        let response;

        let model;

        beforeEach(() => {
            response = new ResponseMock();
            model = {
                _hasUpdated: false,
                update() {
                    this._hasUpdated = true;
                    return Promise.resolve();
                }
            };
        }) 

        test("when success, then return status 200", async () => {
            const controller = new TransactionController(model);
            
            await controller.update(request, response);

            expect(response._status).toEqual(200);
        }) 
        
        test("when success, then return updated transaction", async () => {
            const controller = new TransactionController(model);
            
            await controller.update(request, response);

            expect(response._json).toEqual(model);
        }) 
        
        test("then transaction should belong to user on request", async () => {
            const controller = new TransactionController(model);
            
            await controller.update(request, response);

            expect(response._json.user).toEqual(user);
        }) 
        
        test("then transaction should have uid from request", async () => {
            const controller = new TransactionController(model);
            
            await controller.update(request, response);

            expect(response._json.uid).toEqual(1);
        }) 
        
        test("then update transaction", async () => {
            const controller = new TransactionController(model);
            
            await controller.update(request, response);

            expect(model._hasUpdated).toBeTruthy();
        }) 

        test("when fail, then return error status", async () => {
            const controller = new TransactionController({
                update: () => Promise.reject({code: 500})
            });
            
            await controller.update(request, response);

            expect(response._status).toEqual(500);
        }) 

        test("when fail, then return error", async () => {
            const controller = new TransactionController({
                update: () => Promise.reject({code: 500})
            });
            
            await controller.update(request, response);

            expect(response._json).toEqual({code: 500});
        }) 
    })


    })

    class ResponseMock {
        _json = null;
        _status = 0;
        json(value) {
            this._json = value;
        }
        status(value) {
            this._status = value;
            return this;
        }

    }

})