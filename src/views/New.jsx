import React, {useState} from 'react';
import { getRecord, updateRecord, createRecord } from '../api/Airtable';

function New () {

    const [content, setContent] = useState('');

    async function createNote() {
        let authorID = JSON.parse(localStorage.getItem('user')).id

        let note = {
            name: "New note",
            user: [authorID],
            updatedAt: Date.now(),
            version: 1,
            body: content,
            suggestions: "-",
            subnotes: "-"
        }

        let record = await createRecord('Notes', note);
        window.location.href = `/notes/${record.fields.id}`;
    }


    return (
        <div className='w-full flex flex-col space-y-4' >
            <h1 className='text-2xl font-bold'>New Note</h1>
            <textarea 
                onChange={(e) => setContent(e.target.value)} 
                className='w-full h-96 p-4 border border-gray-300 rounded-md' 
                placeholder='Type your note here'
                value={content}
            />
            <button onClick={createNote} className='bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-lg'>
                Save
            </button>
        </div>
    );
}

export default New;