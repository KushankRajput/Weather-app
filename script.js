//optional chaining=>agar ap kisi JSON file ke andr ek property ko search krte hain 
// ,to using optional chaining  hum us property ko access kr skte hain
//or agr property exits hi nhi krti to optional chaining "error" though nhi krta (sirf undefiend show krta hai)

// clickedTab=clickedTab
//currentTab=currentTab

const userTab=document.querySelector("[data-userWeather]")
const searchTab=document.querySelector("[data-searchWeather]")
const userContainer=document.querySelector(".weather-container")
const grantAccessContainer=document.querySelector(".grant-location-container") 
const searchForm=document.querySelector("[data-searchForm]")
const loadingScreen=document.querySelector(".loading-container")
const userInfoContainer=document.querySelector(".user-info-container")

let currentTab=userTab;
const API_KEY="ca251c95b6acd6dd12978aff39685c24";
currentTab.classList.add("current-tab")
getfromSessionStorage()

//use eventListener for the buttons userTab and searchTab

function switchTab(clickedTab){
    if(clickedTab !=currentTab){
        currentTab.classList.remove("current-tab")
        currentTab=clickedTab;
        currentTab.classList.add("current-tab")

        if (!searchForm.classList.contains("active")) {
            //if search form container is invisible,if yes,then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        //phle num search vale tab pr the,ab your weather visible krna hai
        //or search krne pr userinfoContainer show hota hai to use bhi hide krna hai
        else{
             searchForm.classList.remove("active")
             userInfoContainer.classList.remove("active")

             //your weather vale tab me aane ke bad  weather bhi display krna padega
             //lets check local storage cordinates if we have already saved them
             getfromSessionStorage()
        }
    }
}

userTab.addEventListener("click",()=>{
    //passing clicked tab as input parameter
    switchTab(userTab)
})

searchTab.addEventListener("click",()=>{
    //passing clicked tab as input parameter
    switchTab(searchTab)
})


//it checks wheather the cordinates are already present in the session storage 
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates")  //line 141
    if(! localCoordinates){
//agr local coordinates present nhi h  (already saved nhi hai)
        grantAccessContainer.classList.add("active")
    }else{ 
        //local cordinates ko access kro agr saved ho to
        const coordinates=JSON.parse(localCoordinates)
        fetchUserWeatherInfo(coordinates);
    }
}

//for coordinates
async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // make grantcontainer invisible  (qki hme loader show krna hai)
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();

        //api call ke bad jb data aajaye to loader ko htao
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        //it iwll take the value from "data" and use it into the "userInfoContainer"
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        //HW

    }

}

//weatherInfo
function renderWeatherInfo(weatherInfo) {
    //fistly, we have to fethc the elements 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo)//for understanding the whole object ,returned by API

    //fetch value  from weatherInfo object and put it UI element (using optional chaining)
//city name "weatherInfo" name ke object ke andr "name" se save hai 
    cityName.innerText=weatherInfo?.name;
//countryIcon "weatherInfo" name ke object ke andr "sys" name ka object ke andr "country" name se save hai (and convert it to lower case)
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
//description  "weatherInfo" name ke object ke andr "weather" ke andr  1st index ke andr description ke andr save hai 
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp}°C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
}


function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no gelolocation support available
    }
}

function showPosition(position) {
//it will give us latitude and longitude
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);  //for display the changes on the UI
}

const   grantAccessButton=document.querySelector("[data-grantAccess]")
grantAccessButton.addEventListener("click",getLocation)


const searchInput=document.querySelector("[data-searchInput]")

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;

    if(cityName===""){
        return;
    }else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        alert("Search Api failed")
    }
}