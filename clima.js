const $btnSignIn = document.querySelector('.btncolor1'),
    $btnSignUp = document.querySelector('.btncolor'),
    $signUp = document.querySelector('.sign-up'),
    $signIn = document.querySelector('.sign-in');

document.addEventListener('click', e => {
    if (e.target === $btnSignIn || e.target === $btnSignUp) {
        $signIn.classList.toggle('active');
        $signUp.classList.toggle('active')
    }
});
//Clima
const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", e =>{
    // En caso de que el usuario aprete el boton sin llenar el campo
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){ // pedir al navegador la geolocalizacion
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("La geolocalización no está disponible");
    }
});

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=eccc60e1e0d65af026aef226433fe2ee`;
    fetchData();
}

function onSuccess(position){
    const {latitude, longitude} = position.coords; // pedir latitud y longitud
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=eccc60e1e0d65af026aef226433fe2ee`;
    fetchData();
}

function onError(error){
    // Si algun error ocurre pidiendo la geolocalizacion
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData(){
    infoTxt.innerText = "Obteniendo clima...";
    infoTxt.classList.add("pending");
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        infoTxt.innerText = "Algo salió mal";
        infoTxt.classList.replace("pending", "error");
    });
}

function weatherDetails(info){
    if(info.cod == "404"){ // si el usuario ingresa una ciudad no valida
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} no es una ciudad válida`;
    }else{
        // pedir la informacion del clima 
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;

        // usar iconos custom dependiendo del clima
        if(id == 800){
            wIcon.src = "icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "icons/storm.svg";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "icons/rain.svg";
        }
        
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});
