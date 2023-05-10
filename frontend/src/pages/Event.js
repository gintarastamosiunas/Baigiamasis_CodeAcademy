import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import './Event.css';

class EventPage extends Component {

    static contextType = AuthContext;

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            events: []
        };

        this.name = React.createRef();
    }

    submitHandler = (event) => {
        event.preventDefault();

        const name = this.name.current.value;

        if (name.trim().length === 0) {
            return;
        }

        const request = {
            query: `
                mutation {
                    createEvent(name: "${name}") {
                        _id
                        name
                    }
                }
            `
        }

        fetch('http://localhost:8001/graphql', {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.context.token
            }
        })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            if (data.errors && data.errors.length) {
                console.log(data.errors)
                return;
            }

            this.setState({events: [...this.state.events, data.data.createEvent]})
        })
        .catch(err => {
            console.log(err);
        })
    }

    fetchEvents = () => {
        const request = {
            query: `
                query {
                    events {
                        _id
                        name
                    }
                }
            `
        }

        fetch('http://localhost:8001/graphql', {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.context.token
            }
        })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            if (data.errors && data.errors.length) {
                console.log(data.errors)
                return;
            }

            this.setState({isLoading: false, events: data.data.events})
        })
        .catch(err => {
            console.log(err);
        })
    }

    deleteEvent = (eventId) => {
        const request = {
            query: `
                mutation {
                    deleteEvent(eventId:"${eventId}")
                }
            `
        }

        fetch('http://localhost:8001/graphql', {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.context.token
            }
        })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            if (data.errors && data.errors.length) {
                console.log(data.errors)
                return;
            }

            this.setState(prevState => {
                const updatedEvents = [...prevState.events].filter(e => e._id !== eventId);

                return { events: updatedEvents };
            });
        })
        .catch(err => {
            console.log(err);
        })
    }

    componentDidMount() {
        this.fetchEvents();
    }

    render() {
        if (this.state.isLoading) {
            return <h1>Loading...</h1>
        }

        return (
            <div>
                <form onSubmit={this.submitHandler}>
                    <div className="event-row">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" required ref={this.name}/>
                    </div>

                    <div className="event-row">
                        <button type="submit">Submit</button>
                    </div>
                </form>
                <ul className='event-table'>
                    <li className="event-list-item">
                        Name
                    </li>
                    {
                        this.state.events.map(event => (
                            <li className='event-list-item' key={event._id}>
                                <span> {event.name} </span>
                                <button onClick={() => this.deleteEvent(event._id)}>Delete</button>
                            </li>
                        ))
                    }
                </ul>
            </div>
            
        )
    }
}

export default EventPage;