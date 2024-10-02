





//function apiMeteoConcept

async function fetchMeteoByCommune(cityCode) {
    try {
        const response = await fetch(
            `https://api.meteo-concept.com/api/forecast/daily/0?token=02eb3bfd78846c99ce1cfbcf5da2535a16e462a19a8a464bcf1bad211f631ef9&insee=${cityCode}`
        );
        const data = await response.json();
        
        //create tab for data
        let tab = new Array(4) ;
        // Clear previous content
        tab[0] = data.forecast.tmax;
        tab[1] = data.forecast.tmin;
        tab[2] = data.forecast.sun_hours;
        tab[3] = data.city.probarain;

    } catch (error) {
        console.error("Error during the request to the API:", error);
    }
    return tab;
}








/*
 * returns an array containing all the cities
 *  associated to the zipCode entered as a param
 */
async function getCities(zipCode){

    try {
        //Requestig the cities from the API
        const request = await fetch('https://geo.api.gouv.fr/communes?codePostal='+zipCode);   
    } 
    catch (error) {
        console.error("There was an error while getting the cities : ", error); 
        return -1; 
    }

    //Returning the array of objects returned by the request
    const citiesArray = request.json(); 
    return citiesArray; 
}


/*
 * returns an array containing an option tag for each city of the array entered in param
 */
function getCitiesAsOptions(citiesArray){

    // getting the number of cities found
    let citiesNb = citiesArray.legnth; 

    //If the number is less than 0, an error is returned 
    if(citiesNb <= 0){
        console.error("You have to enter an array with at least one element for this fucntion"); 
        return -1; 
    }

    //An array that will contain the options
    let options = new Array(cititesNb); 

    //The city being treated 
    let city; 

    //The option being created 
    let option; 

    for(let cityNum = 0 ; citiesNb > cityNum ; cityNum++){

        //Creating a new option
        option = document.createElement("option"); 
        //getting the current city 
        city = citiesArray[cityNum]; 

        //Setting the attributes of the option
        option.value = city.code; 
        option.textContent = city.nom; 

        //Putting the option in the array
        options[cityNum] = option; 
    }

    return options; 
}


/*
 *putting the options entered in param in the menu selectCity
 */ 
function putOptionsInMenu(options){

    const selectCityElement = document.getElementById('selectCity'); 

    for(option of options){
        selectCityElement.appendChild(option); 
    }
    
}