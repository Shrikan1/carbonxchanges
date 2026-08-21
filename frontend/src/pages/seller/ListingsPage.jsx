import { useEffect, useState } from 'react';
import * as marketplaceApi from '../../api/endpoint/marketplaceApi';
import SellerLayout from '../../components/layout/SellerLayout';
import { FiPlus, FiTag, FiTrash2, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [form, setForm] = useState({ batch_id: '', price_per_credit: '', amount_listed: '', image_url: '' });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const { data } = await marketplaceApi.getMyListings();
      setListings(data.data || []);
    } catch (err) {
      console.error('Failed to load listings:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      let uploadedUrl = form.image_url;
      
      if (form.imageFile) {
        const uploadRes = await marketplaceApi.uploadMedia(form.imageFile);
        uploadedUrl = uploadRes.data.url;
      }

      await marketplaceApi.createListing({
        batch_id: Number(form.batch_id),
        price_per_credit: Number(form.price_per_credit),
        amount_listed: Number(form.amount_listed),
        image_url: uploadedUrl || undefined,
      });
      setForm({ batch_id: '', price_per_credit: '', amount_listed: '', image_url: '', imageFile: null, previewUrl: null });
      await load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCancel(id) {
    if (!window.confirm('Cancel this listing?')) return;
    try {
      await marketplaceApi.cancelListing(id);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel listing');
    }
  }

  return (
    <SellerLayout title="My Listings" subtitle="Manage your active marketplace listings and create new ones.">
      <div className="p-6 lg:p-8 max-w-[1200px] mx-auto w-full space-y-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Create Listing Form (Left Column) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:sticky lg:top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <FiPlus size={18} />
                </div>
                <div>
                  <h2 className="text-base wise-font font-black uppercase text-gray-900 tracking-tight">New Listing</h2>
                  <p className="text-xs font-mono text-gray-500 mt-0.5">List batch credits for sale</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-start gap-2.5 text-sm">
                  <FiAlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p className="leading-tight">{error}</p>
                </div>
              )}

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold font-mono text-[#0c0c0c] uppercase tracking-wider mb-1.5">Batch ID</label>
                  <input 
                    value={form.batch_id} 
                    onChange={(e) => setForm({ ...form, batch_id: e.target.value })} 
                    required 
                    className="w-full h-11 bg-gray-50 border border-[#0c0c0c] px-4 font-mono text-sm focus:bg-white focus:outline-none transition-all"
                    placeholder="e.g. 12"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold font-mono text-[#0c0c0c] uppercase tracking-wider mb-1.5">Price per Credit ($)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={form.price_per_credit} 
                    onChange={(e) => setForm({ ...form, price_per_credit: e.target.value })} 
                    required 
                    className="w-full h-11 bg-gray-50 border border-[#0c0c0c] px-4 font-mono text-sm focus:bg-white focus:outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold font-mono text-[#0c0c0c] uppercase tracking-wider mb-1.5">Amount to List</label>
                  <input 
                    type="number" 
                    value={form.amount_listed} 
                    onChange={(e) => setForm({ ...form, amount_listed: e.target.value })} 
                    required 
                    className="w-full h-11 bg-gray-50 border border-[#0c0c0c] px-4 font-mono text-sm focus:bg-white focus:outline-none transition-all"
                    placeholder="Number of credits"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold font-mono text-[#0c0c0c] uppercase tracking-wider mb-1.5">Project Image</label>
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setForm({ ...form, image_url: '', imageFile: file, previewUrl: URL.createObjectURL(file) });
                      }
                    }} 
                    className="w-full text-sm font-mono file:mr-4 file:py-2.5 file:px-4 file:border-0 file:text-xs file:font-bold file:bg-[#0c0c0c] file:text-white hover:file:bg-[#222] transition-colors cursor-pointer border border-[#0c0c0c] bg-gray-50 h-11"
                  />
                  {form.previewUrl && (
                    <div className="mt-3 relative w-full h-32 border border-[#0c0c0c] overflow-hidden">
                      <img src={form.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setForm({ ...form, imageFile: null, previewUrl: null })}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-sm shadow-sm hover:bg-red-600"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full mt-2 h-11 bg-primary hover:bg-[#a3e635] disabled:opacity-50 text-[#0c0c0c] font-mono font-bold transition-colors flex items-center justify-center gap-2 border border-[#0c0c0c] shadow-[4px_4px_0_0_#0c0c0c]"
                >
                  {isSubmitting ? 'Creating...' : 'Create Listing'}
                </button>
              </form>
            </div>
          </div>

          {/* Active Listings (Right Column) */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col">
              <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-2">
                <FiTag className="text-emerald-600" />
                <h2 className="text-base wise-font font-black uppercase text-gray-900 tracking-tight">Active Listings</h2>
              </div>

              {loading ? (
                <div className="p-6 space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : listings.length === 0 ? (
                <div className="p-16 text-center flex flex-col items-center justify-center flex-1">
                  <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4">
                    <FiTag className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg wise-font font-black uppercase text-gray-900 mb-1">No active listings</h3>
                  <p className="text-sm font-mono text-gray-500 max-w-sm">Use the form to list your batch credits on the marketplace.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 flex-1">
                  <div className="hidden sm:grid grid-cols-[100px_1fr_100px_100px_100px_60px] px-6 py-3 text-xs font-mono font-bold tracking-wider text-gray-500 uppercase bg-gray-50">
                    <span>Batch ID</span>
                    <span>Listed Date</span>
                    <span>Amount</span>
                    <span>Price</span>
                    <span>Status</span>
                    <span className="text-right">Action</span>
                  </div>
                  {listings.map((l) => (
                    <div key={l.id} className="group hover:bg-gray-50/50 transition-colors px-6 py-5">
                      <div className="flex flex-col sm:grid sm:grid-cols-[100px_1fr_100px_100px_100px_60px] gap-3 sm:gap-0 items-start sm:items-center">
                        <div className="text-sm font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded w-fit">
                          B-{String(l.batch_id).padStart(4, '0')}
                        </div>
                        
                        <div className="text-sm font-mono text-gray-500">
                          {new Date(l.created_at).toLocaleDateString()}
                        </div>
                        
                        <div className="text-sm font-mono font-bold text-gray-900">
                          {l.amount_listed} <span className="text-xs font-medium text-gray-500">tCO2e</span>
                        </div>
                        
                        <div className="text-sm font-mono font-bold text-emerald-600">
                          ${l.price_per_credit}
                        </div>

                        <div className="text-xs font-bold uppercase tracking-wider">
                          <span className={`px-2 py-1 rounded-full ${
                            l.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                            l.status === 'partially_sold' ? 'bg-blue-100 text-blue-700' :
                            l.status === 'sold_out' ? 'bg-gray-100 text-gray-700' :
                            'bg-red-100 text-red-700' // cancelled
                          }`}>
                            {l.status.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <div className="w-full flex justify-end">
                          {(l.status === 'active' || l.status === 'partially_sold') && (
                            <button 
                              onClick={() => handleCancel(l.id)} 
                              className="text-gray-400 hover:text-red-600 p-2 rounded hover:bg-red-50 transition-colors"
                              title="Cancel Listing"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}