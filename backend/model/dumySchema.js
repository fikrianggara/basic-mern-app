const mongoose = require("mongoose");

const dummySchema = new mongoose.Schema({
  name: String,
});
const Dummy = mongoose.model("Dummy", dummySchema);
// const dummy1 = new Dummy({ name: "Dummy" });
// console.log(dummy1.name);
// dummy1.save();
module.exports = Dummy;
