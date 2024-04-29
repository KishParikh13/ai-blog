import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCompletion } from '../api/OpenAI';
import { findRecordByField, updateRecord } from '../api/Airtable';
import { Accordion } from '../components/Elements';

function Note(props) {

    const { id } = useParams();

    const [noteName, setNoteName] = useState('');
    const [noteBody, setNoteBody] = useState('');
    const [note, setNote] = useState({});
    const [suggestionPrompt, setSuggestionPrompt] = useState('');
    const [selectedSuggestion, setSelectedSuggestion] = useState('');
    const [stagedRevision, setStagedRevision] = useState('');
    const [recordID, setRecordID] = useState('')

    const [suggestionPreprompt, setSuggestionPreprompt] = useState('You are a helpful assistant. Generate 4-5 suggestions based on the users prompt.');
    const [revisionPreprompt, setRevisionPreprompt] = useState('You are a coauthoring agent. Rewrite a users initial content to incorporate the suggestions and instructions.');

    async function updateNote (note) {
        let updatedNote = {
            name: noteName,
            body: noteBody,
            suggestions: JSON.stringify(note.suggestions),
            updatedAt: Date.now()
        }
        updateRecord('Notes', recordID, updatedNote)
    }

    async function getNote () {

        const record = await findRecordByField('Notes', "id", id)
        // console.log(id, record);
        setRecordID(record.id)

        // parse suggestions
        try {
            record.fields.suggestions = JSON.parse(record.fields.suggestions)
        } catch (e) {
            // console.log("failed:", record.fields.suggestions.trim());
            record.fields.suggestions = []
        }

        let note = {
            name: record.fields.name,
            body: record.fields.body,
            createdAt: record.fields.createdAt,
            updatedAt: record.fields.updatedAt,
            suggestions: record.fields.suggestions
        }

        // console.log(note);
        setNote(note)
        setNoteName(note.name)
        setNoteBody(note.body)
    }

    useEffect(() => {
        getNote()
    }, [id])

    const generateSuggestions = async (prompt) => {
        let messages = [
            { role: 'system', content: suggestionPreprompt },
            { role: 'user', content: `Some context about me: ${noteName} Note body: ${noteBody}` },
            { role: 'user', content: `Note title: ${noteName} Note body: ${noteBody}` },
            { role: 'user', content: `${prompt}`}
        ]
        let suggestions = await getCompletion(messages);
        // console.log("suggestions", suggestions);
        suggestions = suggestions.content
        suggestions = suggestions.split('\n');
        suggestions = suggestions.filter(suggestion => suggestion.length > 0);

        let newNote = {
            ...note,
            updatedAt: Date.now(),
            suggestions: suggestions
        }
        setNote (newNote)
        updateNote (newNote)
    }

    const deleteSuggestion = (selectedIndex) => {
        let newSuggestions = note.suggestions.filter((s, index) => index !== selectedIndex)
        let newNote = {
            ...note,
            updatedAt: Date.now(),
            suggestions: newSuggestions
        }
        setNote (newNote)
        updateNote (newNote)
    }

    async function incorporateSuggestion (suggestion, prompt) {
        let messages = [
            { role: 'system', content: revisionPreprompt },
            { role: 'user', content: `Rewrite this: ${noteBody}. It should include this AI suggestion ${suggestion} and user input ${prompt}` },
        ]
        let completion = await getCompletion(messages);
        // console.log("revision", completion);
        let message = completion.content
        setStagedRevision(message)
        // console.log(message);
    }
    
    async function getUser () {
        let user = JSON.parse(localStorage.getItem('user'))
        return user
    }


    async function routePrompt (prompt) {
        let messages = [
            { role: 'system', content: 'The user can either ask for Suggestions or Revisions. Based on the user prompt, respond with either "Suggest" or Revise", no punctuation.' },
            { role: 'user', content: ` User prompt: ${prompt}.` },
        ]
        let completion = await getCompletion(messages);

        
        // console.log("routePrompt", completion.content);

        switch (completion.content) {
            case 'Suggest':
                generateSuggestions(prompt)
                break;
            case 'Revise':
                incorporateSuggestion(selectedSuggestion, prompt)
                break;
            default:
                // console.log("No action taken");
        }
    }

    async function getLearnings (prompt) {

        let user = await getUser()
        let userName = user.name
        let userContext = user.context
        let messages = [
            { role: 'system', content: `You are to analyze a ${userName}'s journal entry. Based on the provided information, list any inferences about the persons psychology or life. Include a reason as to why that conclusion was made. Format it in first person as a bullet point list.` },
            { role: 'user', content: `${userName}'s note" ${noteName} ${noteBody}` },
            { role: 'user', content: `${userName}'s bio: ${userContext}` },
            { role: 'user', content: `${userName}'s prompt: ${prompt}. Learnings:` },
        ]
        let completion = await getCompletion(messages);
        console.log("getLearnings", completion.content);
        // console.log("revision", completion);
        let message = completion.content
        setStagedRevision(message)
    }

    return (
        <div className='w-full flex flex-col space-y-4' >
            <h1 className='text-sm'>Note #{id} - Created {new Date(note.createdAt).toLocaleString()}</h1>
            <input
                value={noteName}
                onChange={(e) => {
                    setNoteName(e.target.value);
                    let newNote = {
                        ...note,
                        updatedAt: Date.now(),
                        name: e.target.value
                    }
                    updateNote (newNote)
                }
                }
                className='w-full p-4 border border-gray-300 rounded-md'
                placeholder='Title' />
            <textarea
                value={noteBody}
                onChange={(e) => {
                    setNoteBody(e.target.value);
                    let newNote = {
                        ...note,
                        updatedAt: Date.now(),
                        body: e.target.value
                    }
                    updateNote (newNote)
                }}
                className='w-full h-96 p-4 border border-gray-300 rounded-md'
                placeholder='Type your note here' />
            <div>
                {stagedRevision && <div className='flex flex-col space-y-2 bg-green-50  border border-green-800 p-4 mb-4 rounded-md'>
                    <h4 className='text-sm text-green-800 '>AI Suggestion</h4>
                    <p>{stagedRevision}</p>
                    <div className='flex space-x-2'>
                    <button onClick={e => {
                        setNoteBody(stagedRevision)
                        let newNote = {
                            ...note,
                            updatedAt: Date.now(),
                            body: stagedRevision
                        }
                        setNote(newNote);
                        // saveNote(newNote, id)
                        updateNote (newNote)
                        setStagedRevision('')
                        setSuggestionPrompt('')
                    }
                    } className='border border-green-700 text-green-700 bg-white  hover:bg-green-700 hover:text-white px-4 py-2 rounded-md text-lg'>
                        Accept
                    </button>
                    <button onClick={e => setStagedRevision('')} className='border border-red-700 text-red-700 bg-white  hover:bg-red-700 hover:text-white px-4 py-2 rounded-md text-lg'>
                        Reject
                    </button>
                    {/*  append suggestion option */}
                    <button onClick={e => {
                        setNoteBody(noteBody + "/n" + stagedRevision)
                        let newNote = {
                            ...note,
                            updatedAt: Date.now(),
                            body: noteBody + "/n" + stagedRevision
                        }
                        setNote(newNote);
                        // saveNote(newNote, id)
                        updateNote (newNote)
                        setStagedRevision('')
                        setSuggestionPrompt('')
                    }
                    } className='border border-green-700 text-green-700 bg-white  hover:bg-green-700 hover:text-white px-4 py-2 rounded-md text-lg'>
                        Append
                    </button>
                    </div>
                </div>
                }

                {/* revision prompt */}
                {/* <input value={revisionPreprompt} onChange={
                    (e) => setRevisionPreprompt(e.target.value)
                } className='w-full p-2 border border-gray-300 rounded-md text-xs mb-2' placeholder='Preprompt' /> */}

                <div className='flex gap-2 mb-2 whitespace-nowrap'>
                    <input value={suggestionPrompt} onChange={
                        (e) => setSuggestionPrompt(e.target.value)
                    } className='w-full p-2 border border-gray-300 rounded-md' placeholder='Prompt' />
                    {/* <button onClick={e => routePrompt(suggestionPrompt)} className='bg-black text-white px-4 py-2 rounded-md '>
                        Route
                    </button> */}
                     <button onClick={e => incorporateSuggestion (selectedSuggestion, suggestionPrompt)} className='bg-blue-500 text-white px-4 py-2 rounded-md '>
                        Revise
                    </button>   
                    <button onClick={generateSuggestions} className='bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-lg'>
                        Suggest
                    </button>
                    <button onClick={getLearnings} className='bg-blue-500 text-white px-4 py-2 rounded-md '>
                        Learn
                    </button>
                </div>
                {/* sugg prompt */}
                {/* <input value={suggestionPreprompt} onChange={
                    (e) => setSuggestionPreprompt(e.target.value)
                } className='w-full p-2 border border-gray-300 rounded-md text-xs' placeholder='Preprompt' /> */}

                <Accordion title='Suggestions'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4'>
                    {
                        note.suggestions && note.suggestions.map((suggestion, i) => {
                            return (
                                <div key={i} className={
                                    (selectedSuggestion === suggestion
                                        ? 'border border-blue-500 p-4 rounded-md'
                                        : 'border border-gray-300 p-4 rounded-md')
                                        +
                                    ' flex flex-row items-start'
                                } onClick={
                                    () => setSelectedSuggestion(suggestion)
                                }>
                                    <p>{suggestion}</p>
                                    <button onClick={e => {
                                        // delete suggestion'
                                        // confirm delete
                                        let confirm = window.confirm("Are you sure you want to delete this suggestion?")
                                        if (confirm) {
                                            deleteSuggestion(i)
                                        }

                                    }} className=' text-gray-500 '>
                                        X
                                    </button>
                                </div>
                            )
                        })
                    }
                </div>
                </Accordion>
                
            </div>
        </div>
    );
}

export default Note;