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
  }
})

const User = mongoose.model("user", userSchema);

export default User;
