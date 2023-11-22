const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://emargetis:${password}@cluster0.whs6se3.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
})

const Contact = mongoose.model('Contact', phonebookSchema)

if (process.argv.length<4) {
  Contact
    .find({})
    .then(result=> {
      console.log(`phonebook:`)
      result.forEach(contact => {
        console.log(`${contact.name} ${contact.phoneNumber}`);
      })
      mongoose.connection.close()
    })
} else { 
  const contactName = process.argv[3]
  const contactNumber = process.argv[4]

  const contact = new Contact({
    name: contactName,
    phoneNumber: contactNumber,
  })

  contact.save().then(result => {
    console.log(`added ${result.name} number ${result.phoneNumber} to phonebook`)
    mongoose.connection.close()
  })
}