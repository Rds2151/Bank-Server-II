const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bankSchema = new Schema({
    AccountName: {
        type: String,
        required: true
    },
    AccountNumber: {
        type: Number,
        required: true
    },
    AccountType: {
        type: String,
        required: true
    },
    Balance: {
        type: Number,
        required: true
    }
}, {timestamps : true});

const Bank = mongoose.model('Accounts',bankSchema);

module.exports = Bank;