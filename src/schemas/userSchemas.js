import Joi from '@hapi/joi';

const user = Joi.object({
	displayName: Joi.string()
		.alphanum()
		.required(),
	imageUrl: Joi.string()
		.uri()
		.required()
});

/* eslint import/prefer-default-export: */
export { user };
