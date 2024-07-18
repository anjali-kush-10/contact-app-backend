import express from 'express';
import { jwtAuthMiddleware } from '../Helper/helper.js';
// import { isUser } from '../Helper/Auth.js';
import { deleteuser, fetchPermission, getUser, login, postUser, updateuser, userData, viewContactsById } from '../controller/userController.js';
import { userRegister, validate } from '../Validator/userValidation.js';
//import customError from '../Helper/customError.js';

const router = express.Router();

const userRouter = (upload) => {
    router.get('/getuser', jwtAuthMiddleware, getUser);
    router.get('/getuser/:id', jwtAuthMiddleware, userData);
    router.post('/postuser', upload.single('image'), userRegister(), validate, postUser);
    router.delete('/deleteuser/:id', deleteuser);
    router.patch('/updateuser/:id', jwtAuthMiddleware, updateuser);

    router.post('/login', login);
    router.get('/fetch-permission', jwtAuthMiddleware, fetchPermission);

    router.get('/view-contacts-by-id/:id', viewContactsById);
    return router;
}

export default userRouter;