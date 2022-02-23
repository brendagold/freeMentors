import Joi from 'joi';


const schema = Joi.object().keys({ 
  firstname: Joi.string().alphanum().trim().min(3).required(),
  lastname: Joi.string().alphanum().trim().min(3).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(5).required(),
  address: Joi.string().alphanum().trim().required(),
  bio: Joi.string().alphanum().trim().required(),
  occupation: Joi.string().alphanum().trim().required(),
  expertise: Joi.string().alphanum().trim().required(),
}); 

export {schema};