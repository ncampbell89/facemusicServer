const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema; 

const genreSchema = new mongoose.Schema({
    genre: { type: String, default: '' },
    user_id: { type: Schema.Types.ObjectId, ref: 'Users' },
    timeStamp: {
        type: String,
        default: () => moment().format('dddd, MMMM Do YYYY, h:mm:ss a')
    }
})

module.exports = mongoose.model('Genres', genreSchema);