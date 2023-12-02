const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  //   dob: String,
  imageURL: {
    type: String,
    default:
      "https://res.cloudinary.com/dqnz3rzt5/image/upload/v1679141386/avatar_sofpb7.jpg",
  },
  googleId: String,
  //   stripeId: { type: String },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Customer", customerSchema);
