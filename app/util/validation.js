let validateSchema = (body, schema, res, next) => {
  let errHandler = new Error();
  let options = {
    language: {
      key: "{{key}} ",
    },
    abortEarly: false,
  };
  const result = schema.validate(body, options);
  if (result.error) {
    let errors = [];
    result.error.details.forEach((error) => {
      errors.push(error.message);
    });
    errHandler.success = false;
    errHandler.message = errors;
    errHandler.statusCode = 400;
    throw errHandler;
  }
  return;
};
module.exports = validateSchema;
