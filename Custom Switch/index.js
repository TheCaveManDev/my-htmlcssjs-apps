const switchCircle = document.querySelector('.switch-circle');
const switchBody = document.querySelector('.switch-body');
const switchState = document.querySelector('.switch-state');
const switchText = document.querySelector('.switch-text');

switchBody.onclick = switchActivate;

function switchActivate () {
    switchBody.style.backgroundColor = 'lightgreen';
    switchCircle.style.translate = '127.5%';
    switchState.style.translate = `0%`;
    switchBody.onclick = switchDeActivate;
    switchText.style.animation = 'showText .4s ease forwards';
    setTimeout(() => {
        switchText.textContent = 'On';
    }, 200);
    setTimeout(()=>{
        switchState.textContent = 'On';
    }, 100);
};
function switchDeActivate () {
    switchBody.style.backgroundColor = 'grey';
    switchCircle.style.translate = '0%';
    switchState.style.translate = '100%';
    switchBody.onclick = switchActivate;
    switchText.style.animation = 'showText1 .4s ease forwards';
    setTimeout(() => {
        switchText.textContent = 'Off';
    }, 200);
    setTimeout(()=>{
        switchState.textContent = 'Off';
    }, 100);
};
