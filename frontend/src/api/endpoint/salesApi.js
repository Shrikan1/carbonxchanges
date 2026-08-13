// src/api/endpoints/salesApi.js
import api from '../axiosInstance';

export const getSalesHistory = () => api.get('/v1/sales/history');

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