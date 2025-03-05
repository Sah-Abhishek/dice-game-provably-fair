import express from "express";
import crypto from "crypto";
import { getRandomUsername } from "./getRandomUserName.js"; // ✅ Add `.js`
import cors from "cors";
import { nanoid } from "nanoid";
import connectDB from "./database/connection.js";
import User from "./model/users.js";
import { sendAndConfirmTransaction, Connection, Keypair, SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());
connectDB();


const escrowSecret = process.env.escrow_sec.split(",").map(Number);
const escrowAccount = Keypair.fromSecretKey(Uint8Array.from(escrowSecret));

const houseSecret = process.env.house_sec.split(",").map(Number);
const houseAccount = Keypair.fromSecretKey(Uint8Array.from(houseSecret));

app.post("/bet-solana", async (req, res) => {
  try {
    const { selectedNetwork, uuid, playerPublicKey, betAmount, clientSeed } = req.body;
    // console.log("This is the clientSeed from the frontend: ", clientSeed);

    if (!uuid || !playerPublicKey || !betAmount || !clientSeed) {
      return res.status(400).json({ message: "Invalid Data" });
    }

    const user = await User.findOne({ uuid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    let connection;

    if (selectedNetwork === 'devnet') {
      connection = new Connection("https://api.devnet.solana.com", "confirmed");
    } else {
      connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
    }

    // ✅ Generate a provably fair roll
    const serverSeed = crypto.randomBytes(32).toString("hex");
    const { roll, hash } = generateRoll(clientSeed, serverSeed);
    const isWin = roll >= 4;

    // ✅ Create the transaction
    const transaction = new Transaction();

    if (isWin) {
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: escrowAccount.publicKey, // ✅ Return original bet
          toPubkey: new PublicKey(playerPublicKey), // ✅ Player gets original bet
          lamports: betAmount * LAMPORTS_PER_SOL,
        })
      );

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: houseAccount.publicKey,  // ✅ House pays extra winnings
          toPubkey: new PublicKey(playerPublicKey), // ✅ Player gets winnings
          lamports: betAmount * 2 * LAMPORTS_PER_SOL,
        })
      );
    }
    else {
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: escrowAccount.publicKey, // ✅ Escrow holds player’s bet
          toPubkey: houseAccount.publicKey, // ✅ House keeps the lost bet
          lamports: betAmount * LAMPORTS_PER_SOL, // ✅ Correct bet transfer
        })
      );
    }

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = escrowAccount.publicKey;

    await sendAndConfirmTransaction(connection, transaction, [escrowAccount, houseAccount]);


    const rollMessage = `clientSeed: ${clientSeed}\nserverSeed: ${serverSeed}\nrollHash: ${hash}\nroll: ${roll}`
    user.messages.push(rollMessage);


    if (isWin) {
      user.solanaNetWon += 2 * betAmount * LAMPORTS_PER_SOL;
    } else {
      user.solanaNetWon -= betAmount * LAMPORTS_PER_SOL;
    }

    const newMessage = isWin ? `Won ${2 * betAmount} SOL` : `Lost ${betAmount} SOL`;
    user.messages.push(newMessage);
    await user.save();

    const serializedTransaction = transaction.serialize();
    const base64Transaction = Buffer.from(serializedTransaction).toString("base64");



    res.json({
      transaction: base64Transaction,
      roll,
      isWin,
      hash,
      serverSeed,
      messages: user.messages,
    });

  } catch (error) {
    console.error("Error processing bet:", error);
    res.status(500).json({ error: "Transaction failed" });
  }
});

app.get("/", async (req, res) => {

  let username;
  let isTaken = true;

  while (isTaken) {
    username = getRandomUsername();
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      isTaken = false;
    }
  }

  const uuid = nanoid();
  res.status(200).json({
    username, uuid, balance: 1000
  })
})

app.get("/user-details/:uuid", async (req, res) => {
  const uuid = req.params.uuid;

  try {
    const user = await User.findOne({ uuid });

    if (!user) {
      return res.status(404).json({
        message: "No user found"
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("There was some error: ", error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
});
const generateRoll = (clientSeed, serverSeed) => {
  const hash = crypto.createHash('sha256')
    .update(serverSeed + clientSeed)
    .digest('hex');
  const roll = (parseInt(hash.substring(0, 8), 16) % 6) + 1;
  return { roll, hash };
};

app.post('/roll-dice', async (req, res) => {
  const { bet, clientSeed, uuid } = req.body;


  if (!bet || !clientSeed) {
    return res.status(400).json({
      message: "Insufficient Data"
    })
  }

  const user = await User.findOne({ uuid });

  if (!user) {
    return res.status(400).json({
      message: "User not found"
    })
  }

  let balance = user.balance;
  if (bet < 0 || bet > balance) {
    return res.status(400).json({
      message: "Invalid bet amount"
    })
  }

  const SERVER_SEED = crypto.randomBytes(16).toString('hex');
  const { roll, hash } = generateRoll(clientSeed, SERVER_SEED);

  const rollMessage = `clientSeed: ${clientSeed}\nserverSeed: ${SERVER_SEED}\nrollHash: ${hash}\nroll: ${roll}`
  user.messages.push(rollMessage);


  if (roll >= 4) {
    const winingAmount = 2 * bet;
    const message = `Won $ ${winingAmount}`;
    user.messages.push(message);
    balance += winingAmount;
  } else {
    const message = `Lost $ ${bet}`;
    user.messages.push(message);
    balance -= bet;
  }

  const isWin = roll > 3 ? true : false;

  if (isWin) {
    user.inGameDollarsNetWon += 2 * bet;
  } else {
    user.inGameDollarsNetWon -= bet;
  }


  const messages = user.messages;

  // console.log("This is the server seed: ", SERVER_SEED);

  user.balance = balance;
  await user.save();

  res.status(200).json({
    roll, hash, balance, messages
  })
})



app.post("/start-game", async (req, res) => {
  const { username, uuid } = req.body;
  // console.log("This is the body: ", req.body);
  try {

    const newUser = new User({
      username: username,

      uuid: uuid
    })
    newUser.save()
      .then(() => console.log("user created successfully"))
      .catch((error) => console.log("Error creating user: ", error));
    res.status(200).json({
      message: "User created Successfully"
    })
  } catch (error) {
    res.status(500).json({
      message: "Ther was an error creating the user"
    })
  }


})

app.post('/add-balance', async (req, res) => {
  const { uuid, increaseRequest } = req.body;

  if (!uuid || increaseRequest === undefined || increaseRequest < 0) {
    return res.status(400).json({
      message: "Invalid Data"
    });
  }

  try {
    const user = await User.findOne({ uuid });
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const increaseAmount = Number(increaseRequest);
    let balance = user.balance;
    // console.log("This is the typeof: ", typeof balance, typeof increaseRequest);
    balance = balance + increaseAmount; // Increase the balance
    user.balance = balance; // Update the user's balance
    user.messages.push(`$ ${increaseAmount} Added`);
    await user.save();
    res.status(200).json({
      message: "balance increased",
      balance
    })
  } catch (error) {
    console.log("There was some error: ", error);
    res.status(500).json({
      message: "Internal Server Error"
    })
  }
})

app.get('/get-leader-board', async (req, res) => {
  try {
    const leaderSolana = await User.find()
      .sort({ solanaNetWon: -1 }).limit(10)
      .select("username solanaNetWon");
    const leaderInGameDollars = await User.find()
      .sort({ inGameDollarsNetWon: -1 }).limit(10)
      .select("username inGameDollarsNetWon");

    res.status(200).json({
      leaderSolana, leaderInGameDollars
    })

  } catch (error) {
    console.log("There was some error while fetching leaderboard: ", error);
    res.status(500).json({
      message: "Internal Server Error"
    })
  }
})

app.post('/insert-mock-data', async (req, res) => {
  const { data } = req.body;
  try {
    await User.insertMany(data);
    res.status(200).json({
      message: "Data successfully inserted"
    });
  } catch (error) {
    console.log("There was some error while inserting data: ", error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
