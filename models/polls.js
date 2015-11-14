// file for creating new polls to post to the database

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = mongoose.model('poll', new Schema({
    question: String,
    choices: Array
}));

module.exports = Poll;