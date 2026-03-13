import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Plus, Trash2, Package, Tag, DollarSign, List, Search, Filter, ArrowUpRight, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const ProductsPage = () => {
  const [products, setProducts] = useLocalStorage('products', []);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', category: 'Service' });
  const [searchTerm, setSearchTerm] = useState('');

  const addProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    setProducts([{ ...newProduct, id: Date.now() }, ...products]);
    setNewProduct({ name: '', price: '', description: '', category: 'Service' });
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             Inventory Hub
            <span className="text-xs font-bold bg-indigo-100 text-indigo-600 px-2.5 py-1 rounded-full">{products.length}</span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Manage your products, services, and pricing models.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none h-12 px-6 rounded-xl border-slate-200">
            Categories
          </Button>
          <Button className="flex-1 md:flex-none h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20">
            <Plus className="w-4 h-4 mr-2" /> New Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Left Column: Form */}
        <div className="xl:col-span-4">
          <Card className="border-none shadow-2xl shadow-slate-200/60 bg-white sticky top-10 rounded-3xl overflow-hidden ring-1 ring-slate-100">
            <div className="h-2 bg-indigo-600" />
            <CardHeader className="pt-8 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <Package className="w-5 h-5 text-indigo-600" />
                Product Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pb-8">
              <form onSubmit={addProduct} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Title</label>
                  <Input 
                    placeholder="e.g. Monthly SEO Package" 
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-1">Price (₹)</label>
                    <Input 
                      type="number"
                      placeholder="0.00" 
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-1">Category</label>
                    <select 
                      className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      <option>Service</option>
                      <option>Product</option>
                      <option>Subscription</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Description</label>
                  <textarea 
                    placeholder="Briefly describe the offering..." 
                    className="w-full min-h-[120px] p-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-slate-300"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  />
                </div>
                <Button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg font-bold group">
                  Add to Inventory <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: List */}
        <div className="xl:col-span-8 space-y-8">
          <div className="bg-white p-2 rounded-2xl shadow-lg ring-1 ring-slate-100 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Search inventory..." 
                className="pl-12 h-14 border-none shadow-none text-lg rounded-2xl placeholder:text-slate-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-slate-50/30 rounded-[40px] border-2 border-dashed border-slate-100">
               <Package className="w-16 h-16 text-slate-200 mb-4" />
               <p className="text-slate-400 font-bold italic">No items found in your catalog.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="group relative bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden ring-1 ring-slate-50 animate-in fade-in zoom-in-95"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 rounded-bl-[80px] -mr-16 -mt-16 group-hover:bg-indigo-100/50 transition-all duration-500" />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className={cn(
                        "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                        product.category === 'Service' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                      )}>
                        {product.category}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        onClick={() => deleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <h3 className="text-2xl font-black text-slate-800 mb-3 truncate group-hover:text-indigo-600 transition-colors tracking-tight">{product.name}</h3>
                    
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-slate-900">₹{Number(product.price).toLocaleString('en-IN')}</span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Base Rate</span>
                    </div>

                    {product.description && (
                      <p className="mt-5 text-sm text-slate-500 line-clamp-2 leading-relaxed h-10 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                        {product.description}
                      </p>
                    )}

                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100" />
                        ))}
                      </div>
                      <button className="text-indigo-600 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-3 transition-all">
                        Details <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
