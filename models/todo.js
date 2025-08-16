"use strict";
const { Model } = require("sequelize");
const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static associate() {
      // define association here if needed
    }

    static addTodo(title, dueDate) {
      return this.create({
        title: title,
        dueDate: dueDate,
        completed: false,
      });
    }

    static async getTodos() {
      return this.findAll();
    }

static async markAsComplete(id) {
  await Todo.update({ completed: true }, { where: { id } });
  return await Todo.findByPk(id); // return updated record
}


    static async overdue() {
      return this.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date().toISOString().split("T")[0],
          },
          completed: false,
        },
      });
    }

    static async dueToday() {
      return this.findAll({
        where: {
          dueDate: new Date().toISOString().split("T")[0],
          completed: false,
        },
      });
    }

    static async dueLater() {
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toISOString().split("T")[0],
          },
          completed: false,
        },
      });
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );
  return Todo;
};
