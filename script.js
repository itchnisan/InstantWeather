
//Getting the elements from the DOM
const inputZipCodeElement = document.getElementById("inputZipCode");
const selectCityElement = document.getElementById("selectCity"); 
const buttonValidateElement = document.getElementById('buttonValidate'); 
const pMax = document.getElementById('pMax');
const pMin = document.getElementById('pMin');
const pRain = document.getElementById('pPrain');
const pSun = document.getElementById('pSun');
const checklatitude = document.getElementById('checkBoxLatitude');
const checklongitude = document.getElementById('checkBoxLongitude');
const checkRainAccumulation = document.getElementById('checkBoxRainAccumulation');
const checkWindSpeed = document.getElementById('checkBoxWindSpeed');
const checkWindDirection = document.getElementById('checkBoxWindDirection');


//Hiding the validation button 
hideValidationButton();  

buttonValidateElement.addEventListener('click',async ()=>{
        let zipCode = selectCityElement.value;
        let tab = await fetchWeatherByCity(zipCode,0);
        weatherDisplay(tab);
});

/*
 *adding a listener on the zipCode input field 
 * This listener adds the cities in the select menu when entering a Zip Code
 */
inputZipCodeElement.addEventListener('keydown', async (evt)=>{

    //If the key pressed is enter
    if(evt.key == "Enter"){

        //Preventing the submission of the form
        evt.preventDefault(); 

        //Verifying that the number entered is really a zip Code
        const zipCodeFormat = /^\d{5}$/; 
        if(!(zipCodeFormat.test(inputZipCodeElement.value))){
            alert('vous devez rentrer un code postale'); 
        }

        //if the entered number is a really a zip code
        else{
            //getting the array of ciites returned by the API request 
            let citiesArray = await getCities(inputZipCodeElement.value); 


            //Getting the array of options to add to the city select menu
            let options = getCitiesAsOptions(citiesArray); 

            //Adding the options to the select menu
            putOptionsInMenu(options); 

            //Showing the validation button
            showValidationButon();  
        }

    }
    
});



//function apiMeteoConcept
async function fetchWeatherByCity(cityCode,day) {
    //create tab for data
    let tab = new Array(10) ;
    try {
        const response = await fetch(
            `https://api.meteo-concept.com/api/forecast/daily/${day}?token=02eb3bfd78846c99ce1cfbcf5da2535a16e462a19a8a464bcf1bad211f631ef9&insee=${cityCode}`
        );
        const data = await response.json();
        
        console.log(data);
        
        // Clear previous content
        tab[0] = data.forecast.tmax;
        tab[1] = data.forecast.tmin;
        tab[2] = data.forecast.sun_hours;
        tab[3] = data.forecast.probarain;
        if(localStorage.getItem('checklatitude') != null){
            tab[5] = data.forecast.latitude;
        }
        if(localStorage.getItem('checklongitude') != null){
            tab[6] = data.forecast.longitude;
        }
        if(localStorage.getItem('checkRainAccumulation') != null){
            tab[7] = data.forecast.rr10;
        }
        if(localStorage.getItem('checkWindSpeed') != null){
            tab[8] = data.forecast.wind10m;
        }
        if(localStorage.getItem('checkWindDirection') != null){
            tab[9] = data.forecast.dirwind10m;
        }
        let treatementDate = new String(data.forecast.datetime);
        let date = treatementDate.split("T")[0];
        tab[4] = date;

    } catch (error) {
        console.error("Error during the request to the API:", error);
    }
    return tab;
}


function weatherDisplay(tab,div){
    pMax.textContent = 'Min : ';
    pMin.textContent = 'Max : ';
    pRain.textContent = 'Probabilité de pluie : ';
    pSun.textContent = 'Ensoleillement journaliers : ';
    //put element on the screen
    pMax.textContent += `${tab[0]}°C`;
    pMin.textContent += `${tab[1]}°C`;
    pRain.textContent += `${tab[3]}%`;
    pSun.textContent += `${tab[2]}`;
}






/*
 * returns an array containing all the cities
 *  associated to the zipCode entered as a param
 */
async function getCities(zipCode){

    try {
        //Requestig the cities from the API
        const request = await fetch('https://geo.api.gouv.fr/communes?codePostal='+zipCode);

        //Getting the cities Array
        const citiesArray = await request.json();
        
        //Returning the array of objects returned by the request
        return citiesArray; 
    } 
    catch (error) {
        console.error("There was an error while getting the cities : ", error); 
        return -1; 
    }
}


/*
 * returns an array containing an option tag for each city of the array entered in param
 */
function getCitiesAsOptions(citiesArray){

    // getting the number of cities found
    let citiesNb = (citiesArray.length);

    //If the number is less than 0, an error is returned 
    if(citiesNb <= 0){
        window.alert("Veuillez entrer un code postale valide"); 
        console.error("You have to enter an array with at least one element for this fucntion"); 
        return -1; 
    }

    //An array that will contain the options
    let options = new Array(citiesNb); 
    
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
 *puts the options entered in param in the menu selectCity
 */ 
function putOptionsInMenu(options){

    selectCityElement.innerHTML = ''; 

    for(option of options){
        selectCityElement.appendChild(option); 
    }
    
}


/*
 *shows a validation button in the city select form
 */
function showValidationButon(){
    buttonValidateElement.style.display = 'block'; 
}

/*
 *hides the validation button in the city select form
 */
function hideValidationButton(){
    buttonValidateElement.style.display = 'none';
}