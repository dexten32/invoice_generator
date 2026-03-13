import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Plus, Trash2, User, Users, Mail, MapPin, Search, Filter, Download, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const CustomersPage = () => {
  const [customers, setCustomers] = useLocalStorage('customers', []);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', address: '', phone: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const addCustomer = (e) => {
    e.preventDefault();
    if (!newCustomer.name) return;
    setCustomers([{ ...newCustomer, id: Date.now() }, ...customers]);
    setNewCustomer({ name: '', email: '', address: '', phone: '' });
  };

  const deleteCustomer = (id) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Client Directory
            <span className="text-xs font-bold bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full">{customers.length}</span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Manage your relationships and contact database.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none h-12 px-6 rounded-xl border-slate-200">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button className="flex-1 md:flex-none h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20">
            <Plus className="w-4 h-4 mr-2" /> New Client
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Left Column: Form */}
        <div className="xl:col-span-4">
          <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white sticky top-10 rounded-3xl overflow-hidden ring-1 ring-slate-100">
            <div className="h-2 bg-primary" />
            <CardHeader className="pt-8 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <User className="w-5 h-5 text-primary" />
                Quick Add Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pb-8">
              <form onSubmit={addCustomer} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Full Name</label>
                  <Input 
                    placeholder="e.g. John Doe" 
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Email Address</label>
                  <Input 
                    type="email"
                    placeholder="john@company.com" 
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Phone Number</label>
                  <Input 
                    placeholder="+1 234 567 890" 
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Address</label>
                  <Input 
                    placeholder="City, Country" 
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                  />
                </div>
                <Button type="submit" className="w-full h-12 bg-slate-900 hover:bg-black text-white rounded-xl transition-all shadow-lg font-bold">
                   Save Contact
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: List */}
        <div className="xl:col-span-8 space-y-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Search by name, email or company..." 
                className="pl-12 h-14 bg-white border-none shadow-lg text-lg rounded-2xl ring-1 ring-slate-100 placeholder:text-slate-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-14 px-6 rounded-2xl border-none shadow-lg bg-white ring-1 ring-slate-100 font-bold text-slate-600">
              <Filter className="w-5 h-5 mr-2" /> Filters
            </Button>
          </div>

          {filteredCustomers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] shadow-xl shadow-slate-100 ring-1 ring-slate-50 border-2 border-dashed border-slate-100 overflow-hidden">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 relative">
                 <User className="w-12 h-12 text-slate-200" />
                 <div className="absolute top-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                   <Users className="w-4 h-4 text-blue-400" />
                 </div>
              </div>
              <h3 className="text-2xl font-black text-slate-900">No clients found</h3>
              <p className="text-slate-400 mt-2 font-medium max-w-[280px] text-center">Your directory is empty or no results match your search.</p>
              <Button variant="ghost" className="mt-8 text-primary font-bold hover:bg-blue-50 py-6 px-10 rounded-2xl">
                Upload CSV File
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCustomers.map((customer, index) => (
                <div 
                  key={customer.id} 
                  className="group relative bg-white p-7 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 ring-1 ring-slate-50 overflow-hidden animate-in fade-in zoom-in-95"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-2xl group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                      {customer.name.charAt(0)}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      onClick={() => deleteCustomer(customer.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-primary transition-colors">{customer.name}</h3>
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
                        <div className="p-1.5 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                          <Mail className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <span className="truncate">{customer.email || 'No email contact'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
                        <div className="p-1.5 rounded-lg bg-orange-50 group-hover:bg-orange-100 transition-colors">
                          <MapPin className="w-3.5 h-3.5 text-orange-500" />
                        </div>
                        <span className="truncate">{customer.address || 'Address not listed'}</span>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
                          <div className="p-1.5 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
                            <Phone className="w-3.5 h-3.5 text-emerald-500" />
                          </div>
                          <span>{customer.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-5 border-t border-slate-50 flex justify-between items-center">
                    <div className="flex -space-x-1.5">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100" />
                      ))}
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-primary transition-colors">
                      Client Profile
                    </button>
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

export default CustomersPage;
