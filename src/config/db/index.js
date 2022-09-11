const mongoose = require('mongoose');

const connect = async() => {
    try {
        await mongoose.connect(`${process.env.URL_CONNECT_MONGODB}`);
        console.log('Connect Successfully!!')
    } catch (error) {
        console.log('Connect Failed!!', error)
    }
}

module.exports = { connect }
