const Joi = require('joi');


//Register Validation
const registerValidator = (data) => {

    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password : Joi.string().min(6).required()
    }).options({ abortEarly: false });
    return schema.validate(data);
};

//login Validation
const loginValidator = (data) => {

    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password : Joi.string().min(6).required()
    }).options({ abortEarly: false });
    return schema.validate(data);
};

module.exports.registerValidator = registerValidator;
module.exports.loginValidator = loginValidator;