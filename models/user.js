module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    'users',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true
        //   validate: {
        //     notNull: { msg: "First name is required" },
        //   },
      },
      

      email: {
        type: Sequelize.STRING,
        validate: { isEmail: true },
        allowNull: false,
        validate: {
          notNull: { msg: 'Email is required' }
        }
      },
     
      username: {
        type: Sequelize.STRING
      },
      
      password: {
        type: Sequelize.STRING
      },
     
     

      
      salt: {
        type: Sequelize.STRING
      },
      
    },
    { timestamps: true }
  );
  return User;
};
