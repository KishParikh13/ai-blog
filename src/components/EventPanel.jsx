
const EventPanel = (props) => {

   let topFields = ["Event Image",]
   let hideFields = ["Created By", "Status"]

   if (!props.event) {
      return null;
   }
   return (
      <div id="drawer-right-example" className={` md:w-1/2 w-full shadow-2xl fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform bg-white dark:bg-gray-800`}>
         <h3 id="drawer-right-label" className="inline-flex items-center mb-4 text-2xl font-semibold text-gray-800 ">
            {props.event.fields["Event Name"]}
         </h3>

         <div className="flex flex-col items-stretch gap-1">
            {
               Object.keys(props.event.fields).map((key, i) => (
               key === "Event Image" ?
                 <div>
                     <img
                        alt=""
                        className=" w-full rounded-md border border-gray-200"
                        src={props.event.fields["Event Image"][0].url}
                        style={{
                           objectFit: "cover",
                        }}
                     />
                 </div>
               :
               key === "Event Name" ?
                 <div>
                     
                 </div>
                 :
                 key === "Created By" ?
                   <div>
                       
                   </div>
               :
                  <div key={i} className="grid grid-cols-2 gap-4">
                     <div className="font-semibold">{key}</div>
                     <div>{props.event.fields[key] && JSON.stringify(props.event.fields[key]).substring(1)}</div>
                  </div>
               ))
            }
         </div>



         <hr className="my-4 border-gray-200 dark:border-gray-800" />
         <button
            type="button"
            onClick={e => props.setSelectedEvent(null)}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white" >
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
               <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <span className="sr-only">Close menu</span>
         </button>
         <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Supercharge your hiring by taking advantage of our <a href="#" className="text-blue-600 underline font-medium dark:text-blue-500 hover:no-underline">limited-time sale</a> for Flowbite Docs + Job Board. Unlimited access to over 190K top-ranked candidates and the #1 design job board.</p>
         <div className="grid grid-cols-2 gap-4">
            <a href="#" className="px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Learn more</a>
            <a href="#" className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
               Get access
               <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
               </svg>
            </a>
         </div>
      </div>
   )
}

export default EventPanel;