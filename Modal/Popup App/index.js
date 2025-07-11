const toggleButton = document.querySelector('.toggle-button');
const closeButton = document.querySelector('.close-button');
const backdrop = document.querySelector('.backdrop');
const popupContainer = document.querySelector('.popup-container');
const textArea = document.querySelector('.textarea');
const submitButton = document.querySelector('#submit');
const noSubmitButton = document.querySelector('#no-submit');

const message = document.querySelector('.message');

toggleButton.onclick = ()=>{
    popupContainer.style.display = 'block';
    backdrop.style.display = 'block';
    popupContainer.style.transform = 'translate(0%, -50%)';
    popupContainer.style.opacity = 0;
    setTimeout(()=>{
        popupContainer.style.opacity = 1;
        popupContainer.style.transform = 'translate(0%, 0%)';
    })
}

closeButton.onclick = ()=>{
    message.textContent = '';
    popupContainer.style.opacity = 0;
    popupContainer.style.transform = 'translate(0%, -50%)';
    setTimeout(()=>{
        popupContainer.style.transform = 'translate(0%, 0%)';
        popupContainer.style.display = 'none';
        backdrop.style.display = 'none';
    }, 200);
    textArea.value = '';
}

submitButton.onclick = ()=>{
    message.textContent = 'Okay! Submitting...';
}
noSubmitButton.onclick = ()=>{
    message.textContent = 'Okay! NOT submitting...';
}
