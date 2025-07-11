const switchBodyCircle = document.querySelector('.circle');
const switchBody = document.querySelector('.switch');

const label = document.querySelector('.label');
const themeLabel = document.querySelector('.theme');
const icon = document.querySelector('#icon');

const iconContainer = document.querySelector('.icon-container');

let clicked = false;

switchBodyCircle.onclick = ()=>{
    if (!clicked) {
        icon.style.opacity = '0';
        setTimeout(()=>{
            icon.style.opacity = '1';
        }, 150);
        // Activate Dark Mode
        iconContainer.style.right = '50%';
        icon.style.color = 'var(--dark-color)';
        icon.className = 'fa fa-sun';
        document.body.style.backgroundColor = 'var(--dark-color)';
        switchBody.style.backgroundColor = 'var(--light-color)';
        clicked = !clicked;
        switchBodyCircle.style.right = '0%';
        switchBodyCircle.style.backgroundColor = 'var(--dark-color)';
        themeLabel.textContent = 'Dark Mode';
        label.style.color = 'var(--light-color)';
        themeLabel.style.color = 'var(--light-color)';
    }
    else {
        icon.style.opacity = '0';
        setTimeout(()=>{
            icon.style.opacity = '1';
        }, 150);
        iconContainer.style.right = '0%';
        // Active Light Mode
        icon.style.color = 'var(--light-color)';
        icon.className = 'fa fa-moon';
        document.body.style.backgroundColor = 'whitesmoke';
        switchBody.style.backgroundColor = 'var(--dark-color)';
        clicked = !clicked;
        switchBodyCircle.style.right = '50%';
        switchBodyCircle.style.backgroundColor = 'var(--light-color)';
        themeLabel.textContent = 'Light Mode';
        label.style.color = 'black';
        themeLabel.style.color = 'black';
    }
}
