import express from "express";
import crypto from "crypto";
import { getRandomUsername } from "./getRandomUserName.js"; // ✅ Add `.js`
import cors from "cors";
import { nanoid } from "nanoid";
import connectDB from "./database/connection.js";
import User from "./model/users.js";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
connectDB();


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

    // Send the user details back in the response
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
    return res.staut(400).json({
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

  console.log("This is the server seed: ", SERVER_SEED);

  user.balance = balance;
  await user.save();

  res.status(200).json({
    roll, hash, balance
  })
})



app.post("/start-game", async (req, res) => {
  const { username, uuid } = req.body;
  console.log("This is the body: ", req.body);
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
