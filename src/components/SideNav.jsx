
import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { getRecords, deleteRecord, findRecordsByField } from '../api/Airtable';

export const SideNav = (props) => {
  const [notes, setNotes] = useState([])
  const [user, setUser] = useState({})
  const [menuOpen, setMenuOpen] = useState(true)

  async function loadNotes() {

    let records = await getRecords('Notes')

    let user = JSON.parse(localStorage.getItem('user'))
    let authorID = user.id
    let authorName = user.name
    setUser(user)

    records = records.filter(record => record.fields.user[0] === authorID)
    console.log("author notes", records)

    if (!records) {
      return
    }

    let notes = records.map(record => {
      return {
        id: record.fields.id,
        recordID: record.id,
        name: record.fields.name,
        subnotes: record.fields.subnotes
      }
    })

    setNotes(notes)
  }

  useEffect(() => {
    loadNotes()
  }, [])


  return (
    <div className="space-y-4 flex flex-col items-stretch md:w-[300px]">
      <div className='flex justify-between'>
        <div className=" text-lg font-bold ">{user.name}'s Blog</div>
        <div className='flex gap-2'>
          <Link to={"/new"} className="bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-md">+</Link>
          <button onClick={e => setMenuOpen(!menuOpen)} className={
            (menuOpen ? "" : "rotate-90") + 
            " bg-gray-500 text-white w-8 h-8 pb-4  items-center justify-center rounded-md transition-all"}>⌄</button>
        </div>
      </div>


      <div className='hidden md:flex space-y-4  flex-col items-stretch  ' style={{
        display: menuOpen ? 'flex' : 'none'
      }}>
        {
          notes && notes.map((note, index) => {
            return (
              <div key={index}>
                <SideNavLink note={note} />
              </div>
            )
          })
        }
        <NavLink to={"/context"} className={({ isActive }) =>
          isActive ? "bg-gray-500 text-white px-4 py-2 rounded-md text-left flex justify-between items-center"
            : "bg-gray-50 hover:bg-gray-200 text-black px-4 py-2 rounded-md text-left flex justify-between items-center"
        }>
          Context
        </NavLink>
        <button onClick={
          e => {
            localStorage.removeItem('user')
            window.location.href = '/'
          }
        } className={" bg-blue-100 text-blue-800 p-2 text-sm px-4 py-2 rounded-md text-left flex justify-between items-center"}>
          {"← Exit"}
        </button>
      </div>
    </div>
  );
};

function SideNavLink(props) {

  return <NavLink
    to={`/notes/${props.note.id}`}
    className={({ isActive }) =>
      isActive ? "bg-gray-500 text-ellipsis whitespace-nowrap text-white px-4 py-2 rounded-md text-left flex justify-between items-center" : "bg-gray-50 hover:bg-gray-200 text-black px-4 py-2 rounded-md text-left flex justify-between items-center"
    }
  >
    {/* Note #{props.note.id} */}
    {props.note.name}

    {props.note.id > 1 ? <p onClick={e => deleteRecord(props.note.recordID)}>-</p> : <></>}

  </NavLink>
}

