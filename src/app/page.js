"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "../../lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal"; // Import Modal

export default function DigitalMenu() {
  const [cafes, setCafes] = useState([]);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [newCafeName, setNewCafeName] = useState("");
  const [newCafeImage, setNewCafeImage] = useState("");
  const [editingCafe, setEditingCafe] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [newItem, setNewItem] = useState({ name: "", description: "", price: "", image: "" });
  const [editingItem, setEditingItem] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, type: "", id: "" }); // حالت Modal
  const router = useRouter();

  // بررسی وضعیت لاگین
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    if (!loggedIn) {
      router.push("/login");
    } else {
      fetchCafes();
    }
  }, [router]);

  const fetchCafes = async () => {
    const querySnapshot = await getDocs(collection(db, "cafes"));
    const cafeList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCafes(cafeList);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  const addCafe = async () => {
    if (!newCafeName) return;
    const newCafe = { name: newCafeName, image: newCafeImage, categories: [] };
    const docRef = await addDoc(collection(db, "cafes"), newCafe);
    setCafes([...cafes, { id: docRef.id, ...newCafe }]);
    setNewCafeName("");
    setNewCafeImage("");
  };

  const editCafe = async () => {
    if (!editingCafe || !newCafeName) return;
    const cafeRef = doc(db, "cafes", editingCafe.id);
    await updateDoc(cafeRef, { name: newCafeName, image: newCafeImage });
    setCafes(cafes.map(cafe => (cafe.id === editingCafe.id ? { ...cafe, name: newCafeName, image: newCafeImage } : cafe)));
    setSelectedCafe({ ...selectedCafe, name: newCafeName, image: newCafeImage });
    setEditingCafe(null);
    setNewCafeName("");
    setNewCafeImage("");
  };

  const deleteCafe = async (id) => {
    await deleteDoc(doc(db, "cafes", id));
    setCafes(cafes.filter(cafe => cafe.id !== id));
    setDeleteConfirmation({ show: false, type: "", id: "" }); // بستن Modal پس از حذف
  };

  const addCategory = async () => {
    if (!selectedCafe || !newCategoryName) return;
    const newCategory = { name: newCategoryName, image: newCategoryImage, items: [] };
    const updatedCategories = [...(selectedCafe.categories || []), newCategory];
    const cafeRef = doc(db, "cafes", selectedCafe.id);
    await updateDoc(cafeRef, { categories: updatedCategories });
    setCafes(cafes.map(cafe => (cafe.id === selectedCafe.id ? { ...cafe, categories: updatedCategories } : cafe)));
    setSelectedCafe({ ...selectedCafe, categories: updatedCategories });
    setNewCategoryName("");
    setNewCategoryImage("");
  };

  const editCategory = async () => {
    if (!selectedCafe || !editingCategory || !newCategoryName) return;
    const updatedCategories = selectedCafe.categories.map(cat =>
      cat.name === editingCategory.name ? { ...cat, name: newCategoryName, image: newCategoryImage } : cat
    );
    const cafeRef = doc(db, "cafes", selectedCafe.id);
    await updateDoc(cafeRef, { categories: updatedCategories });
    setCafes(cafes.map(cafe => (cafe.id === selectedCafe.id ? { ...cafe, categories: updatedCategories } : cafe)));
    setSelectedCafe({ ...selectedCafe, categories: updatedCategories });
    setEditingCategory(null);
    setNewCategoryName("");
    setNewCategoryImage("");
  };

  const deleteCategory = async (categoryName) => {
    if (!selectedCafe) return;
    const updatedCategories = selectedCafe.categories.filter(cat => cat.name !== categoryName);
    const cafeRef = doc(db, "cafes", selectedCafe.id);
    await updateDoc(cafeRef, { categories: updatedCategories });
    setCafes(cafes.map(cafe => (cafe.id === selectedCafe.id ? { ...cafe, categories: updatedCategories } : cafe)));
    setSelectedCafe({ ...selectedCafe, categories: updatedCategories });
    setSelectedCategory(null);
    setDeleteConfirmation({ show: false, type: "", id: "" }); // بستن Modal پس از حذف
  };

  const addMenuItem = async () => {
    if (!selectedCafe || !selectedCategory) return;
    const updatedCategories = selectedCafe.categories.map(cat =>
      cat.name === selectedCategory.name ? { ...cat, items: [...(cat.items || []), newItem] } : cat
    );
    const cafeRef = doc(db, "cafes", selectedCafe.id);
    await updateDoc(cafeRef, { categories: updatedCategories });
    setCafes(cafes.map(cafe => (cafe.id === selectedCafe.id ? { ...cafe, categories: updatedCategories } : cafe)));
    setSelectedCafe({ ...selectedCafe, categories: updatedCategories });
    setSelectedCategory(updatedCategories.find(cat => cat.name === selectedCategory.name));
    setNewItem({ name: "", description: "", price: "", image: "" });
  };

  const editMenuItem = async () => {
    if (!selectedCafe || !selectedCategory || !editingItem) return;
    const updatedCategories = selectedCafe.categories.map(cat =>
      cat.name === selectedCategory.name
        ? {
            ...cat,
            items: cat.items.map(item =>
              item.name === editingItem.name ? { ...newItem } : item
            ),
          }
        : cat
    );
    const cafeRef = doc(db, "cafes", selectedCafe.id);
    await updateDoc(cafeRef, { categories: updatedCategories });
    setCafes(cafes.map(cafe => (cafe.id === selectedCafe.id ? { ...cafe, categories: updatedCategories } : cafe)));
    setSelectedCafe({ ...selectedCafe, categories: updatedCategories });
    setSelectedCategory(updatedCategories.find(cat => cat.name === selectedCategory.name));
    setEditingItem(null);
    setNewItem({ name: "", description: "", price: "", image: "" });
  };

  const deleteMenuItem = async (itemName) => {
    if (!selectedCafe || !selectedCategory) return;
    const updatedCategories = selectedCafe.categories.map(cat =>
      cat.name === selectedCategory.name
        ? {
            ...cat,
            items: cat.items.filter(item => item.name !== itemName),
          }
        : cat
    );
    const cafeRef = doc(db, "cafes", selectedCafe.id);
    await updateDoc(cafeRef, { categories: updatedCategories });
    setCafes(cafes.map(cafe => (cafe.id === selectedCafe.id ? { ...cafe, categories: updatedCategories } : cafe)));
    setSelectedCafe({ ...selectedCafe, categories: updatedCategories });
    setSelectedCategory(updatedCategories.find(cat => cat.name === selectedCategory.name));
    setDeleteConfirmation({ show: false, type: "", id: "" }); // بستن Modal پس از حذف
  };

  const handleDelete = (type, id) => {
    setDeleteConfirmation({ show: true, type, id }); // نمایش Modal
  };

  const confirmDelete = () => {
    if (deleteConfirmation.type === "cafe") {
      deleteCafe(deleteConfirmation.id);
    } else if (deleteConfirmation.type === "category") {
      deleteCategory(deleteConfirmation.id);
    } else if (deleteConfirmation.type === "item") {
      deleteMenuItem(deleteConfirmation.id);
    }
  };

  if (!isLoggedIn) {
    return null; // یا می‌توانید یک اسپینر نمایش دهید
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Digital Menu</h1>
        <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">
          Logout
        </Button>
      </div>

      {/* افزودن کافه */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Cafe</h2>
        <input
          type="text"
          placeholder="New Cafe Name"
          value={newCafeName}
          onChange={(e) => setNewCafeName(e.target.value)}
          className="border p-2 mb-4 w-full rounded-lg"
        />
        <input
          type="text"
          placeholder="Cafe Image URL"
          value={newCafeImage}
          onChange={(e) => setNewCafeImage(e.target.value)}
          className="border p-2 mb-4 w-full rounded-lg"
        />
        <Button onClick={addCafe} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
          Add Cafe
        </Button>
      </div>

      {/* لیست کافه‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {cafes.map(cafe => (
          <div key={cafe.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            {cafe.image && (
              <img src={cafe.image} alt={cafe.name} className="w-24 h-24 object-cover rounded-lg mb-2" />
            )}
            <Button onClick={() => setSelectedCafe(cafe)} className="w-full bg-green-500 hover:bg-green-600 text-white mb-2">
              {cafe.name}
            </Button>
            <div className="flex gap-2">
              <Button onClick={() => { setEditingCafe(cafe); setNewCafeName(cafe.name); setNewCafeImage(cafe.image); }} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                Edit
              </Button>
              <Button onClick={() => handleDelete("cafe", cafe.id)} className="bg-red-500 hover:bg-red-600 text-white">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* مدیریت دسته‌بندی‌ها */}
      {selectedCafe && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold mb-4">{selectedCafe.name} Categories</h2>
          <input
            type="text"
            placeholder="New Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="border p-2 mb-2 w-full rounded-lg"
          />
          <input
            type="text"
            placeholder="Category Image URL"
            value={newCategoryImage}
            onChange={(e) => setNewCategoryImage(e.target.value)}
            className="border p-2 mb-4 w-full rounded-lg"
          />
          <Button onClick={addCategory} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            Add Category
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {selectedCafe.categories?.map((cat, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col items-center">
                {cat.image && (
                  <img src={cat.image} alt={cat.name} className="w-24 h-24 object-cover rounded-lg mb-2" />
                )}
                <Button onClick={() => setSelectedCategory(cat)} className="w-full bg-green-500 hover:bg-green-600 text-white mb-2">
                  {cat.name}
                </Button>
                <div className="flex gap-2">
                  <Button onClick={() => { setEditingCategory(cat); setNewCategoryName(cat.name); setNewCategoryImage(cat.image); }} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete("category", cat.name)} className="bg-red-500 hover:bg-red-600 text-white">
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* مدیریت آیتم‌ها */}
      {selectedCategory && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-xl font-semibold mb-4">{selectedCategory.name} Items</h3>

          {selectedCategory.items?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedCategory.items.map((item, index) => (
                <Card key={index} className="p-4 border rounded-lg shadow-sm">
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-32 object-cover mb-2 rounded-lg" />}
                  <h4 className="text-lg font-bold">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-green-600 font-semibold"> € {item.price}</p>
                  <div className="flex gap-2 mt-2">
                    <Button onClick={() => { setEditingItem(item); setNewItem(item); }} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete("item", item.name)} className="bg-red-500 hover:bg-red-600 text-white">
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No items in this category.</p>
          )}

          <div className="mt-6">
            <input
              type="text"
              placeholder="Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="border p-2 mb-2 w-full rounded-lg"
            />
            <input
              type="text"
              placeholder="Description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="border p-2 mb-2 w-full rounded-lg"
            />
            <input
              type="text"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              className="border p-2 mb-2 w-full rounded-lg"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newItem.image}
              onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
              className="border p-2 mb-4 w-full rounded-lg"
            />
            {editingItem ? (
              <Button onClick={editMenuItem} className="w-full bg-green-500 hover:bg-green-600 text-white">
                Save Changes
              </Button>
            ) : (
              <Button onClick={addMenuItem} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                Add Item
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Modal تأییدیه حذف */}
      <DeleteConfirmationModal
        isOpen={deleteConfirmation.show}
        onClose={() => setDeleteConfirmation({ show: false, type: "", id: "" })}
        onConfirm={confirmDelete}
      />
    </div>
  );
}