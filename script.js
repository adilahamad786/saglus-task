const indexBtn = document.querySelector("#index");
const draftBtn = document.querySelector("#draft");

const generateLink = document.querySelector("#generate");
const saveBtn = document.querySelector("#save");

let content = "";
let fileName = "index.html";
let type = "text/html"

let indexFileHandler;
let draftFileHandler;

async function loadFile () {
    let [fileHandler] = await window.showOpenFilePicker();

    if (fileHandler.name === "index.html") {
        indexFileHandler = fileHandler;
    } else if (fileHandler.name === "draft.html") {
        draftFileHandler = fileHandler;
    }
}

indexBtn.addEventListener("click", loadFile);
draftBtn.addEventListener("click", loadFile);

async function getHtmlDoc(fileHandler) {
    let file = await fileHandler.getFile();
    let fileText = await file.text();

    let htmlDocument = new DOMParser().parseFromString(fileText, "text/html");;

    return htmlDocument;
}

async function operation() {
    let indexHtmlDoc = await getHtmlDoc(indexFileHandler);
    let draftHtmlDoc = await getHtmlDoc(draftFileHandler);

    const existIds = [];

    indexHtmlDoc.querySelectorAll("[id]")
        .forEach(element => existIds.push(element.id));

    draftHtmlDoc.querySelectorAll("[id]").forEach(element => {
        if (existIds.includes(element.id)) {
            element.id = Math.round(Math.random() * 1000 + 100);
        }
    });

    console.log(draftHtmlDoc);

    for (let element of draftHtmlDoc.body.children) {
        const currElement = element.cloneNode(true);
        indexHtmlDoc.body.append(currElement);
    }

    content = new XMLSerializer().serializeToString(indexHtmlDoc);
}


saveBtn.addEventListener('click', async function saveFile() {
    await operation()
    let stream = await indexFileHandler.createWritable();
    await stream.write(content);
    await stream.close();
});


generateLink.addEventListener("click", function download() {
    var file = new Blob([content], {type: type});
    generateLink.href = URL.createObjectURL(file);
    generateLink.download = fileName;
});