// DOM-referanser 
const inpName = document.querySelector('#inpName');
const inpDesc = document.querySelector('#inpDesc');
const registrerteHunder = document.querySelector('.MineRegistrerteHunder');
const hunder = document.querySelector('.hunder');

const heroImage = document.querySelector('.heroImage');
const heroName = document.querySelector('.heroName');
const heroDesc = document.querySelector('.heroDesc');
const heroStam = document.querySelector('.heroStam');
const inpStam = document.querySelector('#inpStam')

// Firebase oppsett: database og storage
const db = firebase.firestore(); //firestore database
const canisfamiliaris = db.collection('canisfamiliaris');
const storage = firebase.storage(); //storage
const dbHunder = storage.ref('canisfamiliaris/' + ( +new Date() ) + inpFile.name); // firebase storage canis familiaris


// snapshot for each for å vise innhold fra Firebase
//  OUTPUT
const entriesName = [];
console.log('entriesName :', entriesName);
const entriesDesc = [];
const entriesStam = [];
console.log('entriesStam :', entriesStam);
const pictures = [];
const doc_ID_Array = [];

// console.log(' :',doc_ID_Array );
console.log('pictures :', pictures);

   // Registrere nye hunder 
   btn_RegHund.onclick = () => {
        
    // gjør valgt fil tilgjengelig for Firebase storage
    console.log('on change function works :', );
    const inpFile = inpBilde.files[0]; //tilgang til valgt bilde første fil.
    console.log('valgt bilde med url adresse works :', inpFile);
   
    // Lagre inpFil i Firebase storage
    dbHunder.put(inpFile) //insert inpFile in dbHunder 
    .then(inpFile => inpFile.ref.getDownloadURL() ) // run 
    .then (url => {
        const inpFileUrl = url;
    
    // show recent input in DOM.
    document.querySelector('.hundebilde').src = `${url}`;
    document.querySelector('.hNavn').innerHTML = inpName.value;
    document.querySelector('.beskrivelse').innerHTML = inpStam.value;
    document.querySelector('.status').textContent = 'Ny hund registrert!'
    

    console.log('lagret bilde i database :', inpFileUrl);
    // Lagre inputVerdier i Firebase firestore
        db.collection('canisfamiliaris').add({
            navn: inpName.value,
            pictureURL: url,
            desc: inpDesc.value,
            stam: inpStam.value,
        })

    console.log('alt lagret! :', );
    inpName.value = '';
    inpDesc.value = '';
    inpStam.value = '';
    

    })
};
   
// Create dogCards and render cards 
function renderCards(doc) {
    // push doc.id to array
    pictures.push(doc.data().pictureURL);
    doc_ID_Array.push(doc.id);
    entriesName.push(doc.data().navn);
    entriesDesc.push(doc.data().desc);
    entriesStam.push(doc.data().stam);
    
    let dogCard = document.createElement('div');
    let dogPicture = document.createElement('img');
    let editButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    let dogCardName = document.createElement('h1');

    dogCard.setAttribute('class', 'regCard');
    dogCardName.textContent = doc.data().navn;

   

    dogPicture.setAttribute('class', 'dogPictures');

    editButton.setAttribute('id', doc.id);
    editButton.setAttribute('class', 'editButtons')
    editButton.textContent = 'Endre';

    deleteButton.setAttribute('id', doc.id);
    deleteButton.setAttribute('class', 'deleteButtons')
    deleteButton.textContent = 'Slett';

    registrerteHunder.appendChild(dogCard);
    dogCard.appendChild(dogPicture);
    
    dogCard.appendChild(deleteButton);
    dogCard.appendChild(editButton);
    dogCard.appendChild(dogCardName);
    
    

    renderPictures();

};
// 

// delete cards
function deleteCards(doc) {
    let allDeleteButtons = document.querySelectorAll('.deleteButtons');
    for (let i = 0; i < allDeleteButtons.length; i++) {
        allDeleteButtons[i].onclick = () => {
            alert('deleting');
            console.log('delete and remove :', );
            db.collection('canisfamiliaris').doc(doc_ID_Array[i]).delete()
            
            .then(function reloadPage() {
                setTimeout(function(){ location.reload() }, 5000);
              });

            // // throws error
            // const imageRef = storage.ref('canisfamiliaris/' + inpFile.name[i]);
            // // Delete the file
            // imageRef.delete().then(function() {
            // // File deleted successfully
            // }).catch(function(error) {
            // // Uh-oh, an error occurred!
            // });

        }
        
    }

}

// equiry search, trigger method by onchange.  
document.querySelector('.InpSok').onkeyup = () => {
   for (let i = 0; i < entriesName.length; i++)
    if (document.querySelector('.InpSok').value.toLowerCase() === `${entriesName[i]}`.toLowerCase() || document.querySelector('.InpSok').value.toLowerCase() === `${entriesStam[i]}`.toLowerCase())  {
        alert('found!')
       heroImage.src = `${pictures[i]}`;
       heroName.textContent = `${entriesName[i]}`;
       heroDesc.textContent = `${entriesDesc[i]}`;
       heroStam.textContent = `${entriesStam[i]}`;

       document.querySelector('.InpSok').value = '';

    }


};

// Snapshot database 
db.collection('canisfamiliaris').get().then(snapshot => {
    snapshot.docs.forEach( doc => {
        renderCards(doc);
        editCards(doc);
        // enquirySearch(doc);
        deleteCards(doc);
       
       
    })
});

// edit cards 
function editCards(doc) {
    let alleditButtons = document.querySelectorAll('.editButtons');
    for ( let i = 0; i < alleditButtons.length; i++) {
        alleditButtons[i].onclick = () => {
            alert('changed');
            // update selected doc
            db.collection('canisfamiliaris').doc(doc_ID_Array[i]).update({
                navn: inpName.value,
                stam: inpStam.value,
                desc: inpDesc.value,
            })

            
        }
    }

};

// render dog pictures
function renderPictures() {
    const dogPictures = document.querySelectorAll('.dogPictures');
    
    for (i = 0; i < dogPictures.length; i++) {
        dogPictures[i].src = `${pictures[i]}`;
       
    }
};

