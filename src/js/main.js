
const usersData = [
  {
    email: '123',
    password: '1234',
    cards: [
      { id: 1, name: 'wadwa', doctor: 'Cardiologist', description: 'Description 1', status: 'active', priority: 'medium', age: 23, pulse: 87, massIndex: 67, pastDiseases: "none" },
      { id: 2, name: 'awd', doctor: 'Dentist', description: 'Description 2', status: 'active', priority: 'high', lastVisit: "24.02.2012" }
    ]
  },
  {
    email: 'user2example',
    password: 'password2',
    cards: [
      { id: 3, name: 'awdawd', doctor: 'Therapist', description: 'Description 3', status: 'active', priority: 'high', age: 34 },
      { id: 4, name: 'Card 4', doctor: 'Cardiologist', description: 'Description 4', status: 'active', priority: 'medium', age: 23, pulse: 87, massIndex: 67, pastDiseases: "none" }
    ]
  }
];


async function getToken(email, password) {
  try {
    const user = usersData.find(user => user.email === email && user.password === password);
    if (user) {
      const token = Math.random().toString(36);
      user.token = token;
      return token;
    } else {
      throw new Error('User is not registered!');
    }
  } catch (error) {
    alert(error.message);
  }
}

async function showHide() {
  const enterBtn = document.querySelector('.login-button');
  const logoutBtn = document.querySelector('.logout-button');
  const createVisitBtn = document.querySelector('.create-visit-button');
  const filterPage = document.querySelector(".filter__section");
  const header = document.querySelector(".header");

  header.style.background = "none";
  header.style.height = "auto";
  filterPage.style.display = "block";
  enterBtn.classList.add('hidden');
  logoutBtn.classList.remove('hidden');
  createVisitBtn.classList.remove('hidden');
}

async function login() {
  const enterBtn = document.querySelector('.login-button');
  const logoutBtn = document.querySelector('.logout-button');

  if (!sessionStorage.getItem('token')) {
    enterBtn.addEventListener('click', showModal);
  } else {
    showHide();
    await fetchAndDisplayCards();
  }

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('token')
    window.location.reload()
  });

  async function showModal() {
    const modalForm = document.querySelector('#authorization-modal');
    modalForm.style.display = 'block';

    const emailForm = modalForm.querySelector('input[type="email"]');
    const passwordForm = modalForm.querySelector('input[type="password"]');
    const btnForm = modalForm.querySelector('.send-button');

    btnForm.addEventListener('click', handleSubmit);

    modalForm.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal') || e.target.classList.contains('btn-close')) {
        modalForm.style.display = 'none';
        emailForm.value = '';
        passwordForm.value = '';
      }
    });

    async function handleSubmit(e) {
      e.preventDefault();
      if (emailForm.value && passwordForm.value) {
        submitForm(modalForm, emailForm.value, passwordForm.value);
      } else {
        alert('Fill in all fields!');
      }
    }

  }

  async function submitForm(form, email, password) {
    const token = await getToken(email, password);

    if (token) {
      sessionStorage.token = token;
      showHide();
      form.style.display = 'none';
      trueToken = token;
      await fetchAndDisplayCards();
    }

    return token;
  }
}

async function fetchAndDisplayCards() {
  const token = sessionStorage.getItem('token');

  if (token) {
    try {
      const user = usersData.find(user => user.token === token);
      if (user) {
        const cards = user.cards;

        const taskBoard = document.querySelector("#taskBoard");
        taskBoard.innerHTML = "";

        cards.forEach(async (cardData) => {
          await displayCard(cardData);
        });
      } else {
        console.error("User not found!");
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  }
}
login();
async function displayCard(cardData) {
  const taskBoard = document.querySelector("#taskBoard");
  const cardContainer = document.createElement("div");

  cardContainer.className = "card";
  cardContainer.setAttribute("data-id", cardData.id);

  cardContainer.innerHTML = `
      <div class="card__text">
      <h4>Name:</h4> <p>${cardData.name}</p>
      <h4>Doctor:</h4> <p>${cardData.doctor}</p>
      <h4>Description:</h4> <p>${cardData.description}</p>
      </div>
      <div class="button__contianer">
      <button onclick="showMore(${cardData.id})">Show more</button>
      <button onclick="openEditModal(${cardData.id})">Edit</button>
      </div>
      <span class="delete-icon" onclick="deleteCard(${cardData.id})">&#10006;</span>
    `;

  taskBoard.appendChild(cardContainer);
}

async function deleteCard(cardId) {
  const confirmation = confirm("Are you sure, you want to delete?");
  const token = sessionStorage.getItem('token');

  if (confirmation && token) {
    try {
      const user = usersData.find(user => user.token === token);
      if (user) {
        const cardIndex = user.cards.findIndex(card => card.id === cardId);
        if (cardIndex !== -1) {
          user.cards.splice(cardIndex, 1);
          fetchAndDisplayCards();
        } else {
          console.error("Card not found!");
        }
      } else {
        console.error("User not found!");
      }
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  }
}

async function openEditModal(cardId) {
  const token = sessionStorage.getItem('token');
  const user = usersData.find(user => user.token === token);
  if (user) {
    const cardData = user.cards.find(card => card.id === cardId);
    if (cardData) {

      const optionActive = (value, option) => value === option ? "selected" : "";

      const editForm = document.createElement("div");
      editForm.className = "edit__form";
      editForm.innerHTML = `
    <div class="input-group">
      <input required="" type="text" name="text" autocomplete="off" class="input" id="editName" value="${cardData.name}">
      <label for="editName" class="user-label">Name</label>
    </div>
    <div class="select select__edit-container">
      <label for="editDoctor" class="select__label">Doctor</label>
      <select id="editDoctor" class="edit__select" onchange="handleDoctorChange()">
        <option value="Cardiologist" ${optionActive(cardData.doctor, "Cardiologist")}>Cardiologist</option>
        <option value="Dentist"  ${optionActive(cardData.doctor, "Dentist")}>Dentist</option>
        <option value="Therapist"  ${optionActive(cardData.doctor, "Therapist")}>Therapist</option>
      </select>
    </div>
    <div class="input-group">
      <input required="" type="text" name="text" autocomplete="off" class="input" id="editDescription" value="${cardData.description}">
      <label for="editDescription" class="user-label">Description</label>
    </div>
    
  <div class="select select__edit-container">
  <label for="editStatus" class="select__label">Status</label>
    <select id="editStatus" class="edit__select">
      <option value="" disabled selected>Select status</option>
      <option value="active" ${optionActive(cardData.status, "active")}>Active</option>
      <option value="completed" ${optionActive(cardData.status, "completed")}>Completed</option>
    </select>
    </div>
    <div class="select select__edit-container">
    <label for="editPriority" class="select__label ">Priority</label>
    <select id="editPriority" class="edit__select">
      <option value="" disabled selected>Select priority</option>
      <option value="low" ${optionActive(cardData.priority, "low")}>Low</option>
      <option value="medium" ${optionActive(cardData.priority, "medium")}>Medium</option>
      <option value = "high" ${optionActive(cardData.priority, "high")}> High</ >
    </select > 
    </div>
    <div class="input-group">
      <input required="" type="text" name="text" autocomplete="off" class="input" id="editComment" value="${cardData.comment}">
      <label for="editComment" class="user-label">Comment</label>
    </div>
    <div id="additionalFields"></div>
    <button onclick="saveChanges(${cardId})">Save</button>
  `;
      const editFormContainer = document.getElementById("editFormContainer");
      editFormContainer.innerHTML = "";
      editFormContainer.appendChild(editForm);

      const editModal = document.getElementById("editModal");
      editModal.style.display = "block";
      handleDoctorChange(cardData);
    } else {
      console.error("Card not found!");
    }
  } else {
    console.error("User not found!");
  }

}

function handleDoctorChange() {
  const selectedDoctor = document.getElementById("editDoctor").value;
  const additionalFieldsContainer = document.getElementById("additionalFields");

  additionalFieldsContainer.innerHTML = "";

  if (selectedDoctor === 'Cardiologist') {
    additionalFieldsContainer.innerHTML = `
      <div class="input-group">
        <input required=""  name="text" autocomplete="off" class="input" type="number" id="editAge">
        <label for="editAge" class="user-label">Age</label>
      </div>
      <div class="input-group">
        <input required=""  name="text" autocomplete="off" class="input" type="number" id="editPressure">
        <label for="editPressure" class="user-label">Normal pressure</label>
      </div>
      <div class="input-group">
        <input required=""  name="text" autocomplete="off" class="input" type="number" id="editBMI">
        <label for="editBMI" class="user-label">Body mass index</label>
      </div>
      <div class="input-group">
        <input required=""  name="text" autocomplete="off" class="input" type="text" id="editHeartDisease">
        <label for="editHeartDisease" class="user-label">Past diseases</label>
      </div>
    `;
  } else if (selectedDoctor === 'Dentist') {
    additionalFieldsContainer.innerHTML = `
    <div class="input-group">
    <label for="editLastVisitDate" class="select__label">Date of the last visit</label>
      <input required="" name="text" autocomplete="off" class="input edit__date" type="date" id="editLastVisitDate">
    </div>
    `;
  } else if (selectedDoctor === 'Therapist') {
    additionalFieldsContainer.innerHTML = `
    <div class="input-group">
      <input required=""  name="text" autocomplete="off" class="input" type="number" id="editAge">
      <label for="editAge" class="user-label">Age</label>
    </div>
    `;
  }
}

function closeModal() {
  const editModal = document.getElementById("editModal");
  editModal.style.display = "none";
  const editForm = document.querySelector(".edit__form");
  editForm.innerHTML = "";
}

async function saveChanges(cardId) {
  const token = sessionStorage.getItem('token');
  const editForm = document.querySelector(".edit__form")
  const cardContainer = document.querySelector(`.card[data-id= "${cardId}"]`);
  const newName = editForm.querySelector("#editName").value;
  const newDoctor = editForm.querySelector("#editDoctor").value;
  const newDescription = editForm.querySelector("#editDescription").value;
  const newStatus = editForm.querySelector("#editStatus").value;
  const newPriority = editForm.querySelector("#editPriority").value;
  const newComment = editForm.querySelector("#editComment").value;


  const user = usersData.find(user => user.token === token);
  if (user) {
    const cardData = user.cards.find(card => card.id === cardId);

    if (cardData) {

      cardData.name = newName;
      cardData.doctor = newDoctor;
      cardData.description = newDescription;
      cardData.status = newStatus;
      cardData.priority = newPriority;
      cardData.comment = newComment;


      if (newDoctor === "Cardiologist") {
        const newAge = editForm.querySelector("#editAge").value;
        const newPressure = editForm.querySelector("#editPressure").value;
        const newBMi = editForm.querySelector("#editBMI").value;
        const newDesease = editForm.querySelector("#editHeartDisease").value;
        cardData.age = newAge;
        cardData.pulse = newPressure;
        cardData.massIndex = newBMi;
        cardData.pastDiseases = newDesease;
      } else if (newDoctor === "Dentist") {
        const newDate = editForm.querySelector("#editLastVisitDate").value;
        cardData.lastVisit = newDate;
      } else if (newDoctor === "Therapist") {
        const newAge = editForm.querySelector("#editAge").value;
        cardData.age = newAge;
      }

      cardContainer.innerHTML = `
        <div class="card__text">
        <h4>Name:</h4> <p>${newName}</p>
        <h4>Doctor:</h4> <p>${newDoctor}</p>
        <h4>Description:</h4> <p>${newDescription}</p>
        </div>
        <div class="button__contianer">
        <button onclick="showMore(${cardId})">Show more</button>
        <button onclick="openEditModal(${cardId})">Edit</button>
        </div>
        <span class="delete-icon" onclick="deleteCard(${cardId})">&#10006;</span>
            `;

      closeModal();
    } else {
      console.error("Card not found!");
    }
  } else {
    console.error("User not found!");
  }
}

async function showMore(cardId) {
  const token = sessionStorage.getItem('token');
  const user = usersData.find(user => user.token === token);
  if (user) {
    const cardData = user.cards.find(card => card.id === cardId);
    if (cardData) {

      const detailsContainer = document.getElementById("detailsContainer");
      const detailsContent = document.createElement("div");

      detailsContent.className = "details__content";
      const baseInfo = `
    <h4>Name: <span>${cardData.name}</span></h4>
    <h4>Doctor: <span>${cardData.doctor}</span></h4>
    <h4>Description: <span>${cardData.description}</span></h4>
    <h4>Priority: <span>${cardData.priority}</span></h4>
    <h4>Status: <span>${cardData.status}</span></h4>
    <h4>Comment for doctor: <span>${cardData.comment}</span></h4>
  `;

      if (cardData.doctor === 'Cardiologist') {
        detailsContent.innerHTML = `
    ${baseInfo}
      <h4>Age: <span>${cardData.age}</span></h4>
      <h4>Normalpressure: <span>${cardData.pulse}</span></h4>
      <h4>Body mass index: <span>${cardData.massIndex}</span></h4>
      <h4>Past diseases: <span>${cardData.pastDiseases}</span></h4>
    `;
      } else if (cardData.doctor === 'Dentist') {
        detailsContent.innerHTML = `
    ${baseInfo}
      <h4>Date of the last visit: <span>${cardData.lastVisit}</span></h4>
    `;
      } else if (cardData.doctor === 'Therapist') {
        detailsContent.innerHTML = `
    ${baseInfo}
    <h4>Age: <span>${cardData.age}</span></h4>
    `;
      }

      detailsContainer.innerHTML = "";
      detailsContainer.appendChild(detailsContent);

      const detailsModal = document.getElementById("detailsModal");
      detailsModal.style.display = "block";

    } else {
      console.error("Card not found!");
    }
  } else {
    console.error("User not found!");
  }
}

function closeShowMore() {
  const detailsModal = document.getElementById("detailsModal");
  detailsModal.style.display = "none";
}

async function filterCards() {
  const token = sessionStorage.getItem('token');
  const searchInput = document.getElementById("searchInput").value.toLowerCase();
  const doctorFilter = document.getElementById("doctorFilter").value;
  const statusFilter = document.getElementById("statusFilter").value;
  const priorityFilter = document.getElementById("priorityFilter").value;

  const user = usersData.find(user => user.token === token);
  const cards = user.cards;
  if (user) {

    cards.forEach(card => {
      const cardToRemove = document.querySelector(`.card[data-id="${card.id}"]`);
      const nameElement = card.name;
      const doctorElement = card.doctor;
      const statusElement = card.status;
      const priorityElement = card.priority;

      const name = nameElement ? nameElement.toLowerCase() : "";
      const doctor = doctorElement ? doctorElement : "";
      const status = statusElement ? statusElement.toLowerCase() : "";
      const priority = priorityElement ? priorityElement.toLowerCase() : "";

      const nameMatch = name.includes(searchInput);
      const doctorMatch = (doctorFilter === '' || doctor === doctorFilter);
      const statusMatch = (statusFilter === '' || status === statusFilter);
      const priorityMatch = (priorityFilter === '' || priority === priorityFilter);

      if (nameMatch && statusMatch && priorityMatch && doctorMatch) {
        cardToRemove.style.display = "";
      } else {
        cardToRemove.style.display = "none";
      }
    });
  } else {
    console.error("User not found!");
  }
}










