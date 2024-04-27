async function getUserLocation (setLocation) {
    // if geolocation is supported by the users browser
    if (navigator.geolocation) {
        // get the current users location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // save the geolocation coordinates in two variables
                const { latitude, longitude } = position.coords;
                // update the value of userlocation variable
                let location = ({ latitude, longitude });
                // console.log('User location:', location);
                setLocation(location);
                return location
            },
            // if there was an error getting the users location
            (error) => {
                console.error('Error getting user location:', error);
            }
        );
    }
    // if geolocation is not supported by the users browser
    else {
        console.error('Geolocation is not supported by this browser.');
    }
};

export default getUserLocation;