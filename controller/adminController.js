import Contact from '../models/contact.model.js';
import User from '../models/user.model.js';
import bcryptjs from "bcryptjs";
import dotenv from 'dotenv';

dotenv.config();

export var changePassword = async (req, res) => {
  try {
    var id = req.params.id;
    var { newPassword, confirmPassword } = req.body;

    var result = await User.findOne({
      where: {
        id: id,
      }
    });
    if (!result) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(500).json({ status: false, message: "Invalid Password" });
    }

    const pass = await bcryptjs.hash(newPassword, 10);
    const obj = { password: pass };

    await User.update(obj, {
      where: {
        id: id
      }
    });
    return res.status(201).json({ status: true, message: "Password Updated" });
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
}

export const editProfile = async (req, res) => {
  try {
    var { id } = req.params;
    var obj = {
      name: req.body.name,
      email: req.body.email,
    }
    // console.log(obj);
    var result = await User.findOne({
      where: {
        id: id
      }
    });
    if (!result) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    else {

      if (req.file) {
        obj.image = req.file.filename
      }
      // return res.json({ obj });

      await User.update(obj, {
        where: {
          id: id,
        }
      }).then((response) => {
        // console.log(response[0], "**********");

        if (response[0] == 1) {
          return res.status(201).json({ status: true, message: "Profile Updated" });
        }
        else {
          return res.status(400).json({ status: false, message: "Profile Not  Updated" });
        }
      });
    }
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
}


export const editContact = async (req, res) => {
  try {
    const { id } = req.params;
    const obj = req.body;
    const result = await Contact.findOne({
      where: {
        id: id,
      },
      attributes: ['id']
    });


    if (!result) {
      return res.status(404).json({ status: false, message: "Contact Not Found" });
    }
    else {
      const file = req.file;
      const image = file?.filename ? file.filename : null;
      obj.profile_image = image;

      await Contact.update(obj, {
        where: {
          id: id,
        }
      }).then((response) => {
        // console.log(response);
        if (response[0] == 1) {
          return res.status(201).json({ status: true, message: "Contact Updated" });
        }
        else {
          return res.status(400).json({ status: false, message: "Contact Not Updated" });
        }
      });
    }
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
}

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Contact.findOne({
      where: {
        id: id,
      }
    });

    if (!data) {
      return res.status(404).json({ status: false, message: "Contact not Found" });
    }

    const result = await Contact.destroy({
      where: {
        id: id,
      }
    });

    if (result) {
      return res.status(200).json({ status: true, message: "Contact Deleted" });
    }
    else {
      return res.status(400).json({ status: false, message: "Contact Not Deleted" });
    }
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
}

export const fetchUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json({ status: true, users });

  }
  catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
}

export var postUsers = async (req, res) => {
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
      return res.status(400).json({ status: false, message: "This email exist already" });
    }

    var obj = { "name": name, "email": email, "role_id": 2 };

    //const user = await User.create(obj);

    const file = req.file;
    const image = file?.filename ? file.filename : null;
    obj.image = image;

    var hashedPass = await bcryptjs.hash(password, 10);
    obj.password = hashedPass;

    await User.create(obj);

    return res.status(201).json({ status: true, message: "Registered Successfully" });
  }
  catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
}

// export const editUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const obj = req.body;
//     const userData = await User.findByPk(id);
//     if (!userData) {
//       return res.status(404).json({ status: false, message: "User not found" });
//     }

//     await User.update(obj, {
//       where: {
//         id: id
//       }
//     });
//     return res.status(201).json({ status: false, message: "User profile updated successfully" });

//   }
//   catch (error) {
//     console.log(error);
//     return res.status(500).json({ status: false, message: error.message });
//   }
// }


// export const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const userData = await User.findByPk(id);
//     if (!userData) {
//       return res.status(404).json({ status: false, message: "User not found" });
//     }

//     await User.destroy({
//       where: {
//         id: id
//       }
//     });
//     return res.status(201).json({ status: false, message: "User Deleted Successfully" });
//   }
//   catch (error) {
//     return res.status(500).json({ status: false, message: error.message });
//   }
// }