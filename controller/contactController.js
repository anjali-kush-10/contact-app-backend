import Contact from '../models/contact.model.js';
import ExcelJS from 'exceljs';
import { Op } from 'sequelize';
import XLSX from 'xlsx';
import sequelize from '../db/connection.js';
import User from '../models/user.model.js';



export var fetch = async (req, res) => {
    try {
        var local_url = process.env.URL_LOCAL;
        var fullPath = local_url;
        const user_id = req.user_id;

        const orderBy = req.query.orderBy || "DESC";
        const sortBy = req.query.sortBy || "id";
        const search = req.query.search || "";
        const pageNo = parseInt(req.query.pageNo) || 1;
        const limitPerPage = parseInt(req.query.limit) || 5;

        const offset = (pageNo - 1) * limitPerPage;

        const totalContact = await Contact.findAndCountAll({
            where: {
                user_id: user_id,
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { contact_no: { [Op.like]: `%${search}%` } },
                    { address: { [Op.like]: `%${search}%` } },
                ]
            },
            attributes: [
                "id",
                "user_id",
                "name",
                "contact_no",
                "address",
                [sequelize.literal(`CONCAT('${fullPath}',\`profile_image\`)`), "profile_image"],
            ],
            order: [[sortBy, orderBy]],
            limit: limitPerPage,
            offset: offset
        });
        const totalPages = Math.ceil(totalContact.count / limitPerPage);

        return res.status(200).json({ status: true, totalPages, count: totalContact.count, contacts: totalContact.rows });
    }
    catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
}


export var save = async (req, res) => {
    try {
        const { name, contact_no, address } = req.body;

        var profile_image = req.file.filename;
        profile_image = profile_image?.filename ? profile_image.filename : null;

        const user_id = req.user_id;

        const data = await Contact.findOne({
            where: {
                user_id: req.user_id,
                contact_no: req.body.contact_no
            },
        });

        if (data) {
            return res.status(401).json({ status: false, message: "Contact already exists" });
        }

        const obj = {
            "user_id": user_id,
            "name": name,
            "address": address,
            "profile_image": profile_image,
            "contact_no": contact_no
        };

        const contactData = await Contact.create(obj);

        return res.status(201).json({ status: true, message: "Contact Saved", contactData });

    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
}

export var deletecontact = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id);
        const user_id = req.user_id;
        const data = await Contact.findOne({
            where: {
                user_id: user_id,
                id: id
            }
        });
        // console.log(data);
        if (!data) {
            return res.status(401).json({ status: false, message: "Contact not found" });
        }
        const d = await Contact.destroy({
            where: {
                id: id,
                user_id: user_id,
            }
        });
        if (d) {
            return res.status(200).json({ status: true, message: "Contact Deleted" });
        }
        else {
            return res.status(404).json({ status: false, message: error.message });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
}

export var update_contact = async (req, res) => {
    try {
        var { id } = req.params;
        const user_id = req.user_id;
        // console.log(user_id)
        var obj = {
            name: req.body.name,
            contact_no: req.body.contact_no,
            address: req.body.address,
        }
        var result = await Contact.findOne({
            where: {
                id: id,
                user_id: user_id,
            }
        });
        // console.log(result);
        if (!result) {
            return res.status(404).json({ status: false, message: "Contact not found" });
        }
        else {

            if (req.file) {
                obj.profile_image = req.file.filename
            }

            await Contact.update(obj, {
                where: {
                    id: id,
                    user_id: user_id
                }
            }).then((data) => {
                if (data[0] == 1) {
                    return res.status(201).json({ status: true, message: "Contact Updated Successfully" })
                }
                else {
                    return res.status(404).json({ status: false, message: "Contact not upadted" });
                }
            })
        }
    }
    catch (error) {
        console.log(error);
        return res.status(404).json({ status: false, message: error.message });
    }
}

export var csvOption = async (req, res) => {
    try {
        const { id } = req.params;

        const userContactData = await Contact.findAll({
            where: {
                user_id: id
            }
        });

        // console.log(userContactData);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');

        worksheet.columns = [
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Address', key: 'address', width: 20 },
            { header: 'Contact', key: 'contact_no', width: 20 }
        ];

        worksheet.addRows(userContactData);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "All Contact excel.xlsx"
        );

        await workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });


    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}




export var excelToDatabase = async (req, res) => {
    try {
        //Need to add excel file path in read file
        const workbook = XLSX.readFile(req.file.path);
        const worksheet = workbook.Sheets[`${workbook.SheetNames[0]}`];
        // return res.json(worksheet);
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const newData = [];

        for (let i = 0; i < jsonData.length; i++) {
            if (jsonData[i].Contact && jsonData[i].Name) {
                const checkIfExist = await Contact.findOne({
                    where: {
                        user_id: req.user_id,
                        contact_no: jsonData[i].Contact,
                        name: jsonData[i].Name
                    }

                });

                if (!checkIfExist) {
                    const obj = {
                        user_id: req.user_id,
                        name: jsonData[i].Name,
                        contact_no: jsonData[i].Contact,
                        address: jsonData[i].Address
                    }
                    newData.push(obj);
                    // console.log(checkIfExist);
                }
            }
        }
        await Contact.bulkCreate(newData);
        return res.status(200).json({ status: true, message: "Contact Imported from csv successfully" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
};


export var manageContact = async (req, res) => {
    try {
        var local_url = process.env.URL_LOCAL;

        const search = req.query.search || "";
        const limitPerPage = parseInt(req.query.limit) || 5;
        const pageNo = parseInt(req.query.pageNo) || 1;

        const offset = (pageNo - 1) * limitPerPage;

        const allContacts = await Contact.findAndCountAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { contact_no: { [Op.like]: `%${search}%` } },
                    { address: { [Op.like]: `%${search}%` } },
                ],
            },
            attributes: [
                "id",
                "name",
                "contact_no",
                "address",
                [sequelize.literal(`CONCAT('${local_url}',\`profile_image\`)`), "profile_image"],
            ],
            include: [
                {
                    model: User,
                    as: 'user_data',
                    attributes: [
                        'name'
                    ],
                },
            ],

            limit: limitPerPage,
            offset: offset,
        });
        const totalPages = Math.ceil(allContacts.count / limitPerPage);
        return res.status(200).json({ status: true, count: allContacts.count, rows: allContacts.rows, totalPages });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
}


