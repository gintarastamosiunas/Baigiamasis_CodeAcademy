import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import { NavLink } from 'react-router-dom';
import './Signup.css';

class SignupPage extends Component {

    static contextType = AuthContext;

    state = {
        registered: false,
        email: ''
    }

    constructor(props) {
        super(props);

        this.email = React.createRef();
        this.password = React.createRef();
        this.passwordRepeat = React.createRef();
    }

    submitHandler = (event) => {
        event.preventDefault();

        const email = this.email.current.value;
        const password = this.password.current.value;
        const passwordRepeat = this.passwordRepeat.current.value;

        if (email.trim().length === 0 || password.trim().length === 0 || passwordRepeat.trim().length === 0) {
            alert("Fill required fields!");
            
            return;
        }

        if (passwordRepeat.trim() !== password.trim()) {
            alert("Passwords does not match!");
            
            return;
        }

        const request = {
            query: `
                mutation {
                    createUser(userInput: {email: "${email}" password: "${password}"}) {
                        email
                    }
                }
            `
        }

        fetch('http://localhost:8001/graphql', {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            return res.json();
        })
        .then((resData) => {
            if (resData.errors && resData.errors.length) {
                console.log(resData.errors)
                alert(resData.errors[0].message);
                return;
            }

            this.setState({registered: true, email: resData.data.email});
        })
        .catch(err => {
            console.log(err);
        })
    }

    render() {

        if (this.state.registered) {
            return (
                <div className="sign-up-success">
                    <h1>
                        Registration for user {this.state.email} was successful. You can now <NavLink to='/auth'>Log in</NavLink>
                    </h1>
                </div>
            )
        }

        return <form onSubmit={this.submitHandler}>
            <div className="sign-up-row">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" required ref={this.email}/>
            </div>

            <div className="sign-up-row">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" required ref={this.password}/>
            </div>

            <div className="sign-up-row">
                <label htmlFor="password-repeat">Repeat Password</label>
                <input type="password" id="password-repeat" required ref={this.passwordRepeat}/>
            </div>

            <div className="sign-up-row">
                <button type="submit">Submit</button>
            </div>
        </form>
    }
}

export default SignupPage;