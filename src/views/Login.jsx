import React, { useState, useEffect } from 'react';
import { findRecordByField, createRecord } from '../api/Airtable';
import { Button } from '../components/Elements';


function Login() {
    const [email, setEmail] = useState('');

    async function loginUser() {
        console.log('loginUser', email)
        let user = await findRecordByField('Users', 'email', email)
        if (!user || !user.id) {
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
            context: user.fields.context,
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


        <div className="relative grid grid-cols-1 mt-0 gap-24  z-10">
            <div className="flex flex-col space-y-4">
                <div className="space-y-2">
                    <div className="space-y-2 max-w-[700px] ">
                        <h1 className=" text-black font-bold tracking-tighter text-5xl md:text-6xl">
                            AI Powered <br /> <span className="text-blue-500">Journaling Tool</span>
                        </h1>
                        <p className=" text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                            A simple and powerful tool to help you write better and faster. Quickly generate ideas, write drafts, and get feedback on your writing.
                        </p>
                        <p className=" text-gray-700 md:text-xl/relaxed lg:text-base/relaxed font-medium xl:text-xl/relaxed dark:text-gray-400">
                            Enter your email to get started
                        </p>
                    </div>
                </div>
                <div className="w-full max-w-sm space-y-2">

                    <form className='flex space-x-2' onSubmit={handleSubmit}>
                        <input
                            className='border border-gray-300 rounded-md p-2 w-full'
                            placeholder='Email'
                            type="email"
                            id="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button size="xl" type="submit">Submit</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;