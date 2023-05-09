import React from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/auth-context';
import './navigation.css';

const navigation = props => (
    <AuthContext.Consumer>
        {(context) => {
            return (
                <header className='main-header'>
                    <ul className='navigation-list'>
                        {context.token && <li className='navigation'>
                            <NavLink to='/event'>Events</NavLink>
                        </li>}
                        {context.token && <li className='navigation'>
                            <NavLink to='/register'>Registered participants</NavLink>
                        </li>}
                        {!context.token && <li className='navigation'>
                            <NavLink to='/auth'>Log in</NavLink>
                        </li>}
                        {!context.token && <li className='navigation'>
                            <NavLink to='/signup'>Sign up</NavLink>
                        </li>}
                        {context.token && <li className='navigation'>
                            <button onClick={context.logout}>Logout</button>
                        </li>}
                    </ul>
                </header>
            );
        }}
    </AuthContext.Consumer>
)

export default navigation;