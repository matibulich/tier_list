const imageInput = document.getElementById("input-images");
const items = document.getElementById("items");
const resetButton = document.getElementById("reset-button")
const fotoButton = document.getElementById("foto-button")

function createItem(src) {
  const imgElement = document.createElement("img"); //crea una imagen nueva
  imgElement.draggable = true; //hace que laimagen sea arrasttrable
  imgElement.src = src; //convierte la imagen y la coloca en img src = ".... "
  imgElement.className = "image-item";

  imgElement.addEventListener("dragstart", dragStart);
  imgElement.addEventListener("dragend", dragEnd);

  items.appendChild(imgElement); //añade la imagen al contenedor "items de HTML"
  return imgElement;
}

imageInput.addEventListener("change", (e) => {
  const {files} = e.target //  desestructurado  const files = e.target.files  //OBTIENE EL ARCHIVO SELECCIONADO
  if (files && files.length > 0) {

    Array.from(files).forEach(file => { //hay q convertirlo en Array, porque files no es un array
      const reader = new FileReader(); //Crea un lector de archivos

      reader.onload = (eReader) => {         // Cuando el archivo se carga, se llama a la función createItem para crear una nueva imagen y mostrarla.
        createItem(eReader.target.result);
      };
      reader.readAsDataURL(file); //metodo del objeto filereader
    })
  

   
  }
});

let draggedElem = null;
let srcContainer = null;

const rows = document.querySelectorAll(".tier .row")

rows.forEach(row => {
  row.addEventListener("drop", handleDrop)
  row.addEventListener("dragover", handleDragOver)
  row.addEventListener("dragleave", handleDragLeave)
  
});

items.addEventListener("drop", handleDrop)
items.addEventListener("dragover", handleDragOver)
items.addEventListener("dragleave", handleDragLeave)

function dragStart(e) {

  console.log(e.target, "drag start");
  draggedElem = e.target; //almacena la imagen que se esta arrastrando
  srcContainer = draggedElem.parentNode; //parentNode : propiedad de los Nodos del DOM, hace ref al nodo padre de un elemento
  e.dataTransfer.setData("text/plain", draggedElem.src) // Transfiere la fuente de la imagen. dataTransfer es un objeto de la api drag and rop. sirve para guardar info en archivos de arrestre
}

function dragEnd(e) {
  console.log(e.target, "drag end");
  draggedElem = null;    // Restablece las variables al finalizar el arrastre
  srcContainer = null;
}

function handleDrop(e){
  console.log(e.target, "handle drop")
  e.preventDefault()
  const {currentTarget, dataTransfer} = e
  currentTarget.classList.remove("drag-over")

  if (srcContainer && draggedElem){  // Elimina la imagen del contenedor original
    srcContainer.removeChild(draggedElem)
  }

  if (draggedElem){
    const src = dataTransfer.getData("text/plain")// Recupera la fuente de la imagen
    const imgElement = createItem(src) // Crea una nueva imagen con la misma fuent
    currentTarget.appendChild(imgElement)// Añade la imagen al nuevo contenedor
  }
}

function handleDragOver(e){
  e.preventDefault()
  const {currentTarget} = e
  currentTarget.classList.add("drag-over")
  console.log("handle drag over")
}


function handleDragLeave(e){
  e.preventDefault()
  const {currentTarget} = e   //const currentTarget = currenteTarget.e
  currentTarget.classList.remove("drag-over")
  console.log("handle drag leave")
}

resetButton.addEventListener("click", ()=>{
  const itemsClear = document.querySelectorAll(".tier .image-item")
  itemsClear.forEach(item=>{
    item.remove()

    items.appendChild(item)

  })
})

fotoButton.addEventListener("click",()=>{
  const tierContainer = document.querySelector(".tier")
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")

  import('https://cdn.jsdelivr.net/npm/html2canvas-pro@1.5.8/+esm')
    .then(({default: html2canvas})=>{
      html2canvas(tierContainer).then(canvas=>{
        context.drawImage(canvas, 0, 0)
        const imgURL = canvas.toDataURL("image/png")
        const download = document.createElement("a")
        download.download = "foto.png"
        download.href = imgURL
        download.click()
      })
     
    })
})

//FileReader es un objeto de JavaScript para leer el contenido de archivos de manera asíncrona. Este objeto es especialmente útil cuando un usuario selecciona archivos a través de un elemento <input type="file">, ya que permite  manejar esos archivos sin necesidad de enviarlos a un servidor.
