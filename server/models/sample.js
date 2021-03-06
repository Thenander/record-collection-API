'use strict'

/**
 * Sample API model. Can safely be removed.
 */

const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  _id: String,
  name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true,
    minlength: [1, 'Name must have at least one character.'],
    maxlength: [20, 'Name must have at most 20 characters.'],
    default: '',
  },
})

module.exports = mongoose.model('Sample', schema)
