const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const noteSchema = new mongoose.Schema(
  {
    user: {
      //referencing on mongoose schema
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    //created_at and updated_at default from mongodb
    timestamps: true,
  }
);
//add autoIncrement plugin, where the increment field named as 'ticket' and start from 500
noteSchema.plugin(AutoIncrement, {
  inc_field: "ticket",
  id: "ticketNums",
  start_seq: 500,
});
module.exports = mongoose.model("Note", noteSchema);
