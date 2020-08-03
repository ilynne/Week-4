const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String,
           required: true,
           validate: {
           validator: async function(value) {
              const user = await this.constructor.findOne({ email: value});
              if (user) {
                throw new Error(`Email: ${value} already in use.`);
              }
            }
           }
         },
  password: { type: String, required: true }
})

userSchema.index({ email: 1 });
module.exports = mongoose.model("users", userSchema);
