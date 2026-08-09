const axios = require('axios');
const FormData = require('form-data');

const PINATA_API_URL = 'https://api.pinata.cloud';

// Uploads a raw file buffer (e.g. from multer's memoryStorage — no temp
// files written to disk) and returns the resulting CID.
async function uploadFileToIPFS(fileBuffer, fileName) {
  const formData = new FormData();
  formData.append('file', fileBuffer, fileName);

  const response = await axios.post(`${PINATA_API_URL}/pinning/pinFileToIPFS`, formData, {
    maxBodyLength: Infinity,
    headers: {
      ...formData.getHeaders(),
      Authorization: `Bearer ${process.env.PINATA_JWT}`,
    },
  });

  return response.data.IpfsHash; // the CID
}

// Uploads a JSON object directly (used for ERC-1155 token metadata at mint
// time — no need to write it to a file first).
async function uploadJSONToIPFS(jsonData, name) {
  const response = await axios.post(
    `${PINATA_API_URL}/pinning/pinJSONToIPFS`,
    { pinataContent: jsonData, pinataMetadata: { name } },
    { headers: { Authorization: `Bearer ${process.env.PINATA_JWT}`, 'Content-Type': 'application/json' } }
  );

  return response.data.IpfsHash;
}

module.exports = { uploadFileToIPFS, uploadJSONToIPFS };