import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import './Auth.css';

class AuthPage extends Component {

    static contextType = AuthContext;

    constructor(props) {
        super(props);

        this.email = React.createRef();
        this.password = React.createRef();
    }

    submitHandler = (event) => {
        event.preventDefault();

        const email = this.email.current.value;
        const password = this.password.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        const request = {
            query: `
                query {
                    login(email: "${email}" password: "${password}") {
                        userId
                        token
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
        .then(async (res) => {
            const data = await res.json();
            if (data.errors && data.errors.length) {
                console.log(data.errors)
                this.context.logout();
                
                return;
            }

            this.context.login(data.data.login.token, data.data.login.userId);
        })
        .catch(err => {
            console.log(err);
        })
    }

    render() {
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
                <button type="submit">Submit</button>
            </div>
        </form>
    }
}

export default AuthPage;