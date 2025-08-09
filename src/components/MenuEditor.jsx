import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore";

export default function MenuEditor() {
    const [menuItems, setMenuItems] = useState([]);
    const [newItem, setNewItem] = useState({ 
        name: "", 
        description: "", 
        sizes: [
            { label: "Small", price: "" }, 
            { label: "Large", price: "" }
        ] 
    });
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingItemId, setEditingItemId] = useState(null);

    useEffect(() => {
        const fetchMenuItems = async () => {
            const snapshot = await getDocs(collection(db, "menu"));
            setMenuItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };

        const fetchUserRole = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setRole(userDoc.data().role);
                }
            }
            setLoading(false);
        };
        fetchMenuItems();
        fetchUserRole();
    }, []);

    const handleAddItem = async () => {
        if (!newItem.name.trim() === "" || !newItem.description.trim()) return;

        try {
            const capitalizedItem = {
                ...newItem,
                name: newItem.name.toUpperCase(),
                sizes: newItem.sizes.map(size => ({
                    ...size,
                    price: parseFloat(size.price)
                }))
            };

            const docRef = await addDoc(collection(db, "menu"), capitalizedItem);
            setMenuItems([...menuItems, { id: docRef.id, ...capitalizedItem }]);
            setNewItem({
                name: "",
                description: "",
                sizes: [
                    { label: "Small", price: "" },
                    { label: "Large", price: "" }
                ]
            });
        }catch (err) {
            console.error("Error adding item:", err);
        }
    };

    const handleUpdateItem = async (id) => {
        const itemToUpdate = menuItems.find(item => item.id === id);
        if (!itemToUpdate) return;

        try { 
            await updateDoc(doc(db, "menu", id), {
                ...itemToUpdate,
                sizes: itemToUpdate.sizes.map(size => ({
                    ...size,
                    price: parseFloat(size.price)
                }))
            });
            setEditingItemId(null);
        } catch (err) {
            console.error("Error updating item:", err);
        }
    };

    const handleDeleteItem = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            await deleteDoc(doc(db, "menu", id));
            setMenuItems(menuItems.filter(item => item.id !== id));
        } catch (err) {
            console.error("Error deleting item:", err);
        }
    };

    const handleEditChange = (id, field, value) => {
        setMenuItems(menuItems.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleEditSizeChange = (itemId, sizeIndex, field, value) => {
        setMenuItems(menuItems.map(item => {
            if (item.id === itemId) {
                const updatedSizes = [...item.sizes];
                updatedSizes[sizeIndex][field] = value;
                return { ...item, sizes: updatedSizes };
            }
            return item;
        }))
    };

    const handleSizeChange = (index, field, value) => {
        const updatedSizes = [...newItem.sizes];
        updatedSizes[index][field] = value;
        setNewItem(prev => ({ ...prev, sizes: updatedSizes }));
    };

    if (loading) {
        return <p className="text-center text-white">Loading...</p>;
    }

    if (role !== "manager") {
        return <p className="text-center text-red-500">Access Denied. You do not have permission to edit the menu.</p>
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg mt-10">
            <h2 className="text-3xl font-bold mb-6">Menu Editor (Manager Only)</h2>

            <div className="space-y-4 mb-10">
                <input 
                    type="text"
                    placeholder="Dish Name"
                    value={newItem.name}
                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full p-2 rounded bg-gray-800 border border-white/20" 
                />
                <textarea 
                    placeholder="Description" 
                    value={newItem.description}
                    onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                    className="w-full p-2 rounded bg-gray-800 border border-white/20"
                />
                    {newItem.sizes.map((size, idx) => (
                        <div key={idx} className="flex space-x-2">
                            <input 
                                type="text"
                                placeholder="Size Label"
                                value={size.label}
                                onChange={e => handleSizeChange(idx, "label", e.target.value)}
                                className="p-2 rounded bg-gray-800 border border-white/20"
                            />
                            <input 
                                type="number"
                                placeholder="Price"
                                value={size.price}
                                onChange={e => handleSizeChange(idx, "price", e.target.value)}
                                className="p-2 rounded bg-gray-800 border border-white/20" 
                            />
                        </div>
                    ))}
                    <button
                        onClick={handleAddItem}
                        className="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
                    >
                        Add Item
                    </button>
                </div>

                <div>
                    <h3 className="text-2xl font-bold mb-4">Current Menu Items</h3>
                    {menuItems.map((item) => (
                        <div key={item.id} className="bg-gray-800 p-4 rounded mb-4">
                            {editingItemId === item.id ? (
                                <>
                                    <input 
                                        type="text" 
                                        value={item.name}
                                        onChange={e => handleEditChange(item.id, "name", e.target.value)}
                                        className="w-full p-2 mb-2 rounded bg-gray-700"    
                                    />
                                    <textarea
                                        value={item.description}
                                        onChange={e => handleEditChange(item.id, "description", e.target.value)}
                                        className="w-full p-2 mb-2 rounded bg-gray-700"
                                    />
                                    {item.sizes.map((size, idx) => (
                                        <div key={idx} className="flex space-x-2 mb-2">
                                            <input 
                                                type="text" 
                                                value={size.label}
                                                onChange={e => handleEditSizeChange(item.id, idx, "label", e.target.value)}
                                                className="p-2 rounded bg-gray-700"
                                            />
                                            <input 
                                                type="number" 
                                                value={size.price}
                                                onChange={e => handleEditSizeChange(item.id, idx, "price", e.target.value)}
                                                className="p-2 rounded bg-gray-700"    
                                            />
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => handleUpdateItem(item.id)}
                                        className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600 mr-2"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingItemId(null)}
                                        className="px-3 py-1 bg-gray-500 rounded hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h4 className="text-xl">{item.name}</h4>
                                    <p>{item.description}</p>
                                    <p>Sizes:{" "} 
                                        {item.sizes.map(size => `${size.label} ($${size.price.toFixed(2)})`).join(", ")}
                                    </p>
                                    <button
                                        onClick={() => setEditingItemId(item.id)}
                                        className="px-3 py-1 bg-yellow-500 rounded hover:bg-yellow-600 mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="px-3 py-1 bg-red-500 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
        </div>
    );
}