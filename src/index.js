let form = document.querySelector('form');
let submitBtn = document.querySelector('#submit-button');
let currentName = "";
let currentBreed = "";
let currentSex = ""; 
let currentId = ""; 

//don't let the form submit if the fields are blank
submitBtn.setAttribute('disabled', '');

function submitDog (event) {   
    event.preventDefault();

    fetch(`http://localhost:3000/dogs/${currentId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json' 
        },
        body: JSON.stringify({
            name: form.elements[0].value,
            breed: form.elements[1].value,
            sex: form.elements[2].value
        })
    })//close fetch
    .then(patchResp => patchResp.json())
    .then(patchedData => {
        document.getElementById(`col1-${patchedData.id}`).innerHTML = `<td>${patchedData.name}</td>`
        document.getElementById(`col2-${patchedData.id}`).innerHTML = `<td>${patchedData.breed}</td>`
        document.getElementById(`col3-${patchedData.id}`).innerHTML = `<td>${patchedData.sex}</td>`
        fetchDogs()
            
        })

        
    //re-set the form 
    form.elements[0].value = "";
    form.elements[1].value = ""; 
    form.elements[2].value = "";  
    submitBtn.setAttribute('disabled', '');

} 

function fetchDogs () {
    //fetch the data from the server 
    fetch('http://localhost:3000/dogs')
    .then(resp => resp.json())
    .then(data => {
        console.log('running fetchDogs')
        document.getElementById('table-body').innerHTML = "";
        //Give each dog a row and data columns and an edit button
        for (let dog of data){
            let dogRow = document.createElement('tr'); 
            let col1 = document.createElement('td'); 
            let col2 = document.createElement('td');
            let col3 = document.createElement('td');
            let col4 = document.createElement('td');

            document.getElementById('table-body').appendChild(dogRow); 
            dogRow.appendChild(col1);
            dogRow.appendChild(col2);
            dogRow.appendChild(col3);
            dogRow.appendChild(col4); 
            
            col1.setAttribute('id', `col1-${dog.id}`);
            col2.setAttribute('id', `col2-${dog.id}`);
            col3.setAttribute('id', `col3-${dog.id}`);
            col4.setAttribute('id', `col4-${dog.id}`);

            col1.innerHTML = `<td>${dog.name}</td>`
            col2.innerHTML = `<td>${dog.breed}</td>`
            col3.innerHTML = `<td>${dog.sex}</td>`
            col4.innerHTML = ` <td><button id="edit${dog.id}">Edit</button></td>`

            //get this dog's edit button and listen for click, then add the dog info to the form
            document.getElementById(`edit${dog.id}`).addEventListener('click', (event)=> {
                currentName = dog.name; 
                currentBreed = dog.breed; 
                currentSex = dog.sex; 
                currentId = dog.id; 

                form.elements[0].value = currentName;
                form.elements[1].value = currentBreed; 
                form.elements[2].value = currentSex;  

                submitBtn.removeAttribute('disabled');     

                form.addEventListener('submit', submitDog)

            }) 
        }

    })
}

document.addEventListener('DOMContentLoaded', fetchDogs)
