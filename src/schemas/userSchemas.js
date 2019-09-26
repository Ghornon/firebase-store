import Joi from '@hapi/joi';

const user = Joi.object({
	displayName: Joi.string()
		.required()
		.max(50)
		.regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/),
	imageUrl: Joi.string()
		.uri()
		.required()
});

/* eslint import/prefer-default-export: */
export { user };
