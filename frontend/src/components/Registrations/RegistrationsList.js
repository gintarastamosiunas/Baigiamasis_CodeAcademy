import React from "react";
import './RegistrationsList.css'

const registrationsList = props => {
    if (props.loading) {
        return <h2>Loading...</h2>
    }

    const calcAge = (birthDate) => {
        const lengthOfYear = 31557600000;
        const birthday = +new Date(birthDate);
        return ~~((Date.now() - birthday) / (lengthOfYear));
    }

    return <ul className='registration-table'>
        <li className="registration-list-item">
            <div>Name</div>
            <div>Surname</div>
            <div>Email</div>
            <div>Date of birth</div>
            <div></div>
            <div></div>
        </li>
        {
            props.registrations.map(registration => (
                <li className='registration-list-item' key={registration._id}>
                    <div>{registration.name}</div>
                    <div>{registration.surname}</div>
                    <div>{registration.email}</div>
                    <div>{new Date(registration.birthDate).toLocaleDateString()} ({calcAge(registration.birthDate)} years old)</div>
                    <div>
                        <button onClick={() => props.update(registration._id)}>Edit</button>
                    </div>
                    <div>
                        <button onClick={()=> props.delete(registration._id)}>Delete</button>
                    </div>
                </li>
            ))
        }
    </ul>;
}

export default registrationsList;