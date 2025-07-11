const options = document.querySelectorAll('.option');
const circleContainer = document.querySelector('.container-circle');

options.forEach(option=>{
    option.onclick = ()=>{
        const optionName = option.querySelector('.option-name');
        const optionContainer = option.parentNode;
        options.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        const rotation = window.getComputedStyle(optionContainer).getPropertyValue('rotate');
        circleContainer.style.rotate = `-${rotation}`;
    };
});
