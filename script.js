const indexBtn = document.querySelector("#index");
const draftBtn = document.querySelector("#draft");

const generateLink = document.querySelector("#generate");
const saveBtn = document.querySelector("#save");

let fileName = "index.html";
let type = "text/html";

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
    if (!indexFileHandler || !draftFileHandler) {
        throw new Error("Please select all files!")
    }

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

    for (let element of draftHtmlDoc.body.children) {
        const currElement = element.cloneNode(true);
        indexHtmlDoc.body.append(currElement);
    }

    let indexHtmlText = new XMLSerializer().serializeToString(indexHtmlDoc);

    return indexHtmlText;
}


saveBtn.addEventListener('click', async function saveFile() {
    try {
        let indexHtmlText = await operation()
        
        let stream = await indexFileHandler.createWritable();
        await stream.write(indexHtmlText);
        await stream.close();
    } catch (error) {
        return alert(error.message);
    }
});


generateLink.addEventListener("click", async function download() {
    try {
        let indexHtmlText = await operation();
        
        var file = new Blob([indexHtmlText], {type: type});
        generateLink.href = URL.createObjectURL(file);
        generateLink.download = fileName;
    } catch (error) {
        return alert(error.message);
    }
});