const { model, Schema } = require("mongoose");

const toySchema = new Schema(
  {
    title: { type: String, required: [true, "DB: title is required"] },
    price: { type: Number, required: [true, "DB: price is required"] },
    color: { type: String, default: "yellow" },
    owner: { type: Schema.Types.ObjectId },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("toy", toySchema);
