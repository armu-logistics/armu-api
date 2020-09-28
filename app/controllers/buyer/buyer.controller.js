const db = require("../../models");
const Buyer = db.buyer;
const User = db.user;
const Joi = require("joi");
const validate = require("../../util/validation");
let errHandler = new Error();
