require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const Crypto = require('./models/cryptoModel')

const app = express()
app.use(express.json())

fetchConversionData = async () => {
    const url = process.env.FETCH_URI;
    const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': process.env.API_KEY,
        'x-rapidapi-host': process.env.API_HOST
    }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result
    } catch (error) {
        console.error(error);
    }
}

app.get("/", async (req, res) => {
    res.status(200).json({mssg: "This is the get"})
})

app.post("/", async (req, res) => {
    const {from, to, amount} = req.body
    const currencies_data = await fetchConversionData()
    const currencies = Object.keys(currencies_data.from)
    let from_index;
    let to_index;
    currencies.forEach((currency, index) => {
        if (from == currency) {
            from_index = index
        } else if (to == currency) {
            to_index = index
        }
    })
    const from_res = (1 / currencies_data.from[currencies[from_index]])
    const to_res = (1/ currencies_data.from[currencies[to_index]])
    const rate = to_res/from_res
    const result = (rate * amount).toFixed(3)
    try {
        const cryptoConversion = await Crypto.create({from, to, amount, rate, result})
        res.status(200).json(cryptoConversion)

    } catch (error) {
        console.log(error)
    }
})

app.get("/history", async (req, res) => {
    const cryptoConversions = await Crypto.find({}).sort({createdAt: -1})
    res.status(200).json({mssg: "These are the previous conversion records", history: cryptoConversions})
})

mongoose.connect(process.env.MONGO_URI)
    .then(
        () => {
            app.listen(process.env.PORT, () => {
                console.log(`Connected to DB and ready at port :${process.env.PORT}`)
            })
        }
    )
    .catch(
        (error) => {
            console.log(error)
        }
    )