
//Getting the elements from the DOM
const inputZipCodeElement = document.getElementById("inputZipCode");
const selectCityElement = document.getElementById("selectCity"); 
const buttonValidateElement = document.getElementById('buttonValidate'); 
const buttonOptionsElement = document.getElementById('options'); 
const buttonValidateOptionsElement = document.getElementById('buttonValidateOptions'); 
const formOptionsElement = document.getElementById('formOptions'); 
const divFormOptionsElement =  document.getElementById('divFormOptions'); 
const pMax = document.getElementById('pMax');
const pMin = document.getElementById('pMin');
const pRain = document.getElementById('pPrain');
const pSun = document.getElementById('pSun');
const checklatitude = document.getElementById('checkBoxLatitude');
const checklongitude = document.getElementById('checkBoxLongitude');
const checkRainAccumulation = document.getElementById('checkBoxRainAccumulation');
const checkWindSpeed = document.getElementById('checkBoxWindSpeed');
const checkWindDirection = document.getElementById('checkBoxWindDirection');
const numberDaysElement = document.getElementById('numberDays'); 

//Hiding the validation button 
hide(buttonValidateElement);  

/*
 *adding a listener on the validateOptions button 
 *this listener close the form options when clicked
 *it stores the choices of the user in the local storage  
*/
buttonValidateOptionsElement.addEventListener('click', ()=>{


    //stocking the choices of the user 
    if(checklatitude.checked){
        localStorage.setItem('checklatitude', true); 
    }
    else{
        localStorage.setItem('checklatitude', null);
    }

    if(checklongitude.checked){
        localStorage.setItem('checklongitude', true); 
    }
    else{
        localStorage.setItem('checklongitude', null);
    }

    if(checkRainAccumulation.checked){
        localStorage.setItem('checkRainAccumulation', true); 
    }
    else{
        localStorage.setItem('checkRainAccumulation', null);
    }

    if(checkWindSpeed.checked){
        localStorage.setItem('checkWindSpeed', true); 
    }
    else{
        localStorage.setItem('checkWindSpeed', null);
    }

    if(checkWindDirection.checked){
        localStorage.setItem('checkWindDirection', true); 
    }
    else{
        localStorage.setItem('checkWindDirection', null);
    }

    //getting the number of days 
    localStorage.setItem('numberDaysElement', numberDaysElement.value); 

    //hiding the options form
    divFormOptionsElement.style.display = "none";
    
}); 


/*
 *adding a listener on the options button 
 *this listener shows a window with the options form 
 */
 buttonOptionsElement.addEventListener('click', ()=>{


    //getting the choices of the user 
    numberDaysElement.value = localStorage.getItem('numberDaysElement'); 

    if(localStorage.getItem('checklatitude') == 'true'){
        checklatitude.checked = true; 
    }

    if(localStorage.getItem('checklongitude') == 'true'){
        checklongitude.checked = true; 
    }

    if(localStorage.getItem('checkRainAccumulation') == 'true'){
        checkRainAccumulation.checked = true; 
    }

    if(localStorage.getItem('checkWindSpeed') == 'true'){
        checkWindSpeed.checked = true; 
    }

    if(localStorage.getItem('checkWindDirection') == 'true'){
        checkWindDirection.checked = true; 
    }

    //showing the options form
    divFormOptionsElement.style.display = "block";

 }); 

/*
 *adding a listener on the validation elemnt 
 *This listener shows the weather informations when the validation button is clicked
 */ 
buttonValidateElement.addEventListener('click',async ()=>{
        let zipCode = selectCityElement.value;
        let tab = await fetchWeatherByCity(zipCode);
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
            show(buttonValidateElement);  
        }

    }
    
});



//function apiMeteoConcept
async function fetchWeatherByCity(cityCode) {
    //create tab for data
    let tab = new Array(4) ;
    try {
        const response = await fetch(
            `https://api.meteo-concept.com/api/forecast/daily/0?token=02eb3bfd78846c99ce1cfbcf5da2535a16e462a19a8a464bcf1bad211f631ef9&insee=${cityCode}`
        );
        const data = await response.json();
        
        
        // Clear previous content
        tab[0] = data.forecast.tmax;
        tab[1] = data.forecast.tmin;
        tab[2] = data.forecast.sun_hours;
        tab[3] = data.forecast.probarain;

        console.log(tab);

    } catch (error) {
        console.error("Error during the request to the API:", error);
    }
    return tab;
}


function weatherDisplay(tab){
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
 *shows the elemnt entered in param
 */
function show(element){
    element.style.display = 'block'; 
}

/*
 *hides the elemnt entered in param
 */
function hide(element){
    element.style.display = 'none';
}