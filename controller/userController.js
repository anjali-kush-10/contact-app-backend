import User from '../models/user.model.js';
import Role from '../models/role.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Op } from 'sequelize';
import sequelize from '../db/connection.js';
import Contact from '../models/contact.model.js';
import permission from '../models/permission.js';

dotenv.config();

export var userData = async (req, res) => {
    try {
        var userId = await User.findByPk(req.params.id);
        return res.status(200).json({ status: true, details: userId });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, error: error.message });
    }
}

export var postUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: false, message: "email and password are required" });
        }
        const checkEmail = await User.findOne({
            where: {
                email: email
            }
        });
        if (checkEmail) {
            return res.status(400).json({ status: false, message: "This email is already exists" });
        }

        var obj = {
            "name": name,
            "email": email,
            "role_id": 2
        };

        //const user = await User.create(obj);

        const file = req.file;
        const image = file?.filename ? file.filename : null;
        obj.image = image;

        const hashedPass = await bcryptjs.hash(password, 10);
        obj.password = hashedPass;

        const user = await User.create(obj);

        return res.status(201).json({ status: true, message: "Registered Successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
}

export var login = async (req, res) => {
    try {
        var { email, password } = req.body;
        var user = await User.findOne({
            where: {
                email
            },
            // attributes: { exclude: ['password'] },
            include: [{
                model: Role,
                as: 'role_data',
                attributes: ['role_name'],
                include: [{
                    model: permission,
                    as: 'my_permission',
                    attributes: ['permission_id', 'permission'],
                }]
            }]
        });
        if (!user) {
            return res.status(404).json({ status: false, message: "invalid email address" });
        }

        var checkPassword = await bcryptjs.compare(password, user.password);
        if (!checkPassword) {
            return res.status(404).json({ status: false, message: "wrong password" });
        }
        if (!user || !checkPassword) {
            return res.status(404).json({ status: false, message: "Invalid email or password" });
        }
        else {

            var payload = { user_id: user.id };
            var key = process.env.KEY_PAYLOAD;
            var token = jwt.sign(payload, key, { expiresIn: '7d' });
            return res.status(201).json({
                status: true,
                message: 'User logged in successfully',
                token: token,
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role_id: user.role_id,
                    role_data: user.role_data
                }
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }

}



export const deleteuser = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if the user exists
        const data = await User.findByPk(id);
        if (!data) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }
        // Delete the user
        await User.destroy({
            where: {
                id: id
            }
        });
        return res.status(200).json({ status: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

export const updateuser = async (req, res) => {
    try {
        var { id } = req.params;
        var obj = req.body;
        var result = await User.findByPk(id);
        if (!result) {
            return res.status(404).json({ status: false, message: "User not found" });
        }
        await User.update(obj, {
            where: {
                id: id
            }
        });
        return res.status(201).json({ status: true, message: "User detail updated" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

export var getUser = async (req, res) => {
    try {
        var local_url = process.env.URL_LOCAL;

        const search = req.query.search || "";
        const limitPerPage = parseInt(req.query.limit) || 5;
        const pageNo = parseInt(req.query.pageNo) || 1;

        const offset = (pageNo - 1) * limitPerPage;

        const allUsers = await User.findAndCountAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                ],
            },
            attributes: [
                "name",
                "id",
                "email",
                [sequelize.literal(`CONCAT('${local_url}',\`image\`)`), "image"],
            ],

            limit: limitPerPage,
            offset: offset,

        });

        const totalPages = Math.ceil(allUsers.count / limitPerPage);
        return res.status(200).json({ status: true, count: allUsers.count, rows: allUsers.rows, totalPages });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}

export var viewContactsById = async (req, res) => {
    try {
        const { id } = req.params;
        var local_url = process.env.URL_LOCAL;

        const allUsers = await User.findAll({
            where: {
                id: id,
            },
            attributes: [
                "name",
                "id",
            ],
            include: [
                {
                    model: Contact,
                    attributes: [
                        'name',
                        'contact_no',
                        'address',
                        'user_id',
                        [sequelize.literal(`CONCAT('${local_url}',\`profile_image\`)`), "profile_image"],
                    ],
                },
            ],
        });
        return res.status(200).json({ status: true, allUsers });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}


export const fetchPermission = async (req, res) => {
    try {
        const data = await Role.findOne({
            where: {
                role_id: req.role_id
            },
            attributes: ['role_name'],
            include: [{
                model: permission,
                as: 'my_permission',
                attributes: ['permission_id', 'permission'],
            }]
        });
        return res.status(200).json({ status: true, data });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}