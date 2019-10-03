import Joi from '@hapi/joi';

const newOrder = Joi.object({
	userId: Joi.string(),
	products: Joi.array().items(
		Joi.object({
			inventoryId: Joi.string().required(),
			quantity: Joi.number()
				.integer()
				.required()
		})
	)
});

const updateOrder = Joi.object({
	userId: Joi.string(),
	products: Joi.array().items(
		Joi.object({
			inventoryId: Joi.string().required(),
			name: Joi.string().required(),
			price: Joi.number().required(),
			quantity: Joi.number()
				.integer()
				.required()
		})
	),
	status: Joi.string().valid('Sent', 'Preparing', 'Shipping')
});

export { newOrder, updateOrder };
