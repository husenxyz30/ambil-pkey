import fs from "fs";
import { ethers } from "ethers";
import bip39 from "bip39";


// Read seed phrase from seed.txt
function readSeedPhrase(filename = "seed.txt") {
    return fs.readFileSync(filename, "utf-8").trim();
}

// Derive Ethereum private keys from the seed phrase
function deriveEthereumKeys(mnemonic, accountCount = 100) {
    const privateKeys = [];

    // Convert mnemonic to seed
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    // Create an HD wallet
    const hdNode = ethers.HDNodeWallet.fromSeed(seed);

    for (let i = 0; i < accountCount; i++) {
        // Derivation path: m/44'/60'/0'/0/{i}
        const path = `m/44'/60'/0'/0/${i}`;
        const wallet = hdNode.derivePath(path);

        // Get the private key as a 0x-prefixed hex string
        const privateKey = wallet.privateKey;
        privateKeys.push(privateKey);
    }

    return privateKeys;
}

// Save private keys to file in 0x format
function savePrivateKeysToFile(privateKeys, filename = "data.txt") {
    const data = privateKeys.join("\n");
    fs.writeFileSync(filename, data);
}

// Main function
function main() {
    // Read seed phrase
    const seedPhrase = readSeedPhrase("seed.txt");

    // Derive Ethereum private keys
    const privateKeys = deriveEthereumKeys(seedPhrase);

    // Save private keys to file
    savePrivateKeysToFile(privateKeys);

    console.log("Ethereum private keys have been saved to data.txt in 0x format.");
}

// Run the script
main();
