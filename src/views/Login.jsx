import React, { useState, useEffect } from 'react';
import { findRecordByField, createRecord } from '../api/Airtable';


function Login() {
    const [email, setEmail] = useState('');

    async function loginUser () {
        let user = await findRecordByField('Users', 'email', email)
        if (!user) {
            user = {
                email: email,
                context: '',
                 // get the name from the email
                name: email.split('@')[0],
            }
            user = await createRecord('Users', user)
        }

        let formattedUser = {
            id: user.id,
            email: user.fields.email,
            name: user.fields.name,
        }
        localStorage.setItem('user', JSON.stringify(formattedUser))
        window.location.href = '/new';
        return true
    }
    

    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser();

    };

    useEffect(() => {
        // check if user is already logged in
        let user = localStorage.getItem('user');
        if (user) {
            window.location.href = '/new';
        }
    }, [])

    return (
        <div className='flex flex-col justify-center items-center gap-8 w-full h-[50vh]'>
            <h2 className={
                'text-2xl font-bold'
            }>
                my <span className='text-blue-500'>AI</span> Blog (beta)
            </h2>
            <p>by kish</p>

            <form className='flex space-x-2' onSubmit={handleSubmit}>
                <input
                    className='border border-gray-300 rounded-md p-2 w-full'
                    placeholder='Email'
                    type="email" id="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button className={
                    'bg-blue-500 text-white py-2 px-4 rounded-md'
                } type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Login;