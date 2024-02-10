let tempCont = document.querySelector("#temp-cont");
let imgTemps = document.getElementsByClassName("img-temp");
let createBtn = document.querySelector("#create-btn");
let openTaskBtn = document.querySelector("#open-btn");
let saveTaskBtn = document.querySelector("#save-btn");
let saveBtn_ = document.querySelector("#save--btn");
let backBtn = document.querySelector("#back-btn");

document.addEventListener("keydown", function(event) {
  if (event.ctrlKey && (event.key === "f" || event.key === "F")) { event.preventDefault(); }
  if (event.ctrlKey && (event.key === "t" || event.key === "T")) { event.preventDefault(); }
  if (event.ctrlKey && (event.key === "w" || event.key === "W")) { event.preventDefault(); }
  if (event.ctrlKey && (event.key === "p" || event.key === "P")) { event.preventDefault(); }
  if (event.ctrlKey && (event.key === "s" || event.key === "S")) { event.preventDefault(); }
  if (event.ctrlKey && (event.key === "o" || event.key === "O")) { event.preventDefault(); }
  if (event.key === "F12") { event.preventDefault(); }
  if (event.key === "F11") { event.preventDefault(); }
});

document.body.addEventListener("contextmenu", function(event) { event.preventDefault(); });

let toReturn;
function check_file_save() {
  const alreadyFileName = sessionStorage.getItem("fileName");
  const alreadyFileTitle = sessionStorage.getItem("fileTitle");

  if (alreadyFileName == null || alreadyFileTitle == null) {
    next_to_do();
    return;
  } else if (
    alreadyFileTitle.toLowerCase().includes("unsaved") ||
    alreadyFileName.toLowerCase().includes("untitled")
  ) {
    eel.ask_save_file()(function (status) {
      if (status == "None") {
        console.log("NAHA");
        toReturn = true;
      } else if (status == "False") {
      } else if (status == "True") {
        if (alreadyFileName.toLowerCase().includes("untitled")) {
          window.location = "../save_page.html";
          toReturn = true;
        } else {
          const fileExt = sessionStorage.getItem("fileExt");
          if (fileExt == "wmail") {
            const fileContent = sessionStorage.getItem("editorParentInnerHTML");
            eel.save_file_(fileContent);
          } else {
            const fileContent = sessionStorage.getItem("editorParentInnerText");
            eel.save_file_(fileContent);
          }
        }
      }
      next_to_do();
    });
  } else {
    next_to_do();
    return;
  }
}

function next_to_do() {
    console.log(toReturn);
    sessionStorage.removeItem("isOpen");
    window.location = "../editor.html";
}

openTaskBtn.addEventListener("click", function(event) {
    event.preventDefault();
    window.location = "../open_page.html";
});

saveTaskBtn.addEventListener("click", function(event) {
    event.preventDefault();
    window.location = "../save_page.html";
});

backBtn.addEventListener("click", function(event) {
    event.preventDefault();
    let backOpen = sessionStorage.getItem("backOpen");
    if (backOpen == "true") {
        sessionStorage.setItem("isBack", "true");
        window.location = "../editor.html";
    }
});

createBtn.addEventListener("click", function(event) {
    event.preventDefault();
    check_file_save("create");
});

saveBtn_.addEventListener("click", function (event) {
    let fileName = sessionStorage.getItem("fileName");
    event.preventDefault();
    if (fileName === "untitled") {
        window.location = "../save_page.html";
    }
    else {
        const fileNameArr = fileName.split(".");
        if (fileNameArr[1] == "wmail") {
          let editorParentInnerHTML = sessionStorage.getItem("editorParentInnerHTML");
          sessionStorage.setItem("isBack", "true");
          sessionStorage.setItem("isSaved", "true");
          eel.save_file_(editorParentInnerHTML)(function (txt){
              if (txt == false) { return; }
              window.location = "../editor.html"; 
          });
        }
        else {
          let editorParentInnerText = sessionStorage.getItem("editorParentInnerText");
          sessionStorage.setItem("isBack", "true");
          sessionStorage.setItem("isSaved", "true");
          eel.save_file_(editorParentInnerText)(function (txt){
              if (txt == false) { return; }
              window.location = "../editor.html"; 
          });
        }
    }
});

for (let i = 0; i < imgTemps.length; i++) {
    imgTemps[i].addEventListener("click", load_temps);
}

function load_temps(event) {
    for (let i = 0; i < imgTemps.length; i++) {
      imgTemps[i].className = "img-temp";
    }
    let elemId = event.target.id;
    let elem = event.target;

    elem.className += " active-img-temp";

    eel.get_temp_txt(elemId)(function (fileText) {
        tempCont.innerHTML = fileText
    });
}