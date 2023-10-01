const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    email: { type: String, required: [true, "DB: email is required"] },
    password: { type: String, required: [true, "DB: password is required"] },
    username: { type: String, default: "kiwi" },
    token: { type: String, default: null },
    roles: [{ type: String, ref: "role" }],
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("user", userSchema);
