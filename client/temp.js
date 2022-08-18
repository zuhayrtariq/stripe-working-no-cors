function checkCustomRadio() {
    const customRadio = document.querySelector('#customAmountRadio');
    const customAmountInput = document.querySelector('#customAmountInput');
    if (customRadio.checked) {

        customAmountInput.required = true;
    } else {

        customAmountInput.required = false;
    }
};