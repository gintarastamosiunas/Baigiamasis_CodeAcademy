const Event = require ('../../models/event');

module.exports = {

    events: async (args, req) => {
        try {
            
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
    }
}