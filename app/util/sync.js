const db = require("../models/");
const Role = db.role;
const User = db.user;

exports.sync = (req, res) => {
  async function initial() {
    try {
      let createRoles = await Role.bulkCreate(
        [
          {
            id: "a8d8ee46-f798-429e-b523-59de9c538a18",
            name: "buyer",
          },
          {
            id: "8688784d-9f7b-4e26-a262-d2a6fdb824a5",
            name: "farmer",
          },
          {
            id: "af66e44c-da0f-41a0-8f43-0c812bad492c",
            name: "admin",
          },
        ],
        {
          fields: ["id", "name"],
          ignoreDuplicate: true,
          updateOnDuplicate: ["name"],
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  return initial();
};
