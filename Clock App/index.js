const hoursLabel = document.querySelector('.hours');
const minutesLabel = document.querySelector('.minutes');
const secondsLabel = document.querySelector('.seconds');

const timeType = document.querySelector('.time-type');

setInterval(()=>{
    let date = new Date();
    hoursLabel.textContent = date.getHours().toString().length < 2 ? `0${date.getHours()}` : date.getHours()
    minutesLabel.textContent = date.getMinutes().toString().length < 2 ? `0${date.getMinutes()}`: date.getMinutes();
    secondsLabel.textContent = date.getSeconds().toString().length < 2 ? `0${date.getSeconds()}`: date.getSeconds();
    
    if (hoursLabel.textContent >= 12) {
        timeType.textContent = 'PM';
    }
    else {
        timeType.textContent = 'AM';
    }

})
