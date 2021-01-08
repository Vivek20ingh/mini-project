const EventList = document.querySelector('#Event-list');
const form = document.querySelector('#add-Event-form');

// create element and render Event 

function renderEvent(doc){
   let li = document.createElement('li');
   let Todo = document.createElement('span');
   let Start_Time = document.createElement('span');
   let End_Time = document.createElement('span');
   let cross = document.createElement('div');

   let p=Start_Time;

   li.setAttribute('data-id', doc.id);
   Todo.textContent = doc.data().Todo;
   Start_Time.textContent = doc.data().Start_Time;
   End_Time.textContent = doc.data().End_Time;
   cross.textContent = 'x';

   li.appendChild(Todo);
   li.appendChild(Start_Time);
   li.appendChild(End_Time);

   li.appendChild(cross);

   EventList.appendChild(li);

   //deletind data
   cross.addEventListener('click', (e) => {
       e.stopPropagation();
       let id = e.target.parentElement.getAttribute('data-id');
       db.collection('Events').doc(id).delete();
   })
}


// saving data

form.addEventListener('submit',(e) => {
    e.preventDefault();
    db.collection('Events').add({
        Todo: form.Todo.value,
        Start_Time: form.Start_Time.value,
        End_Time: form.End_Time.value
    });
    form.Todo.value = '';
    form.Start_Time.value = '';
    form.End_Time.value = '';
})


//real Start_Time listener

db.collection('Events').orderBy('Start_Time').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
     changes.forEach(change => {
         if(change.type == 'added') {
             renderEvent(change.doc);
         }
         else if(change.type == 'removed') {
             let li = EventList.querySelector('[data-id=' + change.doc.id + ']');
             EventList.removeChild(li);
         }
     })
})