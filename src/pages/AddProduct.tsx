import React, { useState, useEffect } from 'react';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import Header from '../components/Header';

interface Product {
  productName: string;
  price: number;
  quantity: number;
}

const AddProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    productName: '',
    price: 0,
    quantity: 0,
  });
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No authentication token found.");
          return;
        }

        const response = await fetch('http://localhost:5000/products', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setProducts(data.products);
        } else {
          console.error("Error fetching products:", data.message);
        }
      } catch (error) {
        console.error("Error during products fetch:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    if (newProduct.productName && newProduct.price && newProduct.quantity) {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/addProduct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(newProduct),
        });

        const data = await response.json();

        if (response.ok) {
          setProducts([...products, newProduct]);
          setNewProduct({ productName: '', price: 0, quantity: 0 });
          console.log("Product added successfully:", data);
        } else {
          console.error("Error adding product:", data.message);
        }
      } catch (error) {
        console.error("Error during product addition:", error);
      }
    }
  };

  const calculateSubTotal = () => {
    return products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  };

  const calculateTotal = () => {
    const subTotal = calculateSubTotal();
    return subTotal + (subTotal * 0.18);
  };

  const handleGenerateInvoice = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No authentication token found.");
      return;
    }

    setLoading(true); 
    try {
      const response = await fetch('http://localhost:5000/generate-invoice', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const downloadUrl = data.url;

        if (downloadUrl) {
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `Invoice_${new Date().toISOString()}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          console.error('No download URL provided by the server.');
        }
      } else {
        const error = await response.json();
        console.error('Error generating invoice:', error.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error during invoice generation:', error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <>
      <div className="absolute z-30 top-0 left-1/3 w-[150px] blur-[90px] h-[150px] bg-[#4F59A8] opacity-70 pointer-events-none rounded-full"></div>
      <Header />
      <div className="min-h-screen p-12 bg-[#141414] text-white">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-4">
          <div className="mb-8">
            <h1 className="text-2xl font-pretendard mb-2">Add Products</h1>
            <p className="text-gray-400 font-mukta">This is basic login page which is used for levitation assignment purpose.</p>
          </div>

          {/* Input Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 font-poppins">
            <div>
              <label className="block mb-2">Product Name</label>
              <Input
                placeholder="Enter the product name"
                className="bg-[#202020] text-[#B3B3B3] border-[#424647]"
                value={newProduct.productName}
                onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2">Product Price</label>
              <Input
                type="number"
                placeholder="Enter the price"
                className="bg-[#202020] border-[#424647]"
                value={newProduct.price || ''}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="block mb-2">Quantity</label>
              <Input
                type="number"
                placeholder="Enter the Qty"
                className="bg-[#202020] border-[#424647]"
                value={newProduct.quantity || ''}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex justify-center items-center mb-6">
            <Button
              className="bg-[#302f2f] hover:bg-[#3b3a3a] text-[#CCF575] font-pretendard"
              onClick={handleAddProduct}
            >
              Add Product
            </Button>
          </div>

          {/* Products Table */}
          <div className="mt-8 bg-gray-900 rounded-lg overflow-x-auto font-inter">
            <table className="w-full border-collapse">
              <thead className="bg-[#ffffffc8] text-black">
                <tr>
                  <th className="text-left p-4 border-b border-gray-700">Product name</th>
                  <th className="text-left p-4 border-b border-gray-700">Price</th>
                  <th className="text-left p-4 border-b border-gray-700">Quantity</th>
                  <th className="text-left p-4 border-b border-gray-700">Total Price</th>
                </tr>
              </thead>
              <tbody className='bg-[#141414]'>
                {products.map((product, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="p-4">{product.productName}</td>
                    <td className="p-4">{product.price}</td>
                    <td className="p-4">{product.quantity}</td>
                    <td className="p-4">INR {product.price * product.quantity}</td>
                  </tr>
                ))}
                <tr className="border-b border-gray-700">
                  <td colSpan={3} className="p-4 text-right">Sub-Total</td>
                  <td className="p-4">INR {calculateSubTotal().toFixed(2)}</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td colSpan={3} className="p-4 text-right">Incl + GST 18%</td>
                  <td className="p-4">INR {calculateTotal().toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bottom Buttons */}
          <div className="mt-6 space-y-4 flex justify-center items-center">
            <Button
              className={`w-1/3 bg-[#302f2f] hover:bg-[#3b3a3a] text-[#CCF575] font-pretendard ${
                loading ? 'cursor-not-allowed opacity-50' : ''
              }`}
              onClick={handleGenerateInvoice}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate PDF Invoice'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
