const bits = document.querySelectorAll(".bit");
const result = document.querySelector(".result");
const binary = document.querySelector(".binary");

let powerSum = 0;

function updateBitText(bit) {
    const value = bit.getAttribute("data-power");
    const state = bit.classList.contains("active") ? "1" : "0";
    bit.textContent = `${state} | ${value}`;
}

function updateText() {
    result.textContent = powerSum;
    binary.textContent = Array.from(bits)
        .map(bit => bit.classList.contains("active") ? "1" : "0")
        .join('');
}

bits.forEach(bit => {
    updateBitText(bit);
    bit.onclick = () => {
        const value = parseInt(bit.getAttribute("data-power"));
        powerSum += bit.classList.contains("active") ? -value : value;
        bit.classList.toggle("active");
        updateBitText(bit);
        updateText();
    };
});
