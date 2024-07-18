import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './router/user.router.js';
import adminRouter from './router/admin.router.js';
import contactRouter from './router/contact.router.js';
import dotenv from 'dotenv';
import multer from 'multer';
import url from 'url';
import path from 'path';
import cors from 'cors';


const app = express();
const PORT = 4000;

dotenv.config();

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const uploadDir = path.join(__dirname, './upload');

app.use(express.static(path.join(__dirname, "/")));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
    }),
    // limits: { fileSize: 2000000 }
});
//const storage = multer({ storage: storage });

app.use('/user', userRouter(upload));
app.use('/admin', adminRouter(upload));
app.use('/contact', contactRouter(upload));

app.all("*", (req, res, next) => {
    res.status(404).json({
        status: "fail",
        msg: `can't match this url${req.originalUrl}`
    });
});
app.listen(PORT);
console.log("Port Listenning...", PORT);