import fs from 'fs';

const files = [
  'src/components/WalletConnectButton.jsx',
  'src/lib/carbonTokenContract.js',
  'src/pages/seller/ProjectListPage.jsx',
  'src/pages/seller/SellerWalletPage.jsx',
  'src/pages/shared/WalletPage.jsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/Usemetamask/g, 'useMetamask');
  content = content.replace(/Walletconnectbutton/g, 'WalletConnectButton');
  fs.writeFileSync(file, content);
}
