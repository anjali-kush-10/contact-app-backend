import express from 'express';
const router = express.Router();
import { fetch, save, deletecontact, update_contact, csvOption, excelToDatabase, manageContact } from '../controller/contactController.js';
import { contactValidation, validate } from '../Validator/contactValiadtion.js';
import { jwtAuthMiddleware } from '../Helper/helper.js';

const contactRouter = (upload) => {
    router.get('/fetch', jwtAuthMiddleware, fetch);
    router.post('/save', upload.single('profile_image'), jwtAuthMiddleware, contactValidation(), validate, save);
    router.delete('/delete/:id', jwtAuthMiddleware, deletecontact);
    router.patch('/update/:id', jwtAuthMiddleware, upload.single('profile_image'), update_contact);

    router.get('/export/:id', csvOption);
    router.get('/managecontact', manageContact)
    router.post('/import-from-csv', upload.single('excelFile'), jwtAuthMiddleware, excelToDatabase);

    return router;
}

export default contactRouter;

