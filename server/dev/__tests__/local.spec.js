const express = require('express');
const supertest = require('supertest');
import { expect } from 'chai';



const basicTester = express();


describe('Testing CRUD OP', () => {
    let request;

    before(() => {
        request = supertest(basicTester);
    });
    
    it("should return with data", async () => {
        const response = await request.get('/products');
        expect(response.status).to.equal(200);
    })

});

