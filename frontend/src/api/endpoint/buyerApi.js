import api from '../axiosInstance';


// No tx_hash here — this is a REQUEST, not a signed transaction. The buyer
// doesn't own the tokens yet, so there's nothing for their wallet to sign
// at this step. See pendingSalesApi.js for the seller's completion side,
// where the actual on-chain transfer gets signed and submitted.
export const createPurchaseIntent = (listing_id, amount) =>
  api.post('/v1/buyer/purchase/intent', { listing_id, amount });

export const getMyPurchaseIntents = () => api.get('/v1/buyer/purchase/intents');

export const getPortfolio = () => api.get('/v1/buyer/portfolio');

export const retireCredits = (data) => api.post('/v1/buyer/retire', data);
export const getMyCertificates = () => api.get('/v1/buyer/certificates');

// Blob download — same pattern as the seller's sales CSV report. A normal
// JSON-parsed axios response would corrupt the PDF bytes.
export async function downloadCertificate(certificateId) {
  const response = await api.get(`/v1/buyer/certificates/${certificateId}/download`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `retirement_certificate_${certificateId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export const getTransactionHistory = () => api.get('/v1/buyer/transactions');
