const mongoose = require('mongoose')

const Schema = mongoose.Schema

const cryptoSchema = new Schema(
    {
        from: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        rate: {
            type: Number,
            required: true
        },
        result: {
            type: Number,
            required: true
        }
    }, 
    {
        timestamps: true
    })

module.exports = mongoose.model('Crypto', cryptoSchema)