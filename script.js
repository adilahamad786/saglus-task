const fileBtn = document.querySelector("#file");
const generateLink = document.querySelector("#generate");
const saveBtn = document.querySelector("#save");

let content = "";
let fileName = "index.html";
let type = "text/html"

let fileHandler;

fileBtn.addEventListener("click", async function () {
    [fileHandler] = await window.showOpenFilePicker();
    let file = await fileHandler.getFile();
    let fileText = await file.text();

    let html = new DOMParser().parseFromString(fileText, "text/html");;

    let h2 = document.createElement("h2");
    h2.textContent = "Yes, Bro!"

    html.body.append(h2);

    content = new XMLSerializer().serializeToString(html);

    console.log(content);
});

saveBtn.addEventListener('click', async function saveFile() {
    let stream = await fileHandler.createWritable();
    await stream.write(content);
    await stream.close();
});

generateLink.addEventListener("click", function download() {
    var file = new Blob([content], {type: type});
    generateLink.href = URL.createObjectURL(file);
    generateLink.download = fileName;
});