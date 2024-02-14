const usertab=document.querySelector("[data-userweather]")
const searchtab=document.querySelector("[data-searchweather]")
const usercontainer=document.querySelector(".weather-container")

const grantaccesscontainer=document.querySelector(".grant-location-container")
const searchform=document.querySelector("[data-searchform]")
const loadingscreen=document.querySelector(".loading-container")
const userinfocontainer=document.querySelector(".user-info-container")


// initially
let currenttab=usertab
const API_KEY="1ee762eb58945331b55bb7b0d0a64df9"
currenttab.classList.add("current-tab")
getfromsessionstorage();

function switchtab(clickedtab){
    if(clickedtab != currenttab){
    currenttab.classList.remove("current-tab")
    currenttab=clickedtab
    currenttab.classList.add("current-tab")


  //you want to go to search tab
    if(!searchform.classList.contains("active")){
        userinfocontainer.classList.remove("active")
        grantaccesscontainer.classList.remove("active")
        searchform.classList.add("active")

    }
    else{
        //earlier i was in searchweather tab now i want to move to yourweather tab
        searchform.classList.remove("active")
        userinfocontainer.classList.remove("active")
        //now if your weather tab is visible we have to display the weather so lets check local storage,
        // if it has coordinates 
        getfromsessionstorage()
    }
    }

}

usertab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchtab(usertab)
})

searchtab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchtab(searchtab)
})

function getfromsessionstorage(){
    const localcoordinates=sessionStorage.getItem("user-coordinates")
   if(!localcoordinates){
    grantaccesscontainer.classList.add("active")
   }
   else{
    const coordinates=JSON.parse(localcoordinates)
    fetchuserweatherinfo(coordinates)
   }

}

async function fetchuserweatherinfo(coordinates){
    const{lat,lon}=coordinates

    //make grantconatiner invisible
    grantaccesscontainer.classList.remove("active")
    //make loading screen visible 
    loadingscreen.classList.add("active")

    //API call
    try{
        const response= await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`  
        )
        const data=await response.json()
        loadingscreen.classList.remove("active")
        userinfocontainer.classList.add("active")
        renderweatherinfo(data)

    }
    catch{
        loadingscreen.classList.remove("active")
       

    }

}
 function renderweatherinfo(weatherInfo){
    //first fetch the element

    const cityname=document.querySelector("[data-cityname]")
    const countryicon=document.querySelector("[data-countryicon]")
    const desc=document.querySelector("[data-weatherdesc]")
    const weathericon=document.querySelector("[data-weathericon]")
    const temp=document.querySelector("[data-temp]")
    const windspeed=document.querySelector("[data-windspeed]")
    const humidity=document.querySelector("[data-humidity]")
    const cloudiness=document.querySelector("[data-cloudiness]")


    cityname.innerText=weatherInfo?.name;
    countryicon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weathericon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`
    temp.innerText=`${weatherInfo?.main?.temp} °C`;
    windspeed.innerText=`${innerText=weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;


}

function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else{

    }

}

function showposition(position){
    const usercoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(usercoordinates));
    fetchuserweatherinfo(usercoordinates)
}

const grantaccessbutton=document.querySelector("[data-grantaccess]");
grantaccessbutton.addEventListener("click",getlocation);

const searchinput=document.querySelector("[data-searchinput]")

searchform.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityname=searchinput.value

    if(cityname==="") 
        return;
    else 
    fetchsearchweatherinfo(cityname);

})

async function fetchsearchweatherinfo(city){
    loadingscreen.classList.add("active")
    userinfocontainer.classList.remove("active")
    grantaccessbutton.classList.remove("active")

    try {
        const response=await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            )
       const data=await response.json();
       loadingscreen.classList.remove("active")
       userinfocontainer.classList.add("active")
       renderweatherinfo(data)
       
        
    } 
    catch (error) {
        loadingscreen.classList.remove("active")
        
        
    }
}
 




