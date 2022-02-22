const highlight = require("cli-highlight").highlight;
var falsy = /^(?:f(?:alse)?|no?|0+)$/i;
Boolean.parse = function (val) {
  return !falsy.test(val) && !!val;
};

const ssl =
  process.env.NODE_ENV == "production"
    ? {
        require: Boolean.parse(process.env.DB_SSL_REQUIRE),
        rejectUnauthorized: Boolean.parse(
          process.env.DB_SSL_REJECT_UNAUTHORISED
        ),
      }
    : false;

module.exports = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  db: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  camelCase: true,
  dialect: process.env.DB_CONNECTION,
  dialectOptions: {
    ssl,
    dateStrings: true,
    typeCast: true,
    useUTC: false,
  },
  timezone: "Africa/Nairobi",
  logging(log) {
    console.log(highlight(log, { language: "sql", ignoreIllegals: true }));
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
