import Joi from '@hapi/joi';

const signIn = Joi.object({
	email: Joi.string()
		.email({ minDomainSegments: 2 })
		.required(),
	password: Joi.string().required()
});

const signUp = Joi.object({
	email: Joi.string()
		.email({ minDomainSegments: 2 })
		.required(),
	password: Joi.string().required(),
	retypePassword: Joi.ref('password')
}).with('password', 'retypePassword');

export { signIn, signUp };
