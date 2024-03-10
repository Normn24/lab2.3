const btnMakeForm = document.querySelector('.header__btn-make-visit');
const form = document.querySelector('.header__form');

const createModal = document.getElementById("createModal");
const inputCreateName = document.querySelector("#create__inputName")
const purpose = document.querySelector('#create__inputPurpose')
const age = document.querySelector('#create__inputAge')
const pulse = document.querySelector('#create__inputPressure')
const massIndex = document.querySelector('#create__inputBMI')
const description = document.querySelector('#create__inputDescription')
const pastDiseases = document.querySelector('#create__inputDisease')
const lastVisit = document.querySelector('#create__inputLastVisit')
const comment = document.querySelector('#create__inputComment')
const error = document.querySelector('.form__error')
const btnCloseForm = document.querySelector('.form__button-close-form')
const selectMenuDoctors = document.querySelector('.form__selector-doctors')
const selectPriorityContainer = document.querySelector("#create__selectPriority")

const btnCreateVisit = document.querySelector('.form__button-create-visit')
let elementsForm = document.querySelectorAll('.form input, .form select')
let formData = []
class Module {
    constructor() {

    }

    clearModal() {
        form.style.display = `none`;
        createModal.style.display = 'none';
        elementsForm.forEach((element) => {
            element.value = '';
        })
        purpose.style.display = 'none';
        description.style.display = 'none';
        inputCreateName.style.display = "none";
        selectPriorityContainer.style.display = 'none';
        btnCreateVisit.style.display = 'none';
        comment.style.display = 'none';
        pastDiseases.style.display = 'none';
        massIndex.style.display = 'none';
        pulse.style.display = 'none';
        age.style.display = 'none';
        lastVisit.style.display = 'none';
        error.style.display = 'none';
    }

    closeForm() {
        btnCloseForm.addEventListener('click', (event) => {
            event.preventDefault();
            this.clearModal();
        })

        document.addEventListener('click', (event) => {
            if (event.target === createModal) {
                this.clearModal();
            }
        })
    }

    sendInfo() {
        btnCreateVisit.addEventListener('click', async (event) => {
            event.preventDefault();
            const fields = Array.from(document.querySelectorAll('.form div')).filter((divElement) => {
                return window.getComputedStyle(divElement).display !== 'none' && divElement.id !== 'create__inputComment'
            }).some((divElement) => {
                const elements = Array.from(divElement.querySelectorAll('input, select'))
                return elements.some((inputElement) => inputElement.value === '')

            });

            if (fields) {
                error.style.display = 'block';
                return;
            } if (age.style.display !== 'none') {

                if (parseFloat(document.querySelector('#createAge').value) >= 150 || parseFloat(document.querySelector('#createAge').value) <= 0) {
                    error.textContent = 'Incorrect value! Enter your real age';
                    error.style.display = 'block';
                    return;
                }
            }
            if (pulse.style.display !== 'none') {
                const pressureValue = parseFloat(document.querySelector('#createPressure').value);
                if (isNaN(pressureValue) || pressureValue >= 170 || pressureValue <= 50) {
                    error.textContent = 'Incorrect value! Enter your real pulse';
                    error.style.display = 'block';
                    return;
                }
            }
            if (massIndex.style.display !== 'none') {
                const massValue = parseFloat(document.querySelector('#createBMI').value);
                if (isNaN(massValue) || massValue >= 700 || massValue <= 0) {
                    error.textContent = 'Incorrect value! Enter your real mass index';
                    error.style.display = 'block';
                    return;
                }
            }
            const createNameValue = document.querySelector('#createName').value;
            if (!isNaN(parseFloat(createNameValue))) {
                error.textContent = 'Incorrect value! Enter your real name';
                error.style.display = 'block';
                return;
            }
            if (lastVisit.style.display !== 'none') {
                const minimalVisit = new Date('1950-01-01')
                const maxVisit = new Date()
                const lastVisitValue = document.querySelector('#createLastVisitDate')
                const convertValue = new Date(lastVisitValue.value)
                if (convertValue <= minimalVisit || convertValue >= maxVisit) {
                    error.textContent = 'Incorrect value! Enter correct data';
                    error.style.display = 'block';
                    return;
                }
            }

            const data = new CreateVisit()

            this.clearModal()

            try {
                await sendInfo(data);
                await fetchAndDisplayCards()
            } catch (error) {
                console.error('Error sending data:', error)
            }
        })
    }
}

class Visit {
    constructor() {
        this.dontAddElements = true
    }

    makeOptions() {
        if (selectMenuDoctors && this.dontAddElements === true) {
            this.dontAddElements = false

            const changeHandler = () => {
                purpose.style.display = 'block'
                description.style.display = 'block'
                inputCreateName.style.display = "block";
                selectPriorityContainer.style.display = 'flex';
                btnCreateVisit.style.display = 'block'
                comment.style.display = 'block'
            };
            selectMenuDoctors.addEventListener('change', changeHandler)
        }
    }
}

class VisitDentist extends Visit {
    constructor() {
        super();
    }
    doctorNotes() {
        if (selectMenuDoctors) {
            selectMenuDoctors.addEventListener('change', () => {
                if (selectMenuDoctors.value === 'Dentist') {
                    lastVisit.style.display = 'block'
                } else {
                    lastVisit.style.display = 'none'
                }
            })
        }
    }
}
class VisitTherapist extends Visit {
    constructor() {
        super();
    }

    doctorNotes() {
        if (selectMenuDoctors) {
            selectMenuDoctors.addEventListener('change', () => {
                if (selectMenuDoctors.value === 'Cardiologist' || selectMenuDoctors.value === "Therapist") {
                    age.style.display = 'block';
                } else {
                    age.style.display = 'none';
                }
            });
        }
    }
}
class VisitCardiologist extends Visit {
    constructor() {
        super();
    }

    doctorNotes() {
        if (selectMenuDoctors) {
            selectMenuDoctors.addEventListener('change', () => {
                if (selectMenuDoctors.value === "Cardiologist") {
                    pulse.style.display = 'block';
                    massIndex.style.display = 'block';
                    pastDiseases.style.display = 'block';

                } else {
                    pastDiseases.style.display = 'none';
                    massIndex.style.display = 'none';
                    pulse.style.display = 'none';
                }
            });
        }
    }
}

function openModalWindow() {
    createModal.style.display = "block";
    form.style.display = `flex`;
}

const module = new Module();

const visit = new Visit();
visit.makeOptions();
const visitDentist = new VisitDentist();
visitDentist.doctorNotes();

const visitTherapist = new VisitTherapist();
visitTherapist.doctorNotes();
const visitCardiologist = new VisitCardiologist();
visitCardiologist.doctorNotes();
module.sendInfo();
module.closeForm();



class CreateVisit {
    constructor() {
        this.doctor = form.querySelector('.form__selector-doctors').value
        this.name = form.querySelector('.form__patient-name').value
        this.priority = form.querySelector('.form__selector-urgency').value
        this.purpose = form.querySelector('.form__purpose').value
        this.description = form.querySelector('.form__description').value
        this.lastVisit = form.querySelector('.form__last-visit').value
        this.age = form.querySelector('.form__age').value
        this.pulse = form.querySelector('.form__pulse').value
        this.massIndex = form.querySelector('.form__mass-index').value
        this.pastDiseases = form.querySelector('.form__past-diseases').value
        this.comment = form.querySelector('.form__comment').value
        this.status = "active"
    }
}


async function sendInfo(data) {
    const token = sessionStorage.getItem('token');
    try {
        const user = usersData.find(user => user.token === token);
        if (user) {
            const newCard = {
                id: Math.floor(Math.random() * 10000),
                ...data
            };
            user.cards.push(newCard);
            return newCard;
        } else {
            throw new Error('User not found!');
        }
    } catch (error) {
        console.error('Error sending data:', error);
        throw new Error(error);
    }
}
