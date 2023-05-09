import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import RegistrationsList from "../components/Registrations/RegistrationsList";
import RegistrationPagination from "../components/Registrations/RegistrationsPaginator";
import './Registrations.css'

class RegistrationPage extends Component {
    
    static contextType = AuthContext;

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            registrations: [],
            currentRegistration: null,
            currentPage: 1,
            perPage: 10,
            isCreating: false,
            availableEvents: []
        };
    
        this.name = React.createRef();
        this.surname = React.createRef();
        this.email = React.createRef();
        this.birthDate = React.createRef();
        this.selectedEvent = React.createRef();
    }
    
    fetchRegistrations = () => {
        const request = {
            query: `
                query GetRegistrations {
                    registrations {
                        _id
                        name
                        surname
                        email
                        birthDate
                        event {
                            _id
                            name
                        }
                        createdAt
                        updatedAt
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
        .then((resData) => {
            if (resData.errors && resData.errors.length) {
                return;
            }

            this.setState({ registrations: resData.data.registrations, isLoading: false });
        })
        .catch(err => {
            console.log(err);
            this.setState({ isLoading: false });
        })
    }

    fetchAvailableEvents =() => {
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

            this.setState({availableEvents: data.data.events})
        })
        .catch(err => {
            console.log(err);
        })
    }

    submitHandler = (event) => { 
        event.preventDefault();

        const surname = this.surname.current.value;
        const name = this.name.current.value;
        const email = this.email.current.value;
        const birthDate = this.birthDate.current.value;
        const selectedEvent = this.selectedEvent.current.value;

        if (email.trim().length === 0 || 
            surname.trim().length === 0 ||
            name.trim().length === 0 ||
            birthDate.trim().length === 0 ||
            selectedEvent.trim().length === 0) 
        {
            return;
        }

        const request = {
            query: `
                mutation CreateRegistration {
                    createRegistration(registrationInput: {
                        name: "${name}"
                        surname: "${surname}"
                        email: "${email}"
                        birthDate: "${birthDate}"
                        eventId: "${selectedEvent}"
                      }) {
                        _id
                        name
                        surname
                        email
                        birthDate
                        event {
                          _id
                          name
                        }
                        createdAt
                        updatedAt
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
        .then((resData) => {
            if (resData.errors && resData.errors.length) {
                console.log(resData.errors)
                return;
            }

            const entry = {
                _id: resData.data.createRegistration._id,
                name: resData.data.createRegistration.name,
                surname: resData.data.createRegistration.surname,
                email: resData.data.createRegistration.email,
                birthDate: resData.data.createRegistration.birthDate,
            };

            this.setState({
                registrations: [entry, ...this.state.registrations],
                isCreating: false
            })
        })
        .catch(err => {
            console.log(err);
        })
    }

    deleteRegistration = (registrationId) => {
        const request = {
            query: `
                mutation DeleteRegistration {
                    deleteRegistration(registrationId: "${registrationId}")
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
        .then((resData) => {
            if (resData.errors && resData.errors.length) {
                console.log(resData.errors)
                return;
            }

            this.setState(prevState => {
                const updatedRegistrations = [...prevState.registrations].filter(e => e._id !== registrationId);

                return { registrations: updatedRegistrations };
            });
        })
        .catch(err => {
            console.log(err);
        })
    }

    getUpdateRegistration = (registrationid) => {
        const currentRegistration = this.state.registrations.find(e => e._id === registrationid);
        this.setState({currentRegistration: currentRegistration});
    }

    updateRegistration = (event) => {
        event.preventDefault();

        const surname = this.surname.current.value;
        const name = this.name.current.value;
        const email = this.email.current.value;
        const birthDate = this.birthDate.current.value;

        if (email.trim().length === 0 || 
            surname.trim().length === 0 ||
            name.trim().length === 0 ||
            birthDate.trim().length === 0) 
        {
            return;
        }

        const request = {
            query: `
                mutation UpdateRegistration {
                    updateRegistration(registrationId: "${this.state.currentRegistration._id}" registrationInput: {
                        name: "${name}"
                        surname:"${surname}"
                        email: "${email}"
                        birthDate: "${birthDate}"
                    }) {
                        _id
                        name
                        surname
                        email
                        birthDate
                        createdAt
                        updatedAt
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
        .then((resData) => {
            if (resData.errors && resData.errors.length) {
                console.log(resData.errors)
                return;
            }

            const updatedRegistration = resData.data.updateRegistration;
            const updatedList = this.state.registrations
                .map(e => e._id !== updatedRegistration._id ? e : updatedRegistration)
                .sort((a, b) => { return new Date(b.updatedAt) - new Date(a.updatedAt) })

            this.setState({registrations: updatedList, currentRegistration: null});
        })
        .catch(err => {
            console.log(err);
        })
    }

    addNewRegistration = () => {
        this.setState({isCreating: true});
    }

    cancelEdit = () => {
        this.setState({currentRegistration: null, isCreating: false});
    }

    componentDidMount() {
        this.fetchAvailableEvents();
        this.fetchRegistrations();
    }

    componentDidUpdate(){
        if (this.state.currentRegistration) {
            this.name.current.value = this.state.currentRegistration.name;
            this.surname.current.value = this.state.currentRegistration.surname;
            this.email.current.value = this.state.currentRegistration.email;
            this.birthDate.current.value = this.state.currentRegistration.birthDate.substring(0, 10);
        }
    }


    render() {
        if (this.state.currentRegistration || this.state.isCreating) {
            return (
                <form onSubmit={this.state.isCreating ? this.submitHandler : this.updateRegistration }>
                    <div className="registration-row">
                        <label htmlFor="events">Event</label>
                        <select required ref={this.selectedEvent}>
                            <option></option>
                            {
                                this.state.availableEvents.map(event => (
                                    <option key={event._id} value={event._id}>
                                        {event.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="registration-row">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" required ref={this.name}/>
                    </div>
    
                    <div className="registration-row">
                        <label htmlFor="surname">Surname</label>
                        <input type="text" id="surname" required ref={this.surname}/>
                    </div>
    
                    <div className="registration-row">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" required ref={this.email}/>
                    </div>
    
                    <div className="registration-row">
                        <label htmlFor="birthDate">Date of birth</label>
                        <input type="date" id="birthDate" required ref={this.birthDate}/>
                    </div>
    
                    <div className="registration-row">
                        <div>
                            <button onClick={this.cancelEdit}>Cancel</button>
                            <button type="submit">Submit</button>
                        </div>
                    </div>
                </form>
            );
        }

        const indexOfLast = this.state.currentPage * this.state.perPage;
        const indexOfFirst = indexOfLast - this.state.perPage;
        const currentPosts = this.state.registrations.slice(indexOfFirst, indexOfLast);
        const setPage = (pageNum) => {
            this.setState({currentPage: pageNum})
        }

        return (
            <div>
                <div className="registration-controls">
                    <button onClick={this.addNewRegistration}>Add new participant</button>
                </div>
                <RegistrationsList 
                    registrations={currentPosts} 
                    loading={this.state.isLoading} 
                    delete={this.deleteRegistration}
                    update={this.getUpdateRegistration}
                />
                <RegistrationPagination
                    total={this.state.registrations.length}
                    perPage={this.state.perPage}
                    currentPage={this.state.currentPage}
                    setPage={setPage}
                    loading={this.state.isLoading}
                />
            </div>
        )
    }
}

export default RegistrationPage