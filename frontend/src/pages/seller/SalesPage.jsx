// src/pages/seller/SalesPage.jsx
import { useEffect, useState } from 'react';
import * as salesApi from '../../api/endpoint/salesApi';
import { Button } from '../../components/ui/Button';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [revenue, setRevenue] = useState(null);

  useEffect(() => {
    salesApi.getSalesHistory().then((r) => {
      setSales(r.data.sales);
      setRevenue(r.data.revenue);
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sales</h1>
        <Button variant="outline" onClick={() => salesApi.downloadSalesReport()}>Download CSV</Button>
      </div>

      {revenue && <p className="text-sm">Total revenue: <span className="font-bold">${revenue.total_revenue}</span></p>}

      <div className="space-y-2">
        {sales.map((s) => (
          <div key={s.id} className="border-b border-border py-2 text-sm flex justify-between">
            <span>{s.project_title} → {s.buyer_name}</span>
            <span>{s.amount} @ ${s.price_per_credit} = ${s.total_price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}