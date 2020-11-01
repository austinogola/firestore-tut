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

//Querying data
db.collection('cafes').where('city','=='/*can also be '>',"<=" etc*/,'Manchester').get().then((snapshot)=>{
    console.log('Querying If City Is Manchester');
    snapshot.docs.forEach(doc=>{
        console.log(doc.data());
    })
})


//Ordering
db.collection('cafes').orderBy('name').get().then(snapshot=>{
    console.log('Ordering By Name');
    snapshot.docs.forEach(doc=>{
        console.log(doc.data());
    })
})

//REAL TIME DATA/RENDERING
//onSnaphot==>an event listener on changes made to the database
db.collection('cafes').orderBy('city').onSnapshot(snapshot=>{
    let changes=snapshot.docChanges()
    changes.forEach(change=>{
        console.log(change.doc.data());
        if(change.type=='added'){
            renderCafe(change.doc)
        }else if(change.type=='removed'){
            let removedItem=cafeList.querySelector(`[city-id=${change.doc.id}]`)///Debug this
            cafeList.removeChild(removedItem)
        }
    })
})


// //Updating a value
// db.collection('cafes').doc('id here').update({
//     name:'New Name',
//     city:"new city name"
// })