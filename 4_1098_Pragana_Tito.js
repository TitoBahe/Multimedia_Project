
const canvas = document.getElementById('dropArea');
const historigramCanvas = document.getElementById('historigrama');


const input = document.getElementById('input');

const button1 =document.getElementById('change-color-button1');
const button2 = document.getElementById('change-color-button2');

const latimeInput = document.getElementById('latime');

const lungimeInput = document.getElementById('lungime');

const resizeButton = document.getElementById('resize');

const deleteButton = document.getElementById('delete');

const textButton = document.getElementById('Textbutton');
const Inputtext = document.getElementById('Inputtext');
const InputColor = document.getElementById('InputColor');

const ctx = canvas.getContext('2d');
console.log(ctx);

let initialX, initialY, finalX, finalY, imageData;

function uploadImage(){
    let imgLink = URL.createObjectURL(input.files[0]);
    const img = new Image();
    img.onload = () => {
        // resolução da imagem, caso o canvas seja muito grande, fica com mal resolução, por isso fazemos isso pra ficar legal
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Desenha a imagem
    };
    img.src = imgLink;
}

canvas.addEventListener('dragover', (e)=>{
    e.preventDefault();
});

canvas.addEventListener('drop', (e)=>{
    e.preventDefault();
    input.files = e.dataTransfer.files;
    uploadImage();
});

canvas.addEventListener('mousedown', (e) => {
   
    if (e.button === 0) {
        if(finalX && finalY){
            
            let imgLink = URL.createObjectURL(input.files[0]);
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Desenha a imagem
            };
            img.src = imgLink;
        }
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        initialX = (e.clientX - rect.left) * scaleX;
        initialY = (e.clientY - rect.top) * scaleY;


    }
});

canvas.addEventListener('mousemove', (e)=>{
    if(e.shiftKey === true && finalX && finalY){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        ctx.putImageData(imageData, (e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        finalX = (e.clientX - rect.left) * scaleX;
        finalY = (e.clientY - rect.top) * scaleY;

        ctx.beginPath();
        ctx.rect(initialX, initialY, finalX - initialX, finalY - initialY);
        ctx.stroke();
        historigram();
    }
});

button1.addEventListener('click', (e)=>{
    // console.log(e);
    if(finalX && finalY){
        imageData = ctx.getImageData(initialX, initialY, finalX - initialX, finalY - initialY);
        for (let i = 0; i < imageData.data.length; i += 4){

            const red = imageData.data[i];
            const green = imageData.data[i + 1];
            const blue = imageData.data[i + 2];

            // Calcula o valor em escala de cinza usando a fórmula ponderada
            const gray = 0.299 * red + 0.587 * green + 0.114 * blue;

            imageData.data[i] = gray; 
            imageData.data[i+1] = gray;
            imageData.data[i+2] = gray;
            
        }
        ctx.putImageData(imageData, initialX, initialY);
    }
});

button2.addEventListener('click', (e)=>{
    if(finalX && finalY){
        imageData = ctx.getImageData(initialX, initialY, finalX - initialX, finalY - initialY);
        for (let i = 0; i < imageData.data.length; i += 4){

            const red = imageData.data[i];
            const green = imageData.data[i + 1];
            const blue = imageData.data[i + 2];

            imageData.data[i] = 255 - red; 
            imageData.data[i+1] = 255 - green;
            imageData.data[i+2] = 255 - blue ;
            
        }
        ctx.putImageData(imageData, initialX, initialY);
    }
});

resizeButton.addEventListener('click', (e) => {
    const latime = parseInt(latimeInput.value, 10); // Converte para número
    const lungime = parseInt(lungimeInput.value, 10); 
    if (!latime || latime <= 0) {
        console.error("A largura deve ser um número válido maior que zero.");
        return;
    }
    let imgLink = URL.createObjectURL(input.files[0]);
    const img = new Image();

    img.onload = (e) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
        resizeImage(e.target, latime, lungime);

    };
    img.src = imgLink;
});

deleteButton.addEventListener('click', (e)=>{
    if(finalX && finalY){
        ctx.clearRect(initialX, initialY, finalX - initialX, finalY - initialY);
        ctx.fillStyle = 'white';
        ctx.fillRect(initialX, initialY, finalX - initialX, finalY - initialY);
    }
});

function resizeImage(image, latime, lungime) {
    var maxWidth = latime; 
    var maxHeight = lungime; 

    var width = image.width;
    var height = image.height;
  
    if (width > height) {
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }
    }
  
    // Draw the resized image on the canvas
    ctx.drawImage(image, 0, 0, width, height);
}

function historigram(){

    if(finalX && finalY){
        imageData = ctx.getImageData(initialX, initialY, finalX - initialX, finalY - initialY);
        let historigramArray = [];

        for(let i = 0; i < 256; i++){
            historigramArray.push(0);
        }

        for(let i = 0; i < imageData.data.length; i+=4){
            let red =  imageData.data[i];
            let green = imageData.data[i+1];
            let blue = imageData.data[i+2];

            let medie = Math.round(red + green + blue) / 3;
            
            historigramArray[medie]++;
        }
        create(historigramArray);
    }
}

function create(values){
    const context = historigramCanvas.getContext('2d');
    
    context.clearRect(0, 0, historigramCanvas.width, historigramCanvas.height);

    context.fillStyle = 'rgba(255, 204, 0, 0.267)';
    context.fillRect(0, 0, historigramCanvas.width, historigramCanvas.height);        

    const barWidth = historigramCanvas.width / values.length;   
    
    for(let i = 0; i < values.length; i++){
        context.fillStyle = 'black'; 

        const barX = i * barWidth;

        const barHeight = values[i];

        const barY = historigramCanvas.height - barHeight;
        
        context.fillRect(barX, barY, barWidth, barHeight);
    }
}

textButton.addEventListener('click', (e)=>{
    
    const text = Inputtext.value;
    const color = InputColor.value
    ctx.fillStyle = `${color}`;
    ctx.font = "bold 56px serif";
    ctx.fillText(text, initialX, initialY);
});