
//Getting the elements from the DOM
const inputZipCodeElement = document.getElementById("inputZipCode");
const selectCityElement = document.getElementById("selectCity"); 
const buttonValidateElement = document.getElementById('buttonValidate'); 
const buttonOptionsElement = document.getElementById('options'); 
const buttonValidateOptionsElement = document.getElementById('buttonValidateOptions'); 
const buttonNextDayElement = document.getElementById('buttonNextDay'); 
const buttonPreviousDayElement = document.getElementById('buttonPreviousDay'); 
const formOptionsElement = document.getElementById('formOptions'); 
const divFormOptionsElement =  document.getElementById('divFormOptions'); 
const divOptionsElement = document.getElementById('divOption');
const divInfoElement = document.getElementById('divInfo'); 
const pMax = document.getElementById('pMax');
const pMin = document.getElementById('pMin');
const pRain = document.getElementById('pPrain');
const pSun = document.getElementById('pSun');
const pDate = document.getElementById('pDate');
const checklatitude = document.getElementById('checkBoxLatitude');
const checklongitude = document.getElementById('checkBoxLongitude');
const checkRainAccumulation = document.getElementById('checkBoxRainAccumulation');
const checkWindSpeed = document.getElementById('checkBoxWindSpeed');
const checkWindDirection = document.getElementById('checkBoxWindDirection');
const numberDaysElement = document.getElementById('numberDays'); 
const video = document.getElementById('video'); 



//Hiding the validation button 
hide(buttonValidateElement);  

//Hiding the nextDay button
hide(buttonNextDayElement);

//Hiding the previousDay button
hide(buttonPreviousDayElement); 

//necessary variables 
//The number of the day being displayed 
let dayNum; 
//The inseeCode of the city being displayed 
let code; 


//putting the number of days to 1 by default 
if(localStorage.getItem('numberDaysElement') == null){
    localStorage.setItem('numberDaysElement', 1); 
}


/*
 *adding a listener on the validateOptions button 
 *this listener close the options form when the button is clicked
 *it stores the choices of the user in the local storage
 *it reloads the page   
*/
formOptionsElement.addEventListener('submit', (evt)=>{

    evt.preventDefault(); 

    //storing the choices of the user 
    if(checklatitude.checked){
        localStorage.setItem('checklatitude', true); 
    }
    else{
        localStorage.removeItem('checklatitude'); 
    }

    if(checklongitude.checked){
        localStorage.setItem('checklongitude', true); 
    }
    else{
        localStorage.removeItem('checklongitude'); 
    }

    if(checkRainAccumulation.checked){
        localStorage.setItem('checkRainAccumulation', true); 
    }
    else{
        localStorage.removeItem('checkRainAccumulation'); 
    }

    if(checkWindSpeed.checked){
        localStorage.setItem('checkWindSpeed', true); 
    }
    else{
        localStorage.removeItem('checkWindSpeed'); 
    }

    if(checkWindDirection.checked){
        localStorage.setItem('checkWindDirection', true); 
    }
    else{
        localStorage.removeItem('checkWindDirection'); 
    }

    //getting the number of days 
    localStorage.setItem('numberDaysElement', numberDaysElement.value); 

    //hiding the options form
    divFormOptionsElement.style.display = "none";

    location.reload(); 
    
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
 *adding a listener to the next day button
 *this listener increments dayNum and then dispaly the informations of this day
 *If the day displayed is the last day asked by the user, the button disappears  
 *If the day displayed is the 2nd day, the previous day button appears
 */
buttonNextDayElement.addEventListener('click', async ()=>{

    dayNum++;

    //Hiding the button if it's the last day
    if(dayNum == localStorage.getItem('numberDaysElement')-1){
        hide(buttonNextDayElement); 
    }

    //Showing the previousDay button if it's the 2nd day
    if(dayNum == 1){
        show(buttonPreviousDayElement); 
    }

    //Showing the informations of this day
    tab = await fetchWeatherByCity(code,dayNum);
    weatherDisplay(tab);
}); 


/*
 *adding a listener to the previous day button
 *this listener decrements dayNum and then dispaly the informations of this day
 *If the day displayed is the first day, the button disappears 
 *If the day displayed is the not the last day, the next day button appears 
 */
buttonPreviousDayElement.addEventListener('click', async ()=>{

    dayNum--; 

    //Hiding the button if it's the first day
    if(dayNum == 0){
        hide(buttonPreviousDayElement); 
    }

    //Showing the NextDay button if it's not the last day
    if(dayNum == localStorage.getItem('numberDaysElement')-2){
        show(buttonNextDayElement); 
    }

    //Showing the information of this day
    tab = await fetchWeatherByCity(code,dayNum);
    weatherDisplay(tab);
});

/*
 *adding a listener on the validation elemnt 
 *This listener shows the weather informations when the validation button is clicked
 */ 
buttonValidateElement.addEventListener('click',async ()=>{

        let tab; 
        dayNum = 0; 

        //getting the code of the city 
        code = selectCityElement.value;

        //Getting the num of days stored in the browser 
        let numOfDays = localStorage.getItem('numberDaysElement'); 

        //getting the weather information and displaying it
        tab = await fetchWeatherByCity(code,dayNum);
        weatherDisplay(tab);
        
        //If there is more than one day to dispaly
        if(numOfDays > 1){
            //showing the next day button 
            show(buttonNextDayElement); 
        }


        
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
async function fetchWeatherByCity(cityCode,day) {
    //create tab for data
    let tab = new Array(11) ;
    try {
        const response = await fetch(
            `https://api.meteo-concept.com/api/forecast/daily/${day}?token=02eb3bfd78846c99ce1cfbcf5da2535a16e462a19a8a464bcf1bad211f631ef9&insee=${cityCode}`
        );
        const data = await response.json();
        
        //console.log(data);
        
        // storing the informations in the tab
        tab[0] = data.forecast.tmax;
        tab[1] = data.forecast.tmin;
        tab[2] = data.forecast.sun_hours;
        tab[3] = data.forecast.probarain;
        tab[5] = data.forecast.latitude;
        tab[6] = data.forecast.longitude;
        tab[7] = data.forecast.rr10;
        tab[8] = data.forecast.wind10m;
        tab[9] = data.forecast.dirwind10m;
        tab[10] = data.forecast.weather;

        let treatementDate = new String(data.forecast.datetime);
        let date = treatementDate.split("T")[0];
        tab[4] = date;

    } catch (error) {
        console.error("Error during the request to the API:", error);
    }
    return tab;
}

/*
 *adds a p element who's text content is the value entered in param to the options div
*/
function addToOptionsDiv(value){
    let element = document.createElement('p'); 
    element.innerHTML = value; 
    element.classList.add('option'); 
    divOptionsElement.appendChild(element); 
}

function weatherDisplay(tab){

    //Modifying the information container's style
    divInfoElement.style.backgroundColor = '#ffffff56'; 
    divInfoElement.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)'; 


    //reinitializing the informations 
    pDate.innerHTML = '<i class="fa-solid fa-calendar-days"></i> '; 
    pMax.textContent = 'Max : ';
    pMin.textContent = 'Min : ';
    pRain.innerHTML = '<i class="fa-solid fa-droplet"></i> ';
    pSun.innerHTML = '<i class="fa-solid fa-sun"></i> ';

    //Clearing the options div
    divOptionsElement.innerHTML = ''; 

    //put element on the screen
    pDate.innerHTML += `${tab[4]}`
    pMax.textContent += `${tab[0]}°C`;
    pMin.textContent += `${tab[1]}°C`;
    pRain.innerHTML += `${tab[3]}%`;
    pSun.innerHTML += `${tab[2]}`;

    //Verifiyng the options choosed by the user and displaying them

    if(localStorage.getItem('checklatitude') != null){
        addToOptionsDiv('<i class="fa-solid fa-globe"></i> '+tab[5].toFixed(5)); 
    }


    if(localStorage.getItem('checklongitude') != null){

        if(localStorage.getItem('checklatitude') == null){
            addToOptionsDiv('<i class="fa-solid fa-globe"></i> '+tab[6].toFixed(5)); 
        }
        else{
            divOptionsElement.children.item(0).innerHTML += '/'+tab[6].toFixed(5); 
        }
    }

    if(localStorage.getItem('checkRainAccumulation') != null){
        addToOptionsDiv('<i class="fa-solid fa-cloud-rain"></i> '+tab[7].toFixed(2));
    }
 
    if(localStorage.getItem('checkWindSpeed') != null){
        addToOptionsDiv('<i class="fa-solid fa-wind"></i> '+tab[8].toFixed(2));

    }

    if(localStorage.getItem('checkWindDirection') != null){
        addToOptionsDiv('<i class="fa-solid fa-compass"></i> '+tab[9].toFixed(2));
    }
    setBackground();

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

async function setBackground() {
    let tab = await fetchWeatherByCity(code, dayNum);
    const videoElement = document.getElementById('video'); // Récupère l'élément vidéo

    if (tab[10] !== undefined) { // Assurez-vous que tab[10] existe
        let videoSrc = '';

        if (tab[10] >= 0 && tab[10] < 8) {
            videoSrc = 'beauTemps.mp4';
            document.body.style.backgroundColor = '#2D6ABA';
        } else if ((tab[10] >= 8 && tab[10] < 100) || tab[10] >= 210) {
            videoSrc = 'nuageux.mp4';
            document.body.style.backgroundColor = '#295E9B';
            
        } else if (tab[10] >= 100 && tab[10] < 210) {
            videoSrc = 'eclair.mp4';
            document.body.style.backgroundColor = '#183D68';
        }

        if (videoElement) {
            videoElement.src = videoSrc; // Change le source de la vidéo
            videoElement.load(); // Recharge la vidéo
        }
    }
}