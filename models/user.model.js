import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";
import Contact from "./contact.model.js";
import role from "./role.js";


const User = sequelize.define('User', {
   id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
   },
   name: {
      type: DataTypes.STRING,
      allowNull: false
   },
   email: {
      type: DataTypes.STRING,
      allowNull: false
   },
   password: {
      type: DataTypes.STRING,
      allowNull: false
   },
   image: {
      type: DataTypes.STRING,
      allowNull: true,
   },
   role_id: {
      type: DataTypes.INTEGER,
      defaultValue: 'user',
      allowNull: false
   }

}, {
   tableName: 'user_details',
})


User.hasMany(Contact, { foreignKey: 'user_id', targetKey: 'id' })
Contact.belongsTo(User, { foreignKey: 'user_id', as: 'user_data' })

role.hasMany(User, { foreignKey: 'role_id', targetKey: 'role_id' })
User.belongsTo(role, { foreignKey: 'role_id', as: 'role_data' })

// role.hasMany(permission, { foreignKey: 'role_id', targetKey: 'role_id' })
// permission.belongsTo(role, { foreignKey: 'role_id', as: 'my_permission' })

// User.hasMany(Contact)
// Contact.belongsTo(User)

// sequelize.sync();
export default User;