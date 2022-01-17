const express = require('express');
const userRouter = express.Router();
// Express Validator
const {body} = require('express-validator');
// Controllers
const {getUsersController, loginUserController, registerUserController, putUserController, getMeController, deleteUserController} = require('./userController');

userRouter
    .get('/', getUsersController)
    .post('/me', getMeController)
    .post('/', [
            body('name').not().isEmpty(),
            body('username').not().isEmpty(),
            body('password').not().isEmpty(),
            body('rol').not().isEmpty()
        ], 
        registerUserController)
    .put('/', [
            body('name').not().isEmpty(),
            body('username').not().isEmpty(),
            body('rol').not().isEmpty()
        ],
        putUserController)
    .post('/login', [
            body('username').not().isEmpty(),
            body('password').not().isEmpty()
        ],
        loginUserController)
    .put('/delete', deleteUserController)

module.exports = userRouter;