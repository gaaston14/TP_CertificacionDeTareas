const { Sequelize, DataTypes } = require('sequelize')
const { mysql } = require('./configs/config')
const mysql2 = require('mysql2');

const UserModel = require('./models/user')
const TechnicianModel = require('./models/technician')
const TaskModel = require('./models/task')
const GroupModel = require('./models/group')
const PriceModel = require('./models/price')
const GroupTaskModel = require('./models/group_task')
const GroupTechnicianModel = require('./models/group_technician')

const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 3306),
    dialect: 'mysql',
    dialectModule: mysql2,
    timezone: '-03:00',
    pool: { max: 10, min: 0, acquire: 60000, idle: 10000 },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
        servername: process.env.MYSQL_HOST
      }
    },
    logging: false
  }
);

const User = UserModel(sequelize, DataTypes)
const Technician = TechnicianModel(sequelize, DataTypes)
const Task = TaskModel(sequelize, DataTypes)
const Group = GroupModel(sequelize, DataTypes)
const Price = PriceModel(sequelize, DataTypes)
const GroupTask = GroupTaskModel(sequelize, DataTypes)
const GroupTechnician = GroupTechnicianModel(sequelize, DataTypes)

Group.belongsToMany(Technician, { through: { model: GroupTechnician, unique: false }})
Technician.belongsToMany(Group, { through: { model: GroupTechnician, unique: false }})

Task.hasMany(Price)
Price.belongsTo(Task)

Group.belongsToMany(Task, { through: { model: GroupTask, unique: false }})
Task.belongsToMany(Group, { through: { model: GroupTask, unique: false }})

GroupTechnician.belongsTo(Group)
GroupTechnician.belongsTo(Technician)

GroupTask.belongsTo(Group)
GroupTask.belongsTo(Task)

console.log('DB cfg ->', {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  db:   process.env.MYSQL_DB
});


if (process.env.NODE_ENV !== 'production') {
  sequelize.sync({ alter: true })
  .then(() => {
    console.log('Models sync successfully')
  })
  .catch((error) => {
    console.error('Error in syncing:', error)
  })
}

const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

connectDB()

module.exports = {
  sequelize,
  User,
  Technician,
  Task,
  Group,
  Price,
  GroupTask,
  GroupTechnician
}
