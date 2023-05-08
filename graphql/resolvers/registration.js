const Registration = require ('../../models/registration');
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
                return {
                    ...registration._doc,
                    _id: registration.id,
                    name: registration.name,
                    surname: registration.surname,
                    email: registration.email,
                    birthDate: dateToString(registration._doc.birthDate),
                    createdAt: dateToString(registration._doc.createdAt),
                    updatedAt: dateToString(registration._doc.updatedAt)
                };
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
            
            const registration = new Registration({
                name: args.registrationInput.name,
                surname: args.registrationInput.surname,
                email: args.registrationInput.email,
                birthDate: new Date(args.registrationInput.birthDate),
            });

            const result = await registration.save();

            const data = {
                ...registration._doc,
                _id: registration.id,
                name: result.name,
                surname: result.surname,
                email: result.email,
                birthDate: dateToString(result._doc.birthDate),
                createdAt: dateToString(result._doc.createdAt),
                updatedAt: dateToString(result._doc.updatedAt)
            }

            return data;
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

            const updatedRegistration = new Registration({
                _id: args.registrationId,
                name: args.registrationInput.name,
                surname: args.registrationInput.surname,
                email: args.registrationInput.email,
                birthDate: new Date(args.registrationInput.birthDate),
            })

            const result = await Registration.findOneAndUpdate(updatedRegistration);

            return {
                ...registration._doc,
                _id: registration.id,
                name: result.name,
                surname: result.surname,
                email: result.email,
                birthDate: dateToString(result.birthDate),
                createdAt: dateToString(result._doc.createdAt),
                updatedAt: dateToString(result._doc.updatedAt)
            }
        }
        catch (err) {
            throw err;
        }
    }
}