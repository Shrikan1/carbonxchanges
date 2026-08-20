import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as marketplaceApi from '../../api/endpoint/marketplaceApi';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { FiPlus, FiTag, FiAlertCircle, FiTrash2 } from 'react-icons/fi';
import { motion } from 'motion/react';
import SellerHeader from '../../components/layout/SellerHeader';

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [form, setForm] = useState({ batch_id: '', price_per_credit: '', amount_listed: '' });
  const [error, setError] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await marketplaceApi.getMyListings();
    setListings(data.data || []);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);
    try {
      await marketplaceApi.createListing({
        batch_id: Number(form.batch_id),
        price_per_credit: Number(form.price_per_credit),
        amount_listed: Number(form.amount_listed),
      });
      setForm({ batch_id: '', price_per_credit: '', amount_listed: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create listing');
    }
  }

  async function handleCancel(id) {
    if (!window.confirm('Cancel this listing?')) return;
    await marketplaceApi.cancelListing(id);
    load();
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#f4f7f5] text-gray-900 py-8 font-sans">
      <SellerHeader 
        title="My Listings" 
        description="Manage your active marketplace listings and create new ones."
        contentMaxWidth="1200px"
        // action={
        //   // <Link to="/seller/listings/new" className="bg-brand hover:bg-brand-hover text-gray-900 font-bold h-10 px-6 rounded-xl flex items-center justify-center transition-colors shadow-sm">
        //   //   + New Listing
        //   // </Link>
        // }
      />
      <div className="w-full max-w-[1200px] px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Create Listing Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <FiPlus size={18} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">New Listing</h2>
                </div>

                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Batch ID</Label>
                    <Input 
                      value={form.batch_id} 
                      onChange={(e) => setForm({ ...form, batch_id: e.target.value })} 
                      required 
                      className="mt-1.5 h-11 bg-gray-50 border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Price per Credit ($)</Label>
                    <Input 
                      type="number" 
                      step="0.01" 
                      value={form.price_per_credit} 
                      onChange={(e) => setForm({ ...form, price_per_credit: e.target.value })} 
                      required 
                      className="mt-1.5 h-11 bg-gray-50 border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Amount to List</Label>
                    <Input 
                      type="number" 
                      step="0.01" 
                      value={form.amount_listed} 
                      onChange={(e) => setForm({ ...form, amount_listed: e.target.value })} 
                      required 
                      className="mt-1.5 h-11 bg-gray-50 border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-xl flex items-start gap-2 text-sm">
                      <FiAlertCircle className="mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <Button type="submit" className="w-full h-11 bg-gray-900 hover:bg-black text-white font-bold rounded-xl mt-6 shadow-sm">
                    Create Listing
                  </Button>
                </form>
              </div>
            </div>

            {/* Active Listings List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[400px]">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Active & Past Listings</h3>
                
                <div className="space-y-4">
                  {listings.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 border border-dashed border-gray-200 rounded-2xl">
                      <FiTag size={24} className="mx-auto mb-3 text-gray-400" />
                      <p>You have no marketplace listings.</p>
                    </div>
                  ) : (
                    listings.map((l) => (
                      <div key={l.id} className="border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-emerald-200 transition-colors">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-bold text-gray-900">{l.project_title}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${l.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                              {l.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold text-gray-700">{l.amount_sold}</span> sold out of <span className="font-semibold text-gray-700">{l.amount_listed}</span> @ <span className="font-semibold text-emerald-600">₹{Number(l.price_per_credit).toFixed(2)}</span>
                          </p>
                        </div>
                        {l.status === 'active' && (
                          <Button 
                            variant="outline" 
                            onClick={() => handleCancel(l.id)}
                            className="bg-red-50 border-red-100 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-xl px-4 h-9 font-semibold text-xs flex items-center gap-2"
                          >
                            <FiTrash2 size={14} /> Cancel
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}