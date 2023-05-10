const Event = require ('../../models/event');
const Registration = require('../../models/registration');

module.exports = {

    events: async (args, req) => {
        try {
            if (!req.isAuth) {
                throw new Error('Unauthenticated!');
            }
            
            const result = await Event.find();

            const data = result
                .map(object => {
                    return {
                        ...object._doc,
                        _id: object.id,
                        name: object.name,
                    };
                });

            return data;
        }
        catch (err) {
            throw err;
        }
    },
    createEvent: async (args, req) => {
        try {
            if (!req.isAuth) {
                throw new Error('Unauthenticated!');
            }

            const event = new Event({
                name: args.name
            });

            const result = await event.save();

            return {
                ...event._doc,
                _id: event.id,
                name: result.name
            }
        }
        catch (err) {
            throw err;
        }
    },
    deleteEvent: async (args, req) => {
        try {
            if (!req.isAuth) {
                throw new Error('Unauthenticated!');
            }

            await Registration.deleteMany({ eventId: args.eventId});
            await Event.deleteOne({_id: args.eventId});

            return true;
        }
        catch (err) {
            throw err;
        }
    }
}