// src/pages/seller/ListingsPage.jsx
import { useEffect, useState } from 'react';
import * as marketplaceApi from '../../api/endpoint/marketplaceApi';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [form, setForm] = useState({ batch_id: '', price_per_credit: '', amount_listed: '' });
  const [error, setError] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await marketplaceApi.getMyListings();
    setListings(data.listings);
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
    if (!confirm('Cancel this listing?')) return;
    await marketplaceApi.cancelListing(id);
    load();
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">My Listings</h1>

      <form onSubmit={handleCreate} className="border border-border rounded-lg p-4 space-y-3">
        <h2 className="font-semibold">New Listing</h2>
        <div>
          <Label>Batch ID</Label>
          <Input value={form.batch_id} onChange={(e) => setForm({ ...form, batch_id: e.target.value })} required />
        </div>
        <div>
          <Label>Price per Credit</Label>
          <Input type="number" step="0.01" value={form.price_per_credit} onChange={(e) => setForm({ ...form, price_per_credit: e.target.value })} required />
        </div>
        <div>
          <Label>Amount to List</Label>
          <Input type="number" step="0.01" value={form.amount_listed} onChange={(e) => setForm({ ...form, amount_listed: e.target.value })} required />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit">Create Listing</Button>
      </form>

      <div className="space-y-2">
        {listings.map((l) => (
          <div key={l.id} className="border border-border rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{l.project_title}</p>
              <p className="text-sm text-muted-foreground">
                {l.amount_sold}/{l.amount_listed} sold @ {l.price_per_credit} — {l.status}
              </p>
            </div>
            {l.status === 'active' && (
              <Button variant="outline" onClick={() => handleCancel(l.id)}>Cancel</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}