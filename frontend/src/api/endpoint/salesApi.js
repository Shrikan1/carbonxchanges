// src/api/endpoints/salesApi.js
import api from '../axiosInstance';

export const getSalesHistory = () => api.get('/v1/sales/history');
export const getPendingSales = () => api.get('/v1/sales/pending');

export const completeSale = (saleId, tx_hash) => api.post(`/v1/sales/${saleId}/complete`, { tx_hash });
export const rejectSale = (saleId) => api.post(`/v1/sales/${saleId}/reject`);

// File download needs responseType: 'blob' — a normal JSON-parsed response
// would corrupt the CSV bytes. Triggers a real browser download afterward.
export async function downloadSalesReport() {
  const response = await api.get('/v1/sales/report/download', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `sales_report_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}