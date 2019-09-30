import { db } from '../utils/admin';

const getAll = async (req, res) => {
	const inventory = await db
		.collection('inventory')
		.get()
		.then(snapshot => {
			if (!snapshot.empty) {
				return [...snapshot.docs].map(doc => {
					return {
						inventoryId: doc.id,
						...doc.data()
					};
				});
			}
			return null;
		});

	if (!inventory) return res.status(404).json({ error: 'Not found!' });

	return res.status(200).json({ inventory });
};

const get = async (req, res) => {
	const inventory = await db
		.collection('inventory')
		.where('visibility', '==', 'Public')
		.get()
		.then(snapshot => {
			if (!snapshot.empty) {
				return [...snapshot.docs].map(doc => {
					return {
						inventoryId: doc.id,
						...doc.data()
					};
				});
			}
			return null;
		});

	if (!inventory) return res.status(404).json({ error: 'Not found!' });

	return res.status(200).json({ inventory });
};

const getOne = async (req, res) => {
	const { inventoryId } = req.params;

	const inventory = await db
		.collection('inventory')
		.doc(inventoryId)
		.get()
		.then(snapshot => {
			if (!snapshot.empty) {
				return {
					inventoryId: snapshot.id,
					...snapshot.data()
				};
			}
			return null;
		});

	if (!inventory) return res.status(404).json({ error: 'Not found!' });

	return res.status(200).json({ ...inventory });
};

const create = async (req, res) => {
	const { name, description, price, visibility, imageUrl } = req.body;

	const newInventory = await db
		.collection('inventory')
		.add({
			name,
			description,
			price,
			visibility,
			imageUrl
		})
		.then(ref => (ref ? ref.id : null));

	const inventory = await db
		.collection('inventory')
		.doc(newInventory)
		.get()
		.then(snapshot => {
			if (!snapshot.empty) {
				return {
					inventoryId: snapshot.id,
					...snapshot.data()
				};
			}
			return null;
		});

	if (!inventory) return res.status(500).json({ error: 'Error creating document!' });

	return res.status(201).json({
		...inventory
	});
};

const update = async (req, res) => {
	const { inventoryId } = req.params;
	const { name, description, price, visibility, imageUrl } = req.body;

	const inventory = await db
		.collection('inventory')
		.doc(inventoryId)
		.get()
		.then(snapshot => (!snapshot.empty ? snapshot.data() : null));

	if (!inventory) return res.status(404).json({ error: 'Inventory not found!' });

	const updateResult = await db
		.collection('inventory')
		.doc(inventoryId)
		.update({
			name,
			description,
			price,
			visibility,
			imageUrl
		});

	if (!updateResult) return res.status(500).json({ error: 'Error updating document!' });

	return res.status(204).json();
};

const remove = async (req, res) => {
	const { inventoryId } = req.params;

	const success = await db
		.collection('inventory')
		.doc(inventoryId)
		.delete();

	if (!success) return res.status(404).json({ error: 'Inventory not found!' });

	return res.status(204).json();
};

export { getAll, get, getOne, create, update, remove };
