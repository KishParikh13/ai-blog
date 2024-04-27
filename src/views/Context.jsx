import React, {useEffect, useState} from 'react';
import { getRecord, updateRecord } from '../api/Airtable';

function Context () {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [context, setContext] = useState('');
    const [instructions, setInstructions] = useState('');

    async function updateUser (fields) {

        let userID = JSON.parse(localStorage.getItem('user')).id
        console.log("author", userID)

        updateRecord(
            'Users', 
            userID, 
            fields
        )
    }

    async function getUser () {

        let userID = JSON.parse(localStorage.getItem('user')).id
        console.log("author", userID)

        let user = await getRecord('Users', userID)
        console.log(user)
        setName(user.fields.name)
        setEmail(user.fields.email)
        setContext(user.fields.context)
        setInstructions(user.fields.instructions)

    }

    useEffect(() => {
        getUser()
    }, [])

    return (
        <div className='w-full flex flex-col space-y-4' >
            <h1 className='text-2xl font-bold'>Context</h1>
            <p>Share any information you want the AI to know about you.</p>
            <div className='flex space-x-4'>
                <input
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                        updateUser({ name: e.target.value })
                    }}
                    className='w-full p-4 border border-gray-300 rounded-md'
                    placeholder='Name'
                />
                <input
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                        updateUser({ email: e.target.value })
                    }}
                    className='w-full p-4 border border-gray-300 rounded-md'
                    placeholder='Email'
                />
            </div>
            <textarea 
                onChange={(e) => {
                    setContext(e.target.value)
                    updateUser({  context: e.target.value })
                }} 
                className='w-full h-96 p-4 border border-gray-300 rounded-md' 
                placeholder='Type your note here'
                value={context}
            />
            <textarea 
                onChange={(e) => {
                    setInstructions(e.target.value)
                    updateUser({ instructions: e.target.value })
                }} 
                className='w-full h-96 p-4 border border-gray-300 rounded-md' 
                placeholder='Type your note here'
                value={instructions}
            />
            {/* <button onClick={saveContext} className='bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-lg'>
                Save
            </button> */}
        </div>
    );
}

export default Context;