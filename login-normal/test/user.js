let User = require('../models/User');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app.js');
let should = chai.should();
let fs = require('fs');

chai.use(chaiHttp);

describe('User',() => {

    before((done) => {
        User.remove({}).then(() => {
            const user = {
                email: "marco@gmail.com",
                password: "123456",
                name: "Marco",
                lastname: "lastname"
            }
    
            chai.request(server)
                .post("/user")
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(user)
                .end((err, res) => {
                    done();
                })
        })
    })

    describe('test', () => {
        it('it should login an user',function (done) {
            const user = {
                email: 'marco@gmail.com',
                password: '123456'
            };

            chai.request(server)
                .post('/login')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(user)
                .end((err,res) => {
                    res.should.have.status(200);
                    res.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name');
                    res.body.should.have.property('email');
                    res.body.should.have.property('lastname');
                    done();
                });
        });
    })
})
