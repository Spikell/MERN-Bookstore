import React, { useState, useEffect } from 'react';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadCart = () => {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(storedCart);
    };

    loadCart();
    window.addEventListener('storage', loadCart);

    return () => window.removeEventListener('storage', loadCart);
  }, []);

  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => {
      const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
      return sum + itemPrice * item.quantity;
    }, 0);
    setTotal(newTotal);
  }, [cartItems]);

  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (itemId, change) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <div className="container mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center mt-10">Your Cart Items</h2>
      {cartItems.length === 0 ? (
        <p className="text-xl text-gray-600 text-center mt-40">Your cart is empty</p>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cartItems.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img src={item.imageURL} alt={item.name} className="h-20 w-16 object-cover mr-4 rounded" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.author}</div>
                          <div className="text-xs text-gray-400">{item.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        ${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2) || '0.00'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-white bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-l transition duration-200"
                        >
                          <FaMinus />
                        </button>
                        <span className="mx-3 w-8 text-center bg-gray-100 py-1">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-white bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-r transition duration-200"
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-green-600">
                        ${((typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0) * item.quantity).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-white bg-red-500 hover:bg-red-600 p-2 rounded transition duration-200"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex justify-end">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
      <style jsx global>{`
        /* Chrome, Safari, Edge, Opera */
        input[type=number].no-spinner::-webkit-inner-spin-button,
        input[type=number].no-spinner::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        /* Firefox */
        input[type=number].no-spinner {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}

export default Cart;