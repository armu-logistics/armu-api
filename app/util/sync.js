const db = require("../models/");
const Role = db.role;
const Product = db.product;
const Grade = db.grade;
const ProductGrade = db.productGrade;
async function sync() {
  try {
    await Role.bulkCreate(
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
        ignoreDuplicates: true,
      }
    );

    await Product.bulkCreate(
      [
        {
          id: "04c7bcda-9dc0-4c90-922e-70bd3561d495",
          name: "Maize",
        },
        {
          id: "5b72876b-307a-44ed-9cfa-b4a56b6334da",
          name: "Sorgum",
        },
        {
          id: "e7b3a9a4-9b81-43a9-b785-0c2ced04c9bb",
          name: "Beans",
        },
      ],
      {
        fields: ["id", "name"],
        ignoreDuplicates: true,
      }
    );
    await Grade.bulkCreate(
      [
        {
          id: "536a2113-2856-404b-b33b-dc4a08af0fda",
          name: "A",
        },
      ],
      { fields: ["id", "name"], ignoreDuplicates: true }
    );

    await ProductGrade.bulkCreate(
      [
        {
          id: "95e15b78-b544-4d84-a5dd-841f26314864",
          productId: "04c7bcda-9dc0-4c90-922e-70bd3561d495",
          gradeId: "536a2113-2856-404b-b33b-dc4a08af0fda",
        },
      ],
      { fields: ["id", "productId", "gradeId"], ignoreDuplicates: true }
    );
  } catch (error) {
    console.log(error);
  }
}
module.exports = { sync };
