require('dotenv').config()
const express = require('express')
// const morgan = require('morgan');
const cors = require('cors')
const app = express()
const Contact = require('./models/contact')

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
// app.use(morgan(function (tokens, req, res) {
//   morgan.token('body', function (req, res) { return JSON.stringify(req.body)});

//   return [
//     tokens.method(req, res),
//     tokens.url(req, res),
//     tokens.status(req, res),
//     tokens.res(req, res, 'content-length'), '-',
//     tokens['response-time'](req, res), 'ms',
//     tokens.body(req, res),
//   ].join(' ')
// }));

app.get('/api/info', (request, response) => {
  Contact.find({}).then(contact => {
    response.send(
      `
        <p>Phonebook has info for ${contact.length} people</p>
        <p>${(new Date(Date.now())).toString()}</p>
      `
    )
  })
})

app.get('/api/persons', (request, response) => {
  Contact.find({}).then(contact => {
    response.json(contact)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Contact.findById(request.params.id).then(contact => {
    response.json(contact)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// const generateId = () => {
//   return Math.floor(Math.random() * 1000000);
// }

// const nameExists = (name) => {
//   return contacts.find(person => {
//     return person.name === name;
//   })
// }

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log(body)

  // if (!body.name || !body.number) {
  //   return response.status(400).json({
  //     error: 'content missing'
  //   })
  // }

  // if (nameExists(body.name)) {
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }

  let person = new Contact({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Contact.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})