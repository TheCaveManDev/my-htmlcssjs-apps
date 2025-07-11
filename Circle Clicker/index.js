const cookie = document.querySelector('.cookie');
const pointsLabel = document.querySelector('.points');
const resetButton = document.querySelector('.button');

let clicks = 0;

cookie.onclick = ()=>{
    clicks += 1;
    pointsLabel.textContent = clicks;
}

resetButton.onclick = ()=>{
    clicks = 0;
    pointsLabel.textContent = clicks;
}