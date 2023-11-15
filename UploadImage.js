// Importa las funciones que necesitas de los SDK que necesitas
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: ,
    authDomain: ,
    projectId: ,
    storageBucket: ,
    messagingSenderId: ,
    appId:,
    measurementId:
  };

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app); // Obtiene la instancia de Firestore
const storage = getStorage(); 

document.addEventListener("DOMContentLoaded", function () {
  const camaraAlfa = document.getElementById('camara-alfa');

  camaraAlfa.addEventListener('click', () => {
    if (inputNombre.value.trim() === '') {
      alert('Por favor, complete el campo de nombre antes de cargar una foto.');
      return;
    }

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', async (event) => {
      try {
        const file = event.target.files[0];
        const fileName = `${inputNombre.value.trim()}-${file.name}`;

        const storageRef = ref(storage, `fotos/${fileName}`);
        const imagenSnapshot = await uploadBytes(storageRef, file);
        const imagenDownloadURL = await getDownloadURL(imagenSnapshot.ref);

        console.log('URL de descarga:', imagenDownloadURL);
        alert('Foto subida correctamente');
      } catch (error) {
        console.error("Error al subir la imagen:", error);
        alert('Error al subir la foto');
      } finally {
        formulario.removeChild(fileInput);
      }
    });

    formulario.appendChild(fileInput);
    fileInput.click();
  });

  formulario.addEventListener("submit", async function (event) {
    try {
      event.preventDefault();

      const imagenFile = document.getElementById('camara-alfa');

      if (imagenFile && imagenFile.files.length > 0) {
        const imagenFileName = `${inputNombre.value.trim()}-${imagenFile.files[0].name}`;
        const imagenStorageRef = ref(storage, `fotos/${imagenFileName}`);
        const imagenSnapshot = await uploadBytes(imagenStorageRef, imagenFile.files[0]);
        const imagenDownloadURL = await getDownloadURL(imagenSnapshot.ref);

        console.log("URL de descarga de la imagen:", imagenDownloadURL);
        alert("Imagen subida correctamente");
      } else {
        alert("Por favor, selecciona una imagen");
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      alert("Error al subir la imagen");
    }
  });
});
