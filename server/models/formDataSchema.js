const mongoose = require("mongoose");

const formDataSchema = new mongoose.Schema({
  resourceName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  resourceMedia: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  upvotes: { type: Number, default: 0 },
});

const FormData = mongoose.model("FormData", formDataSchema);

module.exports = FormData;
