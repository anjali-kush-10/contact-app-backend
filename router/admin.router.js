import express from 'express';
import { changePassword, editProfile, editContact, deleteContact, fetchUsers, postUsers } from '../controller/adminController.js';
import { jwtAuthMiddleware } from '../Helper/helper.js';
import { userRegister, validate } from '../Validator/userValidation.js';


const router = express.Router();

const adminRouter = (upload) => {
    router.get('/fetch-users', fetchUsers);
    router.post('/post-users', upload.single('image'), userRegister(), validate, postUsers);
    // router.patch('/edit-user/:id', jwtAuthMiddleware, editUser);
    // router.delete('/delete-user/:id', deleteUser);


    router.patch('/editcontact/:id', jwtAuthMiddleware, upload.single('profile_image'), editContact);
    router.patch('/changepassword/:id', jwtAuthMiddleware, changePassword);
    router.patch('/editprofile/:id', jwtAuthMiddleware, upload.single('image'), editProfile);
    router.delete('/deletecontact/:id', jwtAuthMiddleware, deleteContact);

    return router;
}

export default adminRouter;


