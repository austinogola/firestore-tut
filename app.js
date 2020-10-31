const cafeList=document.querySelector('.cafeList')
const form=document.querySelector('form')


function renderCafe(doc){
    let li=document.createElement('li')
    let cafeName=document.createElement('span')
    let cafeCity=document.createElement('span')
    let cross=document.createElement('div')


    li.setAttribute('city-id',doc.id)
    cafeName.textContent=`${doc.data().name}---->`
    cafeCity.textContent=`${doc.data().city}`
    cross.textContent='X'
    cross.style.cursor='pointer'

    li.appendChild(cafeName)
    li.appendChild(cafeCity)
    li.appendChild(cross)

    cafeList.appendChild(li)

    //Removing
    cross.addEventListener('click',e=>{
        e.stopPropagation() //Prevents bubbling up
        let id=e.target.parentElement.getAttribute('city-id')
        db.collection('cafes').doc(id).delete()
    })
}


//Fetch data from database
db.collection('cafes').get().then((snapshot)=>{
    console.log(snapshot.docs);
    snapshot.docs.forEach(doc => {
        console.log(doc.data());
        renderCafe(doc)
    });
})


//Adding data to db
form.addEventListener('submit',e=>{
    e.preventDefault()
    db.collection('cafes').add({
        name:form.name.value,
        city:form.city.value
    })
    form.name.value=''
    form.city.value=''
})