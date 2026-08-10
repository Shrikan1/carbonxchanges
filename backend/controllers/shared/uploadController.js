const { uploadFileToIPFS } = require('../../services/ipfsService');

async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const cid = await uploadFileToIPFS(req.file.buffer, req.file.originalname);

    res.status(201).json({
      message: 'File uploaded to IPFS',
      cid,
      url: `https://gateway.pinata.cloud/ipfs/${cid}`,
    });
  } catch (err) {
    console.error('IPFS upload error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to upload file to IPFS' });
  }
}

module.exports = { uploadFile };