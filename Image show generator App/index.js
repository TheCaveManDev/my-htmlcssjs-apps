const genBtn = document.querySelector('.gen-btn');
const section = document.querySelector('.main');
const dlBtns = document.querySelectorAll('.dl-btn');
const cardTitles = document.querySelectorAll('.card-title');
const cardDescs = document.querySelectorAll('.card-desc');
const cardURLbtns = document.querySelectorAll('.card-url');
const msgBox = document.querySelector('.msg-box');
const srchBtn = document.querySelector('.srch-btn');
const srchInput = document.querySelector('.search-input');
const srchBox = document.querySelector('.search-box');
const notFound = document.querySelector('.not-found');
const hoveringButtons = document.querySelector('.hovering-btns');
const upButton = document.querySelector('.up-btn');
const downButton = document.querySelector('.down-btn');

const cards = document.querySelectorAll('.card-content');
cards.forEach(card => {
    card.onclick = () => {
        cards.forEach(card => {
            card.classList.remove('clicked');
        });
        card.classList.add('clicked');
    };
});
let moved = false;

genBtn.onclick = () => {

    setTimeout(scrollDown, 500);

    srchBtn.onclick = search;


    if (!moved) {
        srchBox.style.display = 'block';
        srchBox.style.animation = 'fadeInLeft .3s ease forwards'
        hoveringButtons.style.animation = 'fadeInRight .3s ease forwards';
        moved = true;
    }


    msgBox.style.transition = '.5s';
    msgBox.style.right = '0%';
    setTimeout(() => {
        msgBox.style.right = '-150%';
    }, 5000);
    for (let i = 0; i < 50; i++) {
        let cardId = Math.round(Math.random() * 1000);
        let card = document.createElement('div');
        let cardURL = `https://picsum.photos/id/${cardId}/1000/800`;
        card.className = 'card';
        card.innerHTML = `
            <div class="img-div">
                <button class="dl-btn" onclick="openImg()">Download</button>
                <img src="${cardURL}" alt="">
            </div>
            <div class="card-content">
                <h1 class="card-title"><i class="fa fa-image"></i> Image ID: ${cardId}</h1>
                <p class="card-desc"><i class="fa fa-link"></i> URL: <a class="card-url" onclick="copyURL()"></a>${cardURL}</p>
            </div>
            `;
        section.appendChild(card);
    };
};
function openImg(event) {
    const targetButton = event.target;
    const img = targetButton.parentElement.querySelector('img');
    const HDImg = img.src.replace('1000', '1920').replace('800', '1080');

    const link = document.createElement('a');

    link.href = HDImg;
    link.download = `image_${Date.now()}.jpg`; // optional: generate a name
    document.body.appendChild(link); // necessary for Firefox
    link.click();
    document.body.removeChild(link); // clean up

    targetButton.innerHTML = `Downloaded <i class="fa fa-check"></i>`;
    setTimeout(() => {
        targetButton.innerHTML = 'Download';
    }, 1000);
}


function copyURL() {
    let targetURL = event.target.textContent;
    navigator.clipboard.writeText(targetURL);
}

function search() {

    const searchQuery = srchInput.value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        let cardTitleText = card.childNodes.item(3).childNodes.item(1).textContent;
        if (cardTitleText.includes(searchQuery)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    })
};

srchInput.onkeyup = search;

upButton.onclick = scrollUp;
downButton.onclick = scrollDown;

function scrollUp() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};
function scrollDown() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
};
