const HOGS_URL = 'http://localhost:3000/hogs'
document.addEventListener('DOMContentLoaded', init)

function init(){
  getAllHogs()
  document.getElementById('hog-form').addEventListener('submit', makeHog)
}

function makeHog(event) {
  event.preventDefault()

  let name = event.target[0].value
  let specialty = event.target[1].value
  let medal = event.target[2].value
  let weight = event.target[3].value
  let image = event.target[4].value
  let greased = event.target[5].value

  fetch(`${HOGS_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify({
      'name': name,
      'specialty': specialty,
      'greased': greased,
      'weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refigerator with Thru-the-Door Ice and Water': weight,
      'highest medal achieved': medal,
      'image': image
    })
  })
  .then(response => response.json())
  .then(data => renderHog(data))
  document.getElementById('hog-form').reset()

  document.documentElement.scrollTop = document.documentElement.scrollHeight;
}

function getAllHogs() {
  fetch(`${HOGS_URL}`)
  .then(response => response.json())
  .then(hogsData => hogsData.forEach(hog => {
    renderHog(hog)
  }))
}

function renderHog(hogInfo) {
  let hogContainer = document.getElementById('hog-container')
  let hogDiv = document.createElement('div')
  hogDiv.id = `hog-card-${hogInfo.id}`
  hogDiv.className = 'hog-card'

  hogContainer.appendChild(hogDiv)

  let hogName = document.createElement('h3')
  hogName.innerText = hogInfo.name

  let hogImage = document.createElement('img')
  hogImage.src = hogInfo.image

  let hogSpecialty = document.createElement('p')
  hogSpecialty.innerText = `Specialty: ${hogInfo.specialty}`

  let hogMedal = document.createElement('p')
  hogMedal.innerText = `Medal: ${hogInfo['highest medal achieved']}`

  let hogWeight = document.createElement('p')
  hogWeight.innerText = `Weight: ${hogInfo['weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water']}`

  let greasedLabel = document.createElement('label')
  greasedLabel.setAttribute('for', 'greased')
  greasedLabel.innerText = 'Greased?'
  let hogGreased = document.createElement('input')

  hogGreased.setAttribute('type', 'checkbox')
  hogGreased.setAttribute('id', `grease-${hogInfo.id}`)
  hogGreased.addEventListener('change', changeGreased)

  if (hogInfo.greased) {
    hogGreased.setAttribute('checked', true)
  }

  let deleteP = document.createElement('p')
  let deleteButton = document.createElement('button')
  deleteButton.id = `delete-${hogInfo.id}`
  deleteButton.innerHTML = 'Delete'

  deleteButton.addEventListener('click', deleteHog)

  hogDiv.appendChild(hogName)
  hogDiv.appendChild(hogImage)
  hogDiv.appendChild(hogSpecialty)
  hogDiv.appendChild(hogMedal)
  hogDiv.appendChild(hogWeight)
  hogDiv.appendChild(greasedLabel)
  hogDiv.appendChild(hogGreased)
  hogDiv.appendChild(deleteP)
  deleteP.appendChild(deleteButton)

}
// switch greased to whatever event.target.checked is
function changeGreased() {
  let hogId = event.target.id.split('-')[1]
  let checked = event.target.checked

  fetch(`${HOGS_URL}/${hogId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'greased': checked
    })
  })
  .then(response => response.json())
  .then(data => console.log(data))
}

function deleteHog() {
  let hogId = event.target.id.split('-')[1]
  fetch(`${HOGS_URL}/${hogId}`, {
    method: 'delete'
  })
  .then(response => response.json())
  .then(data => {
    let hogElement = document.getElementById(`hog-card-${hogId}`)
    let hogsContainer = document.getElementById('hog-container')

    hogsContainer.removeChild(hogElement)
  })
}
