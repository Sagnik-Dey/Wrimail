let cardSection = document.querySelector(".card-section");
let fileChooserBtn = document.querySelector("#choose-file-btn");
let openBtn = document.querySelector("#open-file-btn");
let pathInp = document.querySelector("#path-inp");
let recentCards, cardNumber;
let recentCardCode;
var parentElement;
let saveBtn_ = document.querySelector("#save--btn");
let backBtn = document.querySelector("#back-btn");

backBtn.addEventListener("click", function (event) {
  event.preventDefault();
  let backOpen = sessionStorage.getItem("backOpen");
  if (backOpen == "true") {
    sessionStorage.setItem("isBack", "true");
    window.location = "../editor.html";
  }
});

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

saveBtn_.addEventListener("click", function (event) {
  let fileName = sessionStorage.getItem("fileName");
  event.preventDefault();
  if (fileName === "untitled") {
    window.location = "../save_page.html";
  } else {
    let editorParentInnerHTML = sessionStorage.getItem("editorParentInnerHTML");
    sessionStorage.setItem("isBack", "true");
    sessionStorage.setItem("isSaved", "true");
    eel.save_file_(editorParentInnerHTML)(function (txt) {
      if (txt == false) {
        return;
      }
      window.location = "../editor.html";
    });
  }
});

fileChooserBtn.addEventListener("click", function (event) {
  event.preventDefault();
  eel.choose_file()(function (fileName) {
    pathInp.innerHTML = fileName;
  });
});

let toReturn;
function check_file_save(recent=null) {
  const alreadyFileName = sessionStorage.getItem("fileName");
  const alreadyFileTitle = sessionStorage.getItem("fileTitle");

  if (alreadyFileName == null || alreadyFileTitle == null) { next_to_do(recent); return; }
  else if (alreadyFileTitle.toLowerCase().includes("unsaved") ||alreadyFileName.toLowerCase().includes("untitled")) {
    eel.ask_save_file()(function (status) {
      if (status == "None") {
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
      next_to_do(recent);
    });
  }
  else { next_to_do(recent); return; }
}

function next_to_do(recent=null) {
  console.log(toReturn);
  if (toReturn == true) {
    return;
  }

  if (recent == null) {
    let pathValue = pathInp.textContent;
    let pathLst = pathValue.split("/");
    eel.open_file(pathValue)(function (fileData) {
      sessionStorage.setItem("isOpen", "true");
      sessionStorage.setItem("openFileContent", fileData[0]);
      sessionStorage.setItem("fileName", fileData[1]);

      if (pathLst[pathLst.length - 1].includes(".txt")) {
        sessionStorage.setItem("fileExt", "txt");
      } else if (pathLst[pathLst.length - 1].includes(".wmail")) {
        sessionStorage.setItem("fileExt", "wmail");
      }

      window.location = "../editor.html";
    });
  }
  else {
    let parenElement;
    if (recent.target.tagName.toLowerCase() === "p") {
      parenElement = recent.target.parentNode;
    } else {
      parenElement = recent.target;
    }

    const pathInpElement = String(parenElement.children[2].textContent);
    const fileName = String(parenElement.children[1].textContent);
    if (fileName.includes(".txt")) {
      sessionStorage.setItem("fileExt", "txt");
    } else if (fileName.includes(".wmail")) {
      sessionStorage.setItem("fileExt", "wmail");
    }
    eel.open_file(pathInpElement)(function (fileContent) {
      if (fileContent == "deleted") {
        cardSection.innerHTML = "";
        getRecentCardData();
        return;
      }
      sessionStorage.setItem("isOpen", "true");
      sessionStorage.setItem("openFileContent", fileContent[0]);
      sessionStorage.setItem("fileName", fileName);

      window.location = "../editor.html";
    });
  }
}

openBtn.addEventListener("click", function (event) {
  event.preventDefault();

  check_file_save();
});


function getRecentCardData() {
  eel.get_recent_card_data()(function (fileDataArray) {
    for (let index = 0; index < fileDataArray.length; index++) {
      let fileData = fileDataArray[index];
      let fileName = fileData[1];
      let filePath = fileData[2];

      recentCardCode = `
        <div class="recent-file-card card-${index + 1}">
            <img src="assets/image/file_icon.png" class="file-icon" alt="" />
            <p class="file-name">${fileName}</p>
            <p class="file-path">${filePath}</p>
        </div>
        `;

      cardSection.insertAdjacentHTML("beforeend", recentCardCode);
    }
    recentCards = document.getElementsByClassName("recent-file-card");

    for (let index = 0; index < recentCards.length; index++) {
      const element = recentCards[index];
      console.log(element, index, "here");
      element.addEventListener("click", openRecentFile);
    }
  });
}

getRecentCardData();

function openRecentFile(event) {
  let parenElement;
  if (event.target.tagName.toLowerCase() === "p") {
    parenElement = event.target.parentNode;
  } else {
    parenElement = event.target;
  }

  const fileName = String(parenElement.children[1].textContent);
  if (fileName.includes(".txt")) {
    sessionStorage.setItem("fileExt", "txt");
  } else if (fileName.includes(".wmail")) {
    sessionStorage.setItem("fileExt", "wmail");
  }

  check_file_save(event);
}
