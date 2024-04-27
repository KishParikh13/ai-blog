
import { useEffect, useState } from "react";

function EventCard(props) {

    return (
        <div key={props.id} className={(props.selected ? " border-blue-600 " : "border-gray-200 ")  + " border-2 h-full text-left bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"}>
            {
                props.fields["Event Image"] &&
                <img
                    alt=""
                    className="w-full"
                    height={225}
                    src={props.fields["Event Image"][0].url}
                    style={{
                        aspectRatio: "400/225",
                        objectFit: "cover",
                    }}
                    width={400}
                />
            }
            <div className="p-4 ">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">{props.fields["Event Name"]}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-2">{props.fields["Event Start Date"]}</p>
                <p className="text-gray-500 dark:text-gray-400">{props.fields["Event Details"]}</p>

                {/* <div className="flex gap-2 mt-4">
                    <button className="button bg-gray-500" type="button">
                        Like
                    </button>
                    <button
                     className="button" type="button" >
                        View details
                    </button>
                </div> */}
            </div>
        </div>
    )
}



export default EventCard;
