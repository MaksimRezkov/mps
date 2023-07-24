const openFormBtnList = document.querySelectorAll('.open-form-btn__wrapp');
console.log(openFormBtnList);

if (openFormBtnList?.length) {
  for (let i = 0 ; i < openFormBtnList?.length; i++) {
    const openFormBtn = openFormBtnList[i];
    openFormBtn.addEventListener('click', (event) => {
      console.log(event.currentTarget);
    });
  }
}
