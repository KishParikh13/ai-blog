import { useState } from "react"



export function Button(props) {
    return (
        <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 dark:bg-blue-600 dark:focus:ring-blue-600"
            {...props}
        >
            {props.children}
        </button>
    )
}

export function ButtonLink(props) {
    return (
        <a
            className={props.selected ? " font-bold text-blue-600 " : "text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" + ` text-left block `}    
            {...props}
        >
            { props.children }
        </a>
    )

}


export function Select(props) {
    return (
        <select
            {...props}
            className={`block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${props.className}`}
        >
            <option value={""}>Select {props.name}...</option>
            {
                props.options.map((option, i) => {
                    return <option key={i} value={option}>{option}</option>
                })
            }
        </select>
    )
}

export function Input(props) {
    return (
        <input
            {...props}
            className={`block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${props.className}`}
        />
    )
}

export function SearchIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}


// accordion

export function Accordion(props) {
    const [open, setOpen] = useState(false)
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="p-4 flex justify-between items-center" onClick={e => setOpen(!open)}>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-50">{props.title}</div>
                <div className="text-gray-500 dark:text-gray-400">{open ? "▲" : "▼"}</div>
            </div>
            <div className={(open ? "block" : "hidden") + " px-4 pb-4"}>

                {props.children}

            </div>

        </div>
    )
}