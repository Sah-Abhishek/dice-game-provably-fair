import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    reqrired: true,
    unique: true,
  },
  uuid: {
    type: String,
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    required: true,
    default: 1000

  },
  messages: {
    type: [String],
    default: []
  },
  solanaNetWon: {
    type: Number,
    default: 0,
  },
  inGameDollarsNetWon: {
    type: Number,
    default: 0,
  }
})

const User = mongoose.model("user", userSchema);

export default User;
