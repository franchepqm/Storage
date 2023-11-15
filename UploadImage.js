import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey:,
    authDomain:,
    projectId:,
    storageBucket:,
    messagingSenderId:,
    appId:,
    measurementId:
};

const app = initializeApp(firebaseConfig);
const storage = getStorage();
const firestore = getFirestore();
const imageList = document.getElementById('imageList');

// Obtén una referencia a la colección "fotos" en Firestore
const fotosCollection = collection(firestore, 'fotos');

document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');

    if (uploadButton) {
        uploadButton.addEventListener('click', subirImagen);
    }

    // Escucha cambios en la colección 'fotos' en tiempo real
    onSnapshot(fotosCollection, (snapshot) => {
        // Obtén las URL de descarga de las imágenes
        const urls = snapshot.docs.map(doc => doc.data().url);
        // Muestra todas las imágenes en la lista
        mostrarImagenesEnLista(urls);
    });
});

async function subirImagen() {
    const fileInput = document.getElementById('fileInput');

    if (fileInput && fileInput.files.length > 0) {
        try {
            const file = fileInput.files[0];
            const fileName = file.name;
            const storageRef = ref(storage, `fotos/${fileName}`);
            await uploadBytes(storageRef, file);

            // Obtén la URL de descarga
            const downloadURL = await getDownloadURL(storageRef);

            // Agrega la URL a la colección 'fotos' en Firestore
            await addDoc(fotosCollection, { url: downloadURL });
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            alert('Error al subir la imagen');
        }
    } else {
        alert('Por favor, selecciona una imagen');
    }
}

function mostrarImagenesEnLista(urls) {
    const imageList = document.getElementById('imageList');

    if (imageList) {
        // Limpiar la lista antes de mostrar nuevas imágenes
        imageList.innerHTML = '';

        // Iterar sobre las URLs de las imágenes y crear elementos de imagen
        urls.forEach((url) => {
            const imgElement = document.createElement('img');
            imgElement.src = url;
            imgElement.classList.add('uploaded-image');
            imageList.appendChild(imgElement);
        });
    }
}
