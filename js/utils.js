var weatherIconsMap = {
    "01d": "images/icons/icon-2.svg",
    "01n": "images/icons/icon-15.png",
    "02d": "images/icons/icon-3.svg",
    "02n": "images/icons/icon-16.png",
    "03d": "images/icons/icon-5.svg",
    "03n": "images/icons/icon-5.svg",
    "04d": "images/icons/icon-6.svg",
    "04n": "images/icons/icon-6.svg",
    "09d": "images/icons/icon-10.svg",
    "09n": "images/icons/icon-10.svg",
    "10d": "images/icons/icon-4.svg",
    "10n": "images/icons/icon-11.svg",
    "11d": "images/icons/icon-12.svg",
    "11n": "images/icons/icon-12.svg",
    "13d": "images/icons/icon-13.svg",
    "13n": "images/icons/icon-14.svg",
    "50d": "images/icons/icon-7.svg",
    "50n": "images/icons/icon-7.svg"
};

var weatherIconsDescription = {
    "01d": "day-sunny",
    "01n": "night-clear",
    "02d": "day-cloudy",
    "02n": "night-cloudy",
    "03d": "cloud",
    "03n": "cloud",
    "04d": "cloudy",
    "04n": "cloudy",
    "09d": "showers",
    "09n": "showers",
    "10d": "day-hail",
    "10n": "night-hail",
    "11d": "thunderstorm",
    "11n": "thunderstorm",
    "13d": "snow",
    "13n": "snow",
    "50d": "fog",
    "50n": "fog"
};

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const monthOfYear = ["January", "February", "March", "April", "May", "June",  "July", "August", "September", "October", "November", "December"]


function toCelsius(tempK) {
    return tempK - 273.15
} 
function toDay(timestamp, hoursAfterUTC) {
    date = new Date(timestamp);
    hoursAfterUTC = parseFloat(hoursAfterUTC)
    hoursAfterUTC = hoursAfterUTC + parseFloat(date.getTimezoneOffset() / 60);
    // Subtract the timezone offset (in hours) to get the local time
    date.setTime(date.getTime() + hoursAfterUTC*60*60*1000);
    const dayOfWeek = date.getDay();
    return dayNames[dayOfWeek];
}
function toTime(timestamp, hoursAfterUTC) {
    const date = new Date(timestamp);
    hoursAfterUTC = parseFloat(hoursAfterUTC)
    hoursAfterUTC = hoursAfterUTC + parseFloat(date.getTimezoneOffset() / 60);

    date.setTime(date.getTime() + hoursAfterUTC*60*60*1000);

    // Get the time in AM/PM format
    const hours = (date.getHours() % 12 || 12).toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";

    return `${hours}:${minutes} ${ampm}`;
}
function toDateMonth(timestamp, hoursAfterUTC) {
    const date = new Date(timestamp);
    hoursAfterUTC = parseFloat(hoursAfterUTC)
    hoursAfterUTC = hoursAfterUTC + parseFloat(date.getTimezoneOffset() / 60);

    date.setTime(date.getTime() + hoursAfterUTC*60*60*1000);

    // Get the date in MM/DD/YYYY format
    const month = monthOfYear[date.getMonth()];
    const day = date.getDate().toString().padStart(2, "0");

    return `${day} ${month}`;
}

let backendURL = "http://localhost:8080";