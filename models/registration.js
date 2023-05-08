const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const regSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        birthDate: {
            type: Date,
            required: true
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Registration', regSchema);