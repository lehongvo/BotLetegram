require('dotenv').config();
const express = require('express');
const ethers = require('ethers');
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');

const app = express();

const port = process.env.PORT || 3000;
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

const NETWORKS = [
    // {
    //     "name": "Ethereum Mainnet",
    //     "RPC": "https://eth.drpc.org",
    //     "symbol": "ETH",
    //     "explorer": "https://etherscan.io/address/",
    //     "amount": 2
    // },
    {
        "name": "Sepolia Testnet",
        "RPC": "https://rpc.sepolia.org",
        "symbol": "ETH",
        "explorer": "https://sepolia.etherscan.io/address/",
        "amount": 0.01
    },
    {
        "name": "Polygon Mainnet",
        "RPC": "https://polygon.meowrpc.com/",
        "symbol": "MATIC",
        "explorer": "https://polygonscan.com/address/",
        "amount": 2
    },
    {
        "name": "zKyoto Testnet",
        "RPC": "https://rpc.testnet.kyotoprotocol.io:8545",
        "symbol": "ETH",
        "explorer": "https://testnet.kyotoscan.io/address/",
        "amount": 0.005
    },
    {
        "name": "Amoy Testnet",
        "RPC": "https://rpc-amoy.polygon.technology",
        "symbol": "MATIC",
        "explorer": "https://amoy.polygonscan.com/address/",
        "amount": 0.5
    },
    {
        "name": "Astar Mainnet",
        "RPC": "https://astar.public.blastapi.io",
        "symbol": "ASTR",
        "explorer": "https://astar.blockscout.com/address/",
        "amount": 10
    },
    {
        "name": "Astar ZkEVM",
        "RPC": "https://rpc.startale.com/astar-zkevm",
        "symbol": "ETHzK",
        "explorer": "https://astar-zkevm.explorer.startale.com/address/",
        "amount": 0.005
    }
]


async function checkBalanceAndNotify() {
    try {
        NETWORKS.forEach(async (network) => {
            const provider = new ethers.providers.JsonRpcProvider(network.RPC);
            const balance = await provider.getBalance(process.env.WALLET_ADDRESS);
            const balanceInEther = ethers.utils.formatEther(balance);

            if (parseFloat(balanceInEther) < parseFloat(network.amount)) {
                const currentTime = new Date().toLocaleString();
                const message = `🚨 CRYPTO EMERGENCY: WALLET ON LIFE SUPPORT! 🚨
🕰️ Doomsday Clock: ${currentTime}

🌐 Battlefield: ${network.name}

👛 Patient Zero (Your Wallet): ${process.env.WALLET_ADDRESS}
💎 Remaining Life Force: ${balanceInEther} ${network.symbol}

😱 CODE RED: Your ${network.symbol} stash has gone from Lambo to Lame-bo! 
It's plummeted below ${network.amount} ${network.symbol}! Time to perform CPR (Crypto Portfolio Resuscitation)!

🕵️‍♂️ Crime Scene:
${network.explorer}${process.env.WALLET_ADDRESS}
(Warning: Graphic content. Viewer discretion advised.)

🧠 Emergency Crypto Triage:
1. Don't FOMO! That's how we got into this mess, remember?
2. Gas fees higher than Snoop Dogg? Wait for the crypto rush hour to pass!
3. Feeling lucky? Strap on your DeFi helmet and dive into the yield farming mosh pit!
4. When in doubt, zoom out! Unless it's a rug pull, then... good luck!

💡 Ancient Crypto Proverb:
"When the market dips, the wise trader sips...
    a cocktail on the beach while their limit orders do the work." 
                - Sun 'Buy the Dip' Tzu

🎭 Crypto Drama in 3 Acts:
Act I: The Bull Run
Act II: The Dip
Act III: You Are Here (Plot twist incoming!)

Remember: In crypto, we're all down here. And down here, we buy floaties! 🎈🦺

Stay strong, HODL long, and may your memes be danker than your losses! 🚀🌕🍜
P.S. If your portfolio gets any redder, we might have to call the fire department! 🚒`;

                await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
                console.log('Notification sent via Telegram');
            }
        })
    } catch (error) {
        console.error('Error checking balance:', error);
    }
}

cron.schedule('0 * * * *', () => {
    checkBalanceAndNotify();
});

checkBalanceAndNotify();

app.get('/', (req, res) => {
    res.send('Application is running. Monitoring wallet balance...');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port} `);
});