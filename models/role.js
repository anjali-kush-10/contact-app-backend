import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";
import permission from "./permission.js";


const role = sequelize.define('role', {
   role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
   },
   role_name: {
      type: DataTypes.STRING,
      allowNull: false
   },
   permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false
   },
   createdAt: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
      allowNull: false
   },
   updatedAt: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
      allowNull: false
   }
}, {
   tableName: 'role',
})

permission.hasMany(role, { foreignKey: 'permission_id', targetKey: 'permission_id' })
role.belongsTo(permission, { foreignKey: 'permission_id', targetKey: 'permission_id', as: 'my_permission' })

export default role;