// Global variables
const gallery = document.querySelector('.gallery');
const search = document.querySelector('.search-container');
const body = document.querySelector('body');
const modal = document.createElement('div');
let title = document.querySelector('h1')
modal.className = 'modal-container';   


// Get 12 random employees from API
fetch('https://randomuser.me/api?results=12&nat=ca')
  .then(res => res.json())
  .then(data => {
    generateGallery(data.results);
    displayModals(data.results);
    searchModal(data.results);
  });
 

// Show employee information 
const generateGallery = (data) => {
  data.forEach(data => {
    let html = `
      <div class="card">
        <div class="card-img-container">   
          <img class="card-img" src=${data.picture.large} alt="profile picture">
        </div>
        <div class="card-info-container">
          <h3 id="name" class="card-name cap">${data.name.first} ${data.name.last}</h3>
          <p class="card-text">${data.email}</p>
          <p class="card-text cap">${data.location.city}, ${data.location.state}</p>
        </div>
      </div>
    `;
    gallery.innerHTML += html;
  });
};


// Create model when employee is selected
const displayModals = (data) => {
  const card = document.querySelectorAll('.card')
  for (let i = 0; i < card.length; i++) {
    card[i].addEventListener('click', () => { createModal(data[i], i, data) });
  };
};

const createModal = (employee, modalNumber, data) => {
  modalCard(employee);
  toggleEmployee(modalNumber, data);
};


// Create and display modal card
const modalCard = (employee) => {
  modal.innerHTML = `
    <div class="modal">
      <button type="button" id="modal-close-btn" class="modal-close-btn">X</button>
      <div class="modal-info-container">
        <img class="modal-img" src='${employee.picture.large}' alt="profile picture">
        <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
        <p class="modal-text">${employee.email}</p>
        <p class="modal-text cap">${employee.location.city}</p>
        <hr>
        <p class="modal-text">${employee.cell}</p>
        <p class="modal-text">${formatEmployee(employee)}</p>
        <p class="modal-text">Birthday: ${employee.dob.date.slice(0,10)}</p>
      </div>
    </div>
    <div class="modal-btn-container">
      <button type="button" id="modal-prev" class="modal-prev btn">&#8249&#8249;</button>
      <button type="button" id="modal-next" class="modal-next btn">&#8250&#8250;</button>
    </div>
  `;
  body.appendChild(modal);
};


// Capitalize address
const formatEmployee = (employee) => {
  let newFormat = `${employee.location.street}, ${employee.location.city}, ${employee.location.state}`;
  newFormat = newFormat.split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
  return `${newFormat}, ${employee.location.postcode}`;
};


// Create buttons and functionality to toggle employee modals
const toggleEmployee = (modalNumber, data) => {
  const nextModal = document.getElementById('modal-next');
  const prevModal = document.getElementById('modal-prev');
  const lastModal = () => { if (modalNumber == 11) nextModal.remove() };
  const firstModal = () => { if (modalNumber == 0) prevModal.remove() };
  firstModal();
  lastModal();

  modal.addEventListener('click', (event) => {
    let closeModal = event.target.className;
    if (closeModal == 'modal-close-btn' || closeModal == 'modal-container') modal.remove();
  });
  
  prevModal.addEventListener('click', (e) => {
    if (modalNumber !== 0) createModal(data[modalNumber = modalNumber - 1], modalNumber, data); 
  });

  nextModal.addEventListener('click', (e) => {
    if (modalNumber !== 11) createModal(data[modalNumber = modalNumber + 1], modalNumber, data);
  }); 
};   

   
// Display search bar
search.innerHTML = `
  <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>
`;


// Search for employee by name 
const searchModal = (data) => {
  const card = document.querySelectorAll('.card');

  document.querySelector('#search-submit').addEventListener('click', () => {
    let counter = 0;
    let name = document.querySelector('.search-input').value;
    name = name.toLowerCase();
    document.querySelector('.search-input').value = '';

    for (let i = 0; i < data.length; i++) {
      if (card[i].innerText.includes(name)) {
        card[i].style.display = "flex";
        title.innerHTML = 'AWESOME STARTUP EMPLOYEE DIRECTORY';
      } else {
        card[i].style.display = "none";
        counter++;
      };
    };
    if (counter == 12) title.innerHTML = 'NO EMPLOYEE FOUND. TRY AGAIN OR CLICK SEARCH BUTTON TO GO BACK';
  });
};