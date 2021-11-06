import Joi from "joi";
import { IGroupFields, ILoginFields, IRegisterFields } from "./types";

// Registration Validation
export const registerValidation = (data: IRegisterFields) => {
  const schema = Joi.object({
    group_id: Joi.string(),
    first_name: Joi.string().min(1).max(100).required(),
    last_name: Joi.string().min(1).max(100).required(),
    age: Joi.number().integer().min(1).max(120).required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org"] },
    }),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    repeat_password: Joi.ref("password"),
    date_joined: Joi.string().required(),
  }).unknown();


  return schema.validate(data);
};

export const loginValidation = (data: ILoginFields) => {
  const schema = Joi.object({
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org"] },
    }),
    password: Joi.string()
  });

  return schema.validate(data)
};

export const groupValidation = (data: IGroupFields) => {
  const schema = Joi.object({
    unique_group_name: Joi.string().required(),
    group_name: Joi.string().required()
  })

  return schema.validate(data)
}
