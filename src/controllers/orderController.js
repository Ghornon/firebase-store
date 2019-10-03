import { db } from '../utils/admin';

const getAll = async (req, res) => {
	const orders = await db
		.collection('orders')
		.orderBy('createdAt', 'desc')
		.get()
		.then(snapshot => {
			if (!snapshot.empty) {
				return [...snapshot.docs].map(doc => {
					return {
						orderId: doc.id,
						...doc.data()
					};
				});
			}
			return null;
		});

	if (!orders) return res.status(404).json({ error: 'Not found!' });

	return res.status(200).json({ orders });
};

const get = async (req, res) => {
	const { userId } = req.params;

	const orders = await db
		.collection('orders')
		.where('userId', '==', userId)
		.orderBy('createdAt', 'desc')
		.get()
		.then(snapshot => {
			if (!snapshot.empty) {
				return [...snapshot.docs].map(doc => {
					return {
						orderId: doc.id,
						...doc.data()
					};
				});
			}
			return null;
		});

	if (!orders) return res.status(404).json({ error: 'Not found!' });

	return res.status(200).json({ orders });
};

const getOne = async (req, res) => {
	const { orderId } = req.params;

	const order = await db
		.collection('orders')
		.doc(orderId)
		.get()
		.then(snapshot => {
			if (!snapshot.empty) {
				return {
					orderId: snapshot.id,
					...snapshot.data()
				};
			}
			return null;
		});

	if (!order) return res.status(404).json({ error: 'Not found!' });

	return res.status(200).json({ ...order });
};

const createProductsList = async products => {
	const validatedList = [];

	const productsId = [...products].map(({ inventoryId }) => inventoryId);

	await db
		.collection('inventory')
		.get()
		.then(snapshot => {
			snapshot.forEach(doc => {
				if (productsId.includes(doc.id)) {
					const data = doc.data();
					validatedList.push({
						name: data.name,
						price: data.price,
						inventoryId: doc.id,
						quantity: products.find(element => element.inventoryId === doc.id).quantity
					});
				}
			});
		})
		.catch(err => {
			console.error('Error getting documents', err);
		});

	return validatedList;
};

const create = async (req, res) => {
	const { userId = req.params.userId, products } = req.body;

	const validatedList = await createProductsList(products);

	if (!validatedList) {
		return res.status(500).json({ error: 'Unexpected error' });
	}

	const newOrder = await db
		.collection('orders')
		.add({
			createdAt: new Date().toISOString(),
			userId,
			products: validatedList,
			status: 'Preparing'
		})
		.then(ref => (ref ? ref.id : null));

	const order = await db
		.collection('orders')
		.doc(newOrder)
		.get()
		.then(snapshot => {
			if (!snapshot.empty) {
				return {
					orderId: snapshot.id,
					...snapshot.data()
				};
			}
			return null;
		});

	if (!order) return res.status(500).json({ error: 'Unexpected error' });

	return res.status(201).json({
		...order
	});
};

const update = async (req, res) => {
	const { orderId } = req.params;
	const { userId = req.params.userId, products, status } = req.body;

	const order = await db
		.collection('orders')
		.doc(orderId)
		.get()
		.then(snapshot => (!snapshot.empty ? snapshot.data() : null));

	if (!order) return res.status(404).json({ error: 'Order not found!' });

	const updateResult = await db
		.collection('orders')
		.doc(orderId)
		.update({
			userId,
			products,
			status,
			updatedAt: new Date().toISOString()
		});

	if (!updateResult) return res.status(500).json({ error: 'Unexpected error' });

	return res.status(204).json();
};

const remove = async (req, res) => {
	const { orderId } = req.params;

	const removeResult = await db
		.collection('orders')
		.doc(orderId)
		.delete();

	if (!removeResult) return res.status(404).json({ error: 'Order not found!' });

	return res.status(204).json();
};

export { getAll, get, getOne, create, update, remove };
