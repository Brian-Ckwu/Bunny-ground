// Test for connection
console.log('Connected!');

// Selection
const favoriteAddButtons = document.querySelectorAll('.favorite-add-btn > button');
const favoriteRemoveButtons = document.querySelectorAll('.favorite-remove-btn > button');

// EventListeners
$('#leave-comment').click(() => {
  $('.comment-form').slideToggle();
})

favoriteAddButtons.forEach((addButton, index) => {
  addButton.addEventListener('click', function() {
    this.parentElement.style.display = 'none';
    favoriteRemoveButtons[index].parentElement.style.display = 'inline';
  })
})

favoriteRemoveButtons.forEach((removeButton, index) => {
  removeButton.addEventListener('click', function() {
    this.parentElement.style.display = 'none';
    favoriteAddButtons[index].parentElement.style.display = 'inline';
  })
})