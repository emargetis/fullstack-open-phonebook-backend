const express = require('express');
// const morgan = require('morgan');
const cors = require('cors');
const app = express()

app.use(express.static('dist'));
app.use(express.json());
app.use(cors());
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

let contacts = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/info', (request, response) => {
  response.send(
    `
      <p>Phonebook has info for ${contacts.length} people</p>
      <p>${(new Date(Date.now())).toString()}</p>
    `
  )
})

app.get('/api/persons', (request, response) => {
  response.json(contacts)
})

app.get('/api/persons/:id', (request, response) => {
  const id = +request.params.id
  const person = contacts.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  contacts = contacts.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 1000000);
}

const nameExists = (name) => {
  return contacts.find(person => {
    return person.name === name;
  })
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  console.log(body);

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  if (nameExists(body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  let person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  contacts.push(person);

  response.json(person);
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})