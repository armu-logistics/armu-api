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
      let createUsers = await User.bulkCreate(
        [
          {
            id: "1c501845-39f2-490e-ae7a-9541894ffa9b",
            name: "anthony baru",
            mobile: "254700658856",
            email: "anthonybaru@gmail.com",
            password:
              "$2a$08$Rpx75xyp3DDykQX54kam6.2Zv3huK/gsWSUstvO9Si.TjorbsLVXu",
            kra_pin: "A012345699P",
            verified: 1,
            roleId: "8688784d-9f7b-4e26-a262-d2a6fdb824a5",
          },
          {
            id: "1c501845-39f2-490e-ae7a-9541894ffa9c",
            name: "peter chege",
            mobile: "254700658899",
            email: "peterchege442@gmail.com",
            password:
              "$2a$08$Rpx75xyp3DDykQX54kam6.2Zv3huK/gsWSUstvO9Si.TjorbsLVXu",
            kra_pin: "A012345600P",
            verified: 1,
            roleId: "a8d8ee46-f798-429e-b523-59de9c538a18",
          },
          {
            id: "1c501845-39f2-490e-ae7a-9541894ffa9d",
            name: "gilbert njoroge",
            mobile: "254700658890",
            email: "kangethu2@gmail.com",
            password:
              "$2a$08$Rpx75xyp3DDykQX54kam6.2Zv3huK/gsWSUstvO9Si.TjorbsLVXu",
            kra_pin: "A012345611P",
            verified: 1,
            roleId: "af66e44c-da0f-41a0-8f43-0c812bad492c",
          },
        ],
        {
          fields: [
            "id",
            "name",
            "mobile",
            "email",
            "password",
            "kra_pin",
            "verified",
            "roleId",
          ],
          updateOnDuplicate: ["email"],
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  return initial();
};
