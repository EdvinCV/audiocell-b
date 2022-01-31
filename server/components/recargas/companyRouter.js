const express = require('express');
const companyRouter = express.Router();
// Express Validator
const {body} = require('express-validator');
// Controllers
const {getCompanies} = require('./companyController');

companyRouter
    .get('/', getCompanies)

module.exports = companyRouter;