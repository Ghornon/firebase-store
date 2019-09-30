import Joi from '@hapi/joi';

const inventory = Joi.object({
	name: Joi.string()
		.max(50)
		.required(),
	description: Joi.string().required(),
	price: Joi.number().required(),
	visibility: Joi.string().valid('Public', 'Draft', 'Unpublic'),
	imageUrl: Joi.array().items(Joi.string().uri())
});

/* eslint import/prefer-default-export: */
export { inventory };
