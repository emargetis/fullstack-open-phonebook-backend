const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI


console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'Name required']
  },
  number:  {
    type: String,
    validate: {
      validator: function(phone) {
        return /^(\d{2}-\d{6,}|^\d{3}-\d{5,})/.test(phone)
      },
      message: 'Phone number is not in a valid format!'
    },
    required: [true, 'User phone number required']
  },
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Contact', phonebookSchema)
