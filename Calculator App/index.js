const inputButtons = document.querySelectorAll('.input-button');

const inputField = document.querySelector('.input-field');

const evalButton = document.querySelector('.eval-button');

const clearButton = document.querySelector('.clear-button');
const deleteButton = document.querySelector('.delete-button');

inputButtons.forEach((inputButton)=>{
    inputButton.onclick = ()=>{
        inputField.value += inputButton.innerText;
    }
})

evalButton.onclick = ()=>{
    if (!inputField.value == ''){
        try {
            inputField.value = eval(inputField.value);
        } catch (SyntaxError) {
            let erroredValue = inputField.value;
            inputField.value = 'SyntaxError';
            setTimeout(()=>{
                inputField.value = erroredValue;
            }, 500)
        }  
    }
}

clearButton.onclick = ()=>{
    inputField.value = '';
}

deleteButton.onclick = ()=>{
    inputField.value = inputField.value.replace(`${inputField.value[inputField.value.length - 1]}`, '');
}
