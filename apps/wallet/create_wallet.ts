import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';

type WalletInfoType = {
  addrss: string;
  privateKey: string;
  phrase: string;
};

export const createMultipleEvmWallets = async (num: number) => {
  const wallets: WalletInfoType[] = [];
  // 当前时间，使用使用格式 YYYY-MM-DD HH:mm:ss 格式
  const now = new Date().toLocaleString('zh-CN', {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  for (let i = 0; i < num; i++) {
    const wallet = ethers.Wallet.createRandom();
    // 添加钱包公钥、 以及私钥
    // wallets.push(wallet);
    const wallet_info = {
      index: `${now}_${i + 1}`,
      addrss: wallet.address,
      privateKey: wallet.privateKey,
      phrase: wallet.mnemonic!.phrase,
    };

    wallets.push(wallet_info);
  }
  saveWalletsToFile(wallets);
  // return wallets;
};

// 在nodejs 当中生成文件并保存至本地。
export const saveWalletsToFile = async (wallets: WalletInfoType[]) => {
  // 如果存在文件，则读取文件内容，将文件内的结果跟当前的wallets 进行合并，然后保存至本地，如果不存在则创建新文件并进行保存。

  const filePath = path.resolve(
    __dirname,
    '../../res/new_wallet//wallets.json'
  );
  // 确认文件是否存在，如果不存在则创建文件并保存，如果存在则读取文件内容，将文件内的结果跟当前的wallets 进行合并，然后保存至本地。
  if (!fs.existsSync(filePath)) {
    const data = JSON.stringify(wallets, null, 2);
    fs.writeFileSync(filePath, data);
    return;
  }
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const fileContentJson = JSON.parse(fileContent);
  const newWallets = [...fileContentJson, ...wallets];
  const newWalletsJson = JSON.stringify(newWallets,  null, 2);;
  fs.writeFileSync(filePath, newWalletsJson);
};
