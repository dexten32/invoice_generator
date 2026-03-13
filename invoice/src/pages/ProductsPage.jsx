import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Package, Tag, DollarSign, List, Search, 
  Filter, ArrowUpRight, ShoppingBag, ArrowRight,
  PlusCircle, LayoutGrid, Box, Archive, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const ProductsPage = () => {
  const [products, setProducts] = useLocalStorage('products', []);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', category: 'Service' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  const addProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    setProducts([{ ...newProduct, id: Date.now() }, ...products]);
    setNewProduct({ name: '', price: '', description: '', category: 'Service' });
    setIsFormVisible(false);
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="page-header-container">
        <div className="page-title-group">
          <div className="page-subheader">
            <Box className="w-4 h-4" />
            Inventory Control
          </div>
          <h1 className="page-title">
            Product <span>Hub</span>
          </h1>
          <p className="page-description">
            Streamline your catalog management with high-precision inventory tracking.
          </p>
        </div>
        
        <div className="action-button-group">
          <Button variant="outline" className="btn-secondary">
            <Archive className="w-4 h-4 mr-2" /> Categories
          </Button>
          <Button 
            onClick={() => setIsFormVisible(true)}
            className="btn-primary"
          >
            <PlusCircle className="w-5 h-5 mr-2" /> Create Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Form Panel Overlay */}
        <AnimatePresence>
          {isFormVisible && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFormVisible(false)}
                className="form-overlay"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="form-panel"
              >
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <PlusCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 leading-none">New Product</h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Catalog Expansion</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsFormVisible(false)} className="rounded-full hover:bg-red-50 group">
                    <Trash2 className="w-5 h-5 text-slate-300 group-hover:text-red-500 transition-colors" />
                  </Button>
                </div>

                <form onSubmit={addProduct} className="space-y-8 flex-1">
                  <div className="space-y-6">
                    <div className="group space-y-2">
                      <label className="form-label group-focus-within:form-label-active">Product Title</label>
                      <div className="form-input-container">
                        <Tag className="form-input-icon" />
                        <Input 
                          placeholder="e.g. Premium Consulting Package" 
                          value={newProduct.name}
                          className="form-input-field text-lg"
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="group space-y-2">
                        <label className="form-label">Base Price ($)</label>
                        <div className="form-input-container">
                          <DollarSign className="form-input-icon" />
                          <Input 
                            type="number"
                            placeholder="0.00" 
                            value={newProduct.price}
                            className="form-input-field"
                            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="group space-y-2">
                        <label className="form-label">Category</label>
                        <select 
                          className="form-select-field"
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                        >
                          <option>Service</option>
                          <option>Physical Product</option>
                          <option>Digital Goods</option>
                          <option>Subscription</option>
                        </select>
                      </div>
                    </div>

                    <div className="group space-y-2">
                      <label className="form-label">Description</label>
                      <div className="relative">
                        <textarea 
                          placeholder="Explain the features and value proposition..." 
                          className="form-textarea-field"
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        />
                        <div className="absolute right-5 bottom-5">
                          <Box className="w-5 h-5 text-slate-100 dark:text-slate-800" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-10 mt-auto">
                    <Button type="submit" className="w-full h-16 bg-slate-900 hover:bg-black text-white rounded-2xl transition-all shadow-xl font-bold text-lg group">
                       Add to Catalog <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                    <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-6">
                      Inventory is synchronized across sessions
                    </p>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="lg:col-span-12 space-y-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="search-container group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none z-10">
                <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              </div>
              <Input 
                placeholder="Search catalog by title or keywords..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="filter-btn">
              <LayoutGrid className="w-5 h-5 mr-3" /> Grid View
            </Button>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredProducts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="empty-state-container dark:bg-slate-900/30 dark:border-white/5"
              >
                 <ShoppingBag className="w-20 h-20 text-slate-200 mb-6" />
                 <h3 className="text-3xl font-black text-slate-900 tracking-tight text-center dark:text-white">No Products Found</h3>
                 <p className="text-slate-500 mt-2 font-medium text-lg max-w-sm text-center dark:text-slate-400">Your catalog is empty. Start adding items to generate invoices faster.</p>
                 <Button 
                   onClick={() => setIsFormVisible(true)}
                   className="mt-10 h-14 px-10 rounded-2xl bg-slate-900 text-white font-bold dark:bg-primary"
                 >
                   Initial Setup
                 </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    key={product.id} 
                    className="glass-card flex flex-col items-stretch overflow-hidden group"
                  >
                    {/* Decorative Background Icon */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50/50 rounded-bl-[100px] -mr-16 -mt-16 group-hover:bg-primary/5 transition-all duration-700 pointer-events-none flex items-center justify-center pt-8 pl-8 dark:bg-slate-800/50">
                       <Package className="w-16 h-16 text-slate-200 group-hover:text-primary/20 group-hover:scale-125 transition-all duration-700" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-10">
                        <div className={cn(
                          "px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm",
                          product.category === 'Service' 
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
                            : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                        )}>
                          {product.category}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all dark:hover:bg-red-900/20"
                          onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>

                      <div className="space-y-4 mb-10">
                        <h3 className="text-2xl font-black text-slate-900 truncate group-hover:text-primary transition-colors tracking-tight leading-none dark:text-white">{product.name}</h3>
                        
                        <div className="flex flex-col">
                          <span className="text-4xl font-black text-slate-950 tracking-tight dark:text-white">${Number(product.price).toLocaleString()}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1.5">
                            <Tag className="w-3 h-3" /> Standard Unit Rate
                          </span>
                        </div>

                        {product.description && (
                          <p className="text-sm text-slate-500 font-medium line-clamp-3 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity pt-2 dark:text-slate-400">
                            {product.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between dark:border-white/5">
                         <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center dark:bg-slate-800">
                               <ShoppingBag className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Catalog Item</span>
                         </div>
                        
                        <button className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-[0.2em] group-hover:gap-3 transition-all">
                          Edit <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
