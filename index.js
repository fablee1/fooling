const loginModal = document.querySelector('#loginWrapper')
const loginMessage = document.querySelector('#loginMessage')
const outputList = document.querySelector('#outputs ol')

const eraseEverything = async () => {

  const authToken = "Bearer " + localStorage.getItem('token')

  const array = await fetch(
    `https://striveschool-api.herokuapp.com/api/comments/`,
    {
      method: "GET",
      headers: {
        "Authorization": authToken,
        "Content-type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then(async (data) => {
      if (data.length === 0) {
        console.log(`There's no comments to erase`);
      } else {
        console.log(`Initiating wiping of the database`);
        outputList.innerHTML = ''
        for (let i = 0; i < data.length; i++) {
          await fetch(
            `https://striveschool-api.herokuapp.com/api/comments/${data[i]._id}`,
            {
              method: "DELETE",
              headers: {
                "Authorization": authToken,
              },
            }
          );
          const li = document.createElement('li')
          li.innerText = `Operation №${i}: The comment with ID: ${data[i]._id} has been deleted`
          outputList.appendChild(li)
        }
        console.log(`There's no comments left`);
      }
    });
};

const login = async (e) => {
  e.preventDefault()
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  const response = await fetch(`https://striveschool-api.herokuapp.com/api/account/login?username=${email}&password=${password}`, { method: "POST" })
  if(await response.ok) {
    const data = await response.json()
    // localStorage.setItem('token', data.access_token)

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

window.onload = () => {
  if(!localStorage.getItem('token')) {
    loginModal.style.display = 'block'
  }

  setInterval(() => console.log('ok'), 1000)

  document.getElementsByTagName('form')[0].addEventListener('submit', (e) => login(e))
}