import { DataTypes } from "sequelize";
import sequelize from "../db/connection.js";


const permission = sequelize.define('permission', {
   permission_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
   },
   // role_id: {
   //    type: DataTypes.INTEGER,
   //    allowNull: false
   // },
   permission: {
      type: DataTypes.STRING,
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
   tableName: 'permission',
})

// role.hasMany(permission, { foreignKey: 'permission_id', targetKey: 'permission_id' })
// permission.belongsTo(role, { foreignKey: 'permission_id', targetKey: 'permission_id' })

export default permission;