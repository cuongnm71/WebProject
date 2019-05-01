const mongoose = require('mongose');

const UserSchema = mongoose.Schema({
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  }
})
