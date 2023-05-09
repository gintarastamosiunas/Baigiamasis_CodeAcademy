const Registration = require ('../../models/registration');
const Event = require('../../models/event');
const { dateToString } = require('../../helpers/date');

module.exports = {
    registrations: async (args, req) => {
        try {
            if (!req.isAuth) {
                throw new Error('Unauthenticated!');
            }

            const registrations = await Registration.find();
            
            const parsedRegistrations = registrations
            .sort((a, b) => {
                return b.updatedAt - a.updatedAt
            }).map(registration => {
                const map = Event.findOne({ _id: registration.eventId })
                    .then((result) => {
                        return {
                            ...registration._doc,
                            _id: registration.id,
                            name: registration.name,
                            surname: registration.surname,
                            email: registration.email,
                            birthDate: dateToString(registration._doc.birthDate),
                            event: {
                                ...result._doc,
                                _id: result.id,
                                name: result.name
                            },
                            createdAt: dateToString(registration._doc.createdAt),
                            updatedAt: dateToString(registration._doc.updatedAt)
                        };
                    })
                
                return map;
            });

            return parsedRegistrations;

        }
        catch (err) {
            throw err;
        }
    },
    createRegistration: async (args, req) => {
        try {
            
            if (!req.isAuth) {
                throw new Error('Unauthenticated!');
            }

            const fetchedEvent = await Event.findOne({ _id: args.registrationInput.eventId });
            if (!fetchedEvent) {
                throw new Error("Event do not exist");
            }
            
            const registration = new Registration({
                name: args.registrationInput.name,
                surname: args.registrationInput.surname,
                email: args.registrationInput.email,
                birthDate: new Date(args.registrationInput.birthDate),
                eventId: args.registrationInput.eventId
            });

            const result = await registration.save();

            return {
                ...registration._doc,
                _id: registration.id,
                name: result.name,
                surname: result.surname,
                email: result.email,
                birthDate: dateToString(result._doc.birthDate),
                event: {
                    ...fetchedEvent._doc,
                    _id: fetchedEvent.id,
                    name: fetchedEvent.name
                },
                createdAt: dateToString(result._doc.createdAt),
                updatedAt: dateToString(result._doc.updatedAt)
            }
        }
        catch (err) {
            throw err;
        }
    },
    deleteRegistration: async (args, req) => {
        try {
            if (!req.isAuth) {
                throw new Error('Unauthenticated!');
            }

            await Registration.deleteOne({ _id: args.registrationId });

            return true;
        }
        catch (err) {
            throw err;
        }
    },
    updateRegistration: async (args, req) => {
        try {
            if (!req.isAuth) {
                throw new Error('Unauthenticated!');
            }

            const fetchedEvent = await Event.findOne({ _id: args.registrationInput.eventId });
            if (!fetchedEvent) {
                throw new Error("Event do not exist");
            }

            const current = await Registration.findOne({ _id: args.registrationId });
            if (!current) {
                throw new Error('User does not exist!');
            }

            current.name = args.registrationInput.name;
            current.surname = args.registrationInput.surname;
            current.email = args.registrationInput.email;
            current.birthDate = args.registrationInput.birthDate;
            current.eventId = args.registrationInput.eventId;
            
            const result = await current.save();
            
            return {
                ...result._doc,
                _id: result.id,
                name: result.name,
                surname: result.surname,
                email: result.email,
                birthDate: dateToString(result.birthDate),
                event: {
                    ...fetchedEvent._doc,
                    _id: fetchedEvent.id,
                    name: fetchedEvent.name
                },
                createdAt: dateToString(result._doc.createdAt),
                updatedAt: dateToString(result._doc.updatedAt)
            }
        }
        catch (err) {
            throw err;
        }
    }
}