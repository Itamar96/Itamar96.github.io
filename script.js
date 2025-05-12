// Toggle mobile menu
document.getElementById('mobile-menu').addEventListener('click', function () {
    var navList = document.querySelector('.nav-list');
    navList.style.display = navList.style.display === 'flex' ? 'none' : 'flex';
});

// Required: Show current day & time
const now = new Date();
console.log("Current Date and Time:", now.toLocaleString());

// Required: Alert on load
alert("Welcome to Tranquil Touch Booking Page!");

// Required: Math method
const randomTip = Math.floor(Math.random() * 20);
console.log("Suggested tip amount: $" + randomTip);

// Required: setTimeout
setTimeout(() => {
    console.log("5 seconds passed!");
}, 5000);

// Required: Convert string to number
const strValue = "2025";
const numValue = Number(strValue);
console.log("Converted value:", numValue + 1);

// Required: Countdown function
let countdown = 5;
const timer = setInterval(() => {
    console.log("Countdown:", countdown);
    countdown--;
    if (countdown < 0) clearInterval(timer);
}, 1000);
