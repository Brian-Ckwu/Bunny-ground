// Test for connection
console.log('Connected!');

// Selection
const favoriteAddButtons = document.querySelectorAll('.favorite-add-btn > button');
const favoriteRemoveButtons = document.querySelectorAll('.favorite-remove-btn > button');
const myModalAdd = document.querySelector('#my-modal-add');
const myModalRemove = document.querySelector('#my-modal-remove');
// const closeButton = document.querySelector('.close-button');

// EventListeners
$('#leave-comment').click(() => {
  $('.comment-form').slideToggle();
})

favoriteAddButtons.forEach((addButton, index) => {
  addButton.addEventListener('click', function() {
    this.parentElement.style.display = 'none';
    favoriteRemoveButtons[index].parentElement.style.display = 'inline';
    toggleMyModal(myModalAdd, 700);
  })
})

favoriteRemoveButtons.forEach((removeButton, index) => {
  removeButton.addEventListener('click', function() {
    this.parentElement.style.display = 'none';
    favoriteAddButtons[index].parentElement.style.display = 'inline';
    toggleMyModal(myModalRemove, 700);
  })
})

// closeButton.addEventListener('click', toggleMyModal);

// Functions
function toggleMyModal(modal, time) {
  modal.classList.toggle('show-my-modal');
  setTimeout(() => {
    modal.classList.toggle('show-my-modal');
  }, time)
}