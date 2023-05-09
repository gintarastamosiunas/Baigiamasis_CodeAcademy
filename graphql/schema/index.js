const { buildSchema } = require('graphql');

module.exports = buildSchema(`

type User {
  _id: ID!
  email: String!
  password: String
}

type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}

type Registration {
  _id: ID!
  name: String!
  surname: String!
  email: String!
  birthDate: String!
  event: Event!
  createdAt: String!
  updatedAt: String!
}

type Event {
  _id: ID!
  name: String!
}

input UserInput {
  email: String!
  password: String!
}

input RegistrationInput {
  name: String!
  surname: String!
  email: String!
  birthDate: String!
  eventId: ID!
}

type RootQuery {
    login(email: String!, password: String!): AuthData!
    registrations: [Registration!]
    events: [Event!]
}

type RootMutation {
    createUser(userInput: UserInput): User
    createRegistration(registrationInput: RegistrationInput): Registration!
    deleteRegistration(registrationId: ID!): Boolean
    updateRegistration(registrationId: ID!, registrationInput: RegistrationInput): Registration!
    createEvent(name: String!): Event!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
