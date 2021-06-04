let authToken

const loginModal = document.querySelector('#loginWrapper')
const loginMessage = document.querySelector('#loginMessage')
const fetchedList = document.querySelector('#fetched ol')
const actionsList = document.querySelector('#actions ol')

const autoFetchbtn = document.querySelectorAll('#fetchControls button')[0]
const manualFetchbtn = document.querySelectorAll('#fetchControls button')[1]
const deleteAllButton = document.getElementById('deleteAllBtn')

let autoFetchId = null
let actionsEmpty = true

let comments = []
let countCurrent = 1

const eraseEverything = async () => {
  if (comments.length === 0) {
    console.log(`There's no comments to erase`);
  } else {
    console.log(`Initiating wiping of the database`);
    if(actionsEmpty) {
      actionsList.innerHTML = ''
      actionsEmpty = false
    }
    for (let i = 0; i < comments.length; i++) { 
      await fetch(
        `https://striveschool-api.herokuapp.com/api/comments/${comments[i]._id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": authToken,
          },
        }
      );
      const li = document.createElement('li')

      li.innerHTML = `
        <button class="btn fetchedBtns d-flex" type="button" data-bs-toggle="collapse" data-bs-target="#action${countCurrent}" aria-expanded="false" aria-controls="action${countCurrent}">
          <div class="me-auto"><strong>Operation №${countCurrent}:</strong> The comment with ID: ${comments[i]._id} has been deleted</div>
          <div>
            <span class="moreInfo">More Info</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>
          </div>
        </button>
        <div class="collapse" id="action${countCurrent}">
          <div class="card card-body">
            <div class="d-flex">
              <p class="me-auto">Rate: ${comments[i].rate}</p>
              <p>Author: ${comments[i].author}</p>
            </div>
            <p>Comment: ${comments[i].comment}</p>
          </div>
        </div>
      `

      countCurrent ++


      actionsList.innerHTML += li.innerHTML
    }
    console.log(`There's no comments left`);
  }
  fetchData()
};

const renderFetched = () => {
  if(comments.length != 0) {
    const fetchedComments = comments.map((comm, i) => {
      return `
        <button class="btn fetchedBtns d-flex" type="button" data-bs-toggle="collapse" data-bs-target="#book${i}" aria-expanded="false" aria-controls="book${i}">
          <div class="me-auto"><strong>${i}.</strong> Comment with id ${comm._id}</div>
          <div>
            <span class="moreInfo">More Info</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>
          </div>
        </button>
        <div class="collapse" id="book${i}">
          <div class="card card-body">
            <div class="d-flex">
              <p class="me-auto">Rate: ${comm.rate}</p>
              <p>Author: ${comm.author}</p>
            </div>
            <p>Comment: ${comm.comment}</p>
          </div>
        </div>
      `
    }).join('')
    fetchedList.innerHTML = fetchedComments
    deleteAllButton.classList = "btn btn-danger w-100"
  } else {
    fetchedList.innerHTML = "<h3>No Comments Exist</h3>"
    deleteAllButton.classList = "btn btn-danger w-100 disabled"
  }
}

const fetchData = async () => {
  try {
    const response = await fetch(`https://striveschool-api.herokuapp.com/api/comments/`, {
        method: "GET",
        headers: {
          "Authorization": authToken,
          "Content-type": "application/json",
        }
      }
    )
    if(await response.ok) {
      const data = await response.json()
      comments = data
      renderFetched()
    } else {
      console.log('fetch error')
    }
  } catch (error) {
    console.log(error)
  }
}

const login = async (e) => {
  e.preventDefault()
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  const response = await fetch(`https://striveschool-api.herokuapp.com/api/account/login?username=${email}&password=${password}`, { method: "POST" })
  if(response.ok) {
    const data = await response.json()
    localStorage.setItem('token', data.access_token)
    authToken = "Bearer " + localStorage.getItem('token')

    loginMessage.innerText = 'Succesfully logged in!'
    loginMessage.style.color = 'green'
    loginModal.style.animation = 'fadeOut 2s ease-in infinite'
    setTimeout(() => {
      loginModal.style.display = 'none'
    }, 2000)
  } else {
    loginMessage.innerText = 'Invalid Email/Password, try again.'
    loginMessage.style.color = 'red'
  }
}

const autoFetch = () => {
  if(autoFetchId) {
    clearInterval(autoFetchId)
    autoFetchId = null

    autoFetchbtn.innerText = "Auto-Fetch Off"
    autoFetchbtn.classList = "btn btn-danger w-100"
  } else {
    fetchData()
    autoFetchId = setInterval(() => fetchData(), 3000)

    autoFetchbtn.innerText = "Auto-Fetch On"
    autoFetchbtn.classList = "btn btn-success w-100"
  }
}

window.onload = () => {
  if(!localStorage.getItem('token')) {
    loginModal.style.display = 'block'
  } else {
    authToken = "Bearer " + localStorage.getItem('token')
  }

  document.getElementsByTagName('form')[0].addEventListener('submit', (e) => login(e))

  autoFetchbtn.addEventListener('click', autoFetch)
  manualFetchbtn.addEventListener('click', fetchData)
  deleteAllButton.addEventListener('click', eraseEverything)
}