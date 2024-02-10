let editor = document.querySelector(".editor");
let fileMenuBtn = document.querySelector("#file-menu-btn");
let homeMenuBtn = document.querySelector("#home-menu-btn");
let textToChangeInput = document.getElementsByClassName("text-to-change");
let zoomInBtn = document.querySelector("#zoom-in");
let zoomOutBtn = document.querySelector("#zoom-out");
let findTxtBtn = document.querySelector("#find-btn");
let findRepBtn = document.querySelector("#replace-task-btn");
let body = document.querySelector("body");
let editContBtn = document.querySelector("#edit-btn");
let warningDiv = document.querySelector(".warning-div");
let editorParent = document.querySelector(".editor-parent");
let fileTitle = document.querySelector("#file-title");
let addPageBtn = document.querySelector("#add-page-btn");
let deletePageBtn = document.querySelector("#delete-page-btn");
let isOpen = sessionStorage.getItem("isOpen");
let isBack = sessionStorage.getItem("isBack");
let templatesArray = [
  "Proffessional Email",
  "Subscription Confirmation",
  "Thanks for Request",
  "Link to Video",
  "Arousing Curiosity",
  "Reminder",
];
let templatesIdArray = [
  "prof_email",
  "subs_confirm",
  "thank_req",
  "link_vid",
  "curiosity",
  "reminder",
];
let matchRes;
let editorText_;
let editorText;
let findDiv, findCloseBtn, findUpBtn, findDownBtn, findTextInput;
let findRepDiv, findTextInp, repTextInp, replaceAllBtn, findRepCloseBtn;
let editorInnerHtml;
let findDivCode = `
  <div class="find-div" id="find-div">
        <input type="text" id="find-text" autofocus></input>
        <img src="assets/image/up_arrow.png" id="up-arrow" class="arrow-logo" alt="">
        <p id="match-res">0 match</p>
        <img src="assets/image/down_arrow.png" id="down-arrow" class="arrow-logo" alt="">
        <img src="assets/image/close.png" id="close-img" alt="">
  </div>
`;
let findRepDivCode = `
  <div class="find-div find--div" id="find-rep-div">
        <input type="text" id="find--text" placeholder="Find"></input>
        <input type="text" id="replace--text" placeholder="Replace"></input>
        <p id="match-res" style="margin-left: 20px;">0 match</p>
        <a href="" id="replace-btn">Replace All</a>
        <img src="assets/image/close.png" id="close-img"  alt="">
  </div>
`;

let tempText;

editContBtn.addEventListener("click", enableEditing);

document.addEventListener("keydown", function(event) {
  if (event.ctrlKey && (event.key === "f" || event.key === "F")) {
    event.preventDefault();
    findText();
  }
  if (event.altKey && (event.key === "f" || event.key === "F")) {
    event.preventDefault();
    openFileTab();
  }

  if (event.ctrlKey && (event.key === "t" || event.key === "T")) { event.preventDefault(); }
  if (event.ctrlKey && (event.key === "w" || event.key === "W")) { event.preventDefault(); }
  if (event.ctrlKey && (event.key === "p" || event.key === "P")) { event.preventDefault(); }
  if (event.ctrlKey && (event.key === "p" || event.key === "P")) { event.preventDefault(); }
  if (event.ctrlKey && (event.key === "o" || event.key === "O")) { 
    event.preventDefault(); 
    openFileTab(undefined, false);
    window.location = "../open_page.html";
  }
  if (event.ctrlKey && (event.key === "s" || event.key === "S")) { 
    event.preventDefault();
    openFileTab(undefined, false);
    
    const fileName = fileTitle.textContent;
    if (fileName.toLowerCase == "untitled") {
      window.location = "../save_page.html";
    }
    else {
      let fileName = sessionStorage.getItem("fileName");
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
    }
  }
  if (event.key === "F12") { event.preventDefault(); }
  if (event.key === "F11") { event.preventDefault(); }
})

document.body.addEventListener("contextmenu", function(event) { event.preventDefault(); });

function changeFontSize(fontSize, func) {
  const editorTextArray = document.getElementsByClassName("editor-text");
  
  if (func == "zoom-in") {
    fontSize = String(fontSize + 2) + "px";
    for (let i = 0; i < editorTextArray.length; i++) {
      const element = editorTextArray[i];
      element.style.fontSize = fontSize;
    }
    for (let i = 0; i < textToChangeInput.length; i++) {
      const element = textToChangeInput[i];
      element.style.fontSize = fontSize;
    }
  } else if (func == "zoom-out") {
    fontSize = String(fontSize - 2) + "px";
    for (let i = 0; i < editorTextArray.length; i++) {
      const element = editorTextArray[i];
      element.style.fontSize = fontSize;
    }
    for (let i = 0; i < textToChangeInput.length; i++) {
      const element = textToChangeInput[i];
      element.style.fontSize = fontSize;
    }
  }
}

zoomInBtn.addEventListener("click", function () {
  editorText = document.querySelector(".editor-text");
  let fontSize = window
    .getComputedStyle(editorText, null)
    .getPropertyValue("font-size");
  changeFontSize(Number(fontSize.replace("px", "")), "zoom-in");
});

zoomOutBtn.addEventListener("click", function () {
  editorText = document.querySelector(".editor-text");
  let fontSize = window
    .getComputedStyle(editorText, null)
    .getPropertyValue("font-size");
  changeFontSize(Number(fontSize.replace("px", "")), "zoom-out");
});

findTxtBtn.addEventListener("click", findText);
findRepBtn.addEventListener("click", findRepText);

addPageBtn.addEventListener("click", addPage);
deletePageBtn.addEventListener("click", deletePage);

fileMenuBtn.addEventListener("click", openFileTab);

function openFileTab(event=null, goto=true) {
  if (event != null) { event.preventDefault(); } 
  let editorParentInnerHTML = editorParent.innerHTML;
  let editorParentInnerText = editorParent.textContent;
  sessionStorage.setItem("editorParentInnerHTML", editorParentInnerHTML);
  sessionStorage.setItem("editorParentInnerText", editorParentInnerText);
  sessionStorage.setItem("backOpen", "true");
  
  const fileTitleCont = fileTitle.textContent;
  sessionStorage.setItem("fileTitle", fileTitleCont);

  if (!fileTitleCont.toLowerCase().includes("unsaved") && !fileTitleCont.toLowerCase() == "untitled") {
    sessionStorage.setItem("isSaved", "true");
  }

  if (goto == true) {window.location = "../file_page.html"};
}

homeMenuBtn.addEventListener("click", function (event) {
  event.preventDefault();
  window.location = "../editor.html";
});

if (isBack == "true") {
  let content = sessionStorage.getItem("editorParentInnerHTML");
  let isSaved = sessionStorage.getItem("isSaved");
  let fileName = sessionStorage.getItem("fileName");

  editorParent.innerHTML = content;
  fileTitle.innerHTML = fileName;

  if (isSaved == "true") {
    fileTitle.innerHTML = fileName;
  } else {
    if (fileName.toLowerCase() != "untitled") {
      fileTitle.innerHTML = fileName + " (Unsaved)";
      fileTitle.style.fontWeight = "500";
      sessionStorage.removeItem("isSaved");
    }
  }

  sessionStorage.removeItem("isBack");
  warningDiv.remove();

  const editorTextArray = document.getElementsByClassName("editor-text");
  for (let index = 0; index < editorTextArray.length; index++) {
    const element = editorTextArray[index];
    element.addEventListener("input", function (event) {
      let fileName = sessionStorage.getItem("fileName");
      if (fileName.toLowerCase() != "untitled") { 
        fileTitle.innerHTML = fileName + " (Unsaved)";
        fileTitle.style.fontWeight = "500";
        sessionStorage.removeItem("isSaved");
      }
    });
  }
} else if (isOpen == "true") {
  let openFileContent = sessionStorage.getItem("openFileContent");
  const fileExt = sessionStorage.getItem("fileExt");

  if (fileExt === "txt") {
    setTextOnEditor(openFileContent);
    editorText = document.querySelector("#editor-text");
    editorText.setAttribute("contenteditable", "true");
  } else if (fileExt === "wmail") {
    editorParent.innerHTML = openFileContent;
  }
  let fileName = sessionStorage.getItem("fileName");
  warningDiv.remove();
  fileTitle.innerHTML = fileName;

  const editorTextArray = document.getElementsByClassName("editor-text");
  for (let index = 0; index < editorTextArray.length; index++) {
    const element = editorTextArray[index];
    element.addEventListener("input", function (event) {
      let fileName = sessionStorage.getItem("fileName");
      if (fileName.toLowerCase() != "untitled") {
        fileTitle.innerHTML = fileName + " (Unsaved)";
        fileTitle.style.fontWeight = "500";
        sessionStorage.removeItem("isSaved");
      }
    });
  }
} else {
  eel.return_temp_text()(setTextOnEditor);
  sessionStorage.setItem("fileName", "untitled");

  const editorTextArray = document.getElementsByClassName("editor-text");
  for (let index = 0; index < editorTextArray.length; index++) {
    const element = editorTextArray[index];
    element.addEventListener("input", function (event) {
      let fileName = sessionStorage.getItem("fileName");
      if (fileName.toLowerCase() != "untitled") { 
        fileTitle.innerHTML = fileName + " (Unsaved)";
        fileTitle.style.fontWeight = "500";
        sessionStorage.removeItem("isSaved");
      }
    });
  }
}

function setTextOnEditor(text) {
  tempText = text;
  let textHtml = `
  <pre class="editor-text" id="editor-text">${text}</pre>
  `;
  editor.innerHTML = textHtml;

  editorText_ = document.getElementsByClassName("editor-text");
  editorText = document.querySelector("#editor-text");
}

function findText(event) {
  // event.preventDefault();
  console.log("Here");

  const isFindRepDivOpen = sessionStorage.getItem("findRepDivOpen");
  if (isFindRepDivOpen === "true") {
    return;
  }
  if (document.body.contains(warningDiv)) { return; }

  body.insertAdjacentHTML("beforeend", findDivCode);
  findDiv = document.querySelector("#find-div");
  findCloseBtn = document.querySelector("#close-img");
  findTextInput = document.querySelector("#find-text");
  matchRes = document.querySelector("#match-res");
  findUpBtn = document.querySelector("#up-arrow");
  findDownBtn = document.querySelector("#down-arrow");
  findCloseBtn.addEventListener("click", closeFindDiv);
  findDownBtn.addEventListener("click", highlightDown);
  findUpBtn.addEventListener("click", highlightUp);
  findTextInput.addEventListener("input", findText_);

  sessionStorage.setItem("findDivOpen", "true");
}

function closeFindDiv(event) {
  // event.preventDefault();
  sessionStorage.removeItem("findDivOpen");

  const editorTextArray = document.getElementsByClassName("editor-text");
  const textArray = [];
  for (let index = 0; index < editorTextArray.length; index++) {
    const element = editorTextArray[index];
    textArray.push(element.textContent);
  }

  for (let index = 0; index < editorTextArray.length; index++) {
    const element = editorTextArray[index];
    element.innerHTML = textArray[index];
  }
  
  findDiv.remove();
}

function findText_(event) {
  const editorTxtLst = document.getElementsByClassName("editor-text");
  let textArray = [];
  for (let index = 0; index < editorTxtLst.length; index++) {
    const element = editorTxtLst[index];
    const content = element.textContent;

    textArray.push(content);
  }

  editorText = document.querySelector("#editor-text");
  let inpVal = findTextInput.value;
  editorInnerHtml = editorText.innerHTML;
  let editorInnerText = editorText.innerText;
  if (inpVal == "" || inpVal.trim().length == 0) {
    matchRes.innerText = `0 match`;
    
    const editorTextArray = document.getElementsByClassName("editor-text");
    const textArray = [];
    for (let index = 0; index < editorTextArray.length; index++) {
      const element = editorTextArray[index];
      textArray.push(element.textContent);
    }

    for (let index = 0; index < editorTextArray.length; index++) {
      const element = editorTextArray[index];
      element.innerHTML = textArray[index];
    }

    return;
  }
  eel.find_text(
    inpVal,
    textArray
  )(function (outputArray) {
    const textOutArray = outputArray[0];

    for (let index = 0; index < editorTxtLst.length; index++) {
      const element = editorTxtLst[index];
      element.innerHTML = textOutArray[index];
    }

    matchRes.innerText = `${outputArray[1]} match`;
  });
}
function enableEditing(event) {
  event.preventDefault();
  editorText.setAttribute("contenteditable", "true");
  eel.give_temp_txt()(function (text) {
    editorText.innerHTML = text;
  });
  warningDiv.remove();
}

function highlightDown(event) {
  event.preventDefault();
  // editorText = document.querySelector("#editor-text");
  const editorTextArray = document.getElementsByClassName("editor-text");
  let contentArray = [];

  for (let index = 0; index < editorTextArray.length; index++) {
    const element = editorTextArray[index];
    contentArray.push(element.innerHTML);
  }

  // console.log(editorInnerText);
  eel.highlight_down(contentArray)(function (outputArray) {
    for (let index = 0; index < editorTextArray.length; index++) {
      const element = editorTextArray[index];
      const content = outputArray[index];
      element.innerHTML = content;
    }

    let highlightedText = document.querySelector(".highlight-one");
    window.scroll(0, findPosition(highlightedText));
  });
}

function highlightUp(event) {
  event.preventDefault();
  // editorText = document.querySelector("#editor-text");
  const editorTextArray = document.getElementsByClassName("editor-text");
  let contentArray = [];

  for (let index = 0; index < editorTextArray.length; index++) {
    const element = editorTextArray[index];
    contentArray.push(element.innerHTML);
  }

  // console.log(editorInnerText);
  eel.highlight_up(contentArray)(function (outputArray) {
    for (let index = 0; index < editorTextArray.length; index++) {
      const element = editorTextArray[index];
      const content = outputArray[index];
      element.innerHTML = content;
    }

    let highlightedText = document.querySelector(".highlight-one");
    window.scroll(0, findPosition(highlightedText));
  });
}

function findPosition(obj) {
  var currenttop = 0;
  if (obj.offsetParent) {
    do {
      currenttop += obj.offsetTop;
    } while ((obj = obj.offsetParent));
    console.log;
    return [currenttop + 10];
  }
}

function findRepText(event) {
  event.preventDefault();

  const isFindDivOpen = sessionStorage.getItem("findDivOpen");
  if (isFindDivOpen === "true") {
    return;
  }
  if (document.body.contains(warningDiv)) {
    return;
  }

  body.insertAdjacentHTML("beforeend", findRepDivCode);
  findRepDiv = document.querySelector("#find-rep-div");
  findTextInp = document.querySelector("#find--text");
  repTextInp = document.querySelector("#replace--text");
  replaceAllBtn = document.querySelector("#replace-btn");
  findRepCloseBtn = document.querySelector("#close-img");
  matchRes = document.querySelector("#match-res");

  findTextInp.addEventListener("input", findRepText_);
  replaceAllBtn.addEventListener("click", replaceAll);
  findRepCloseBtn.addEventListener("click", closeFindRepDiv);

  sessionStorage.setItem("findRepDivOpen", "true");
}

function findRepText_(event) {
  // event.preventDefault();
  const editorTextArray = document.getElementsByClassName("editor-text");
  let textArray = [];

  for (let index = 0; index < editorTextArray.length; index++) {
    const element = editorTextArray[index];
    const content = element.textContent;

    textArray.push(content);
  }

  let inpVal = findTextInp.value;
  editorInnerHtml = editorText.innerHTML;
  // let editorInnerText = editorText.innerText;
  if (inpVal == "" || inpVal.trim().length == 0) {
    matchRes.innerText = `0 match`;
    
    const editorTextArray = document.getElementsByClassName("editor-text");
    const textArray = [];
    for (let index = 0; index < editorTextArray.length; index++) {
      const element = editorTextArray[index];
      textArray.push(element.textContent);
    }

    for (let index = 0; index < editorTextArray.length; index++) {
      const element = editorTextArray[index];
      element.innerHTML = textArray[index];
    }

    return;
  }
  eel.highlight(
    inpVal,
    textArray
  )(function (outputArray) {
    const textOutArray = outputArray[0];

    for (let index = 0; index < editorTextArray.length; index++) {
      const element = editorTextArray[index];
      element.innerHTML = textOutArray[index];
    }
    // editorText.innerHTML = outputArray[0];
    matchRes.innerText = `${outputArray[1]} match`;
  });
}

function replaceAll(event) {
  event.preventDefault();

  let textToReplace = repTextInp.value;
  let findTxt = findTextInp.value;

  const editorTextArray = document.getElementsByClassName("editor-text");
  let textArray = [];

  for (let index = 0; index < editorTextArray.length; index++) {
    const element = editorTextArray[index];
    const content = element.innerHTML;

    textArray.push(content);
  }

  eel.replace_all(
    textToReplace,
    findTxt,
    textArray
  )(function (outputTextArray) {
    // editorText.innerHTML = outputText;
    for (let index = 0; index < editorTextArray.length; index++) {
      const element = editorTextArray[index];
      element.innerHTML = outputTextArray[index];
    }
  });
}

function closeFindRepDiv(event) {
  event.preventDefault();

  const editorTextArray = document.getElementsByClassName("editor-text");
  const textArray = [];

  for (let index = 0; index < editorTextArray.length; index++) {
    const element = editorTextArray[index];
    textArray.push(element.textContent);
  }

  for (let index = 0; index < editorTextArray.length; index++) {
    const element = editorTextArray[index];
    element.innerHTML = textArray[index];
  }

  findRepDiv.remove();
  sessionStorage.removeItem("findRepDivOpen");
}

function addPage(event) {
  event.preventDefault();

  const isDeletePageDivOpen = sessionStorage.getItem("deletePageDivOpen");
  if (isDeletePageDivOpen === "true") {
    return;
  }

  console.log("Div!!! Yay");
  let templateListCode = "";

  templatesArray.forEach((element) => {
    const index = templatesArray.indexOf(element);
    templateListCode += `<ul class="temp-lst- temp-${index}">${element}</ul>`;
    console.log(element);
  });

  let templateDivCode = `
  <div class="template-lst">
        <img src="assets/image/black-close-icon.png" alt="" id="temp-close-icon">  
        <li class="temp-lst">
            <ul class="temp-lst-">Blank Document</ul>
            <p id="template-guide">Templates</p>
            ${templateListCode}
        </li>
    </div>
  `;

  body.insertAdjacentHTML("beforeend", templateDivCode);
  sessionStorage.setItem("addPageDivOpen", "true");

  const templateDiv = document.querySelector(".template-lst");
  const tempCloseBtn = document.querySelector("#temp-close-icon");
  tempCloseBtn.addEventListener("click", (event) => {
    templateDiv.remove();
    sessionStorage.removeItem("addPageDivOpen");
  });

  const tempLstElements = document.getElementsByClassName("temp-lst-");
  for (let index = 0; index < tempLstElements.length; index++) {
    const element = tempLstElements[index];
    console.log(element);
    element.addEventListener("click", addPage_);
  }
}

function addPage_(event) {
  event.preventDefault();
  let text = event.target.textContent;
  let id;

  if (text.toLowerCase() === "blank document") {
    id = "blank_doc";
  } else {
    let index = templatesArray.indexOf(text);
    id = templatesIdArray[index];
  }
  console.log(text, "here");

  eel.get_temp_txt(id)(function (text) {
    let textHtml = `
      <div class="editor">
         <pre class="editor-text" id="editor-text" contenteditable="true">${text}</pre>
      </div>
    `;

    editorParent.insertAdjacentHTML("beforeend", textHtml);
    const templateDiv = document.querySelector(".template-lst");
    templateDiv.remove();
    sessionStorage.removeItem("addPageDivOpen");
  });
}

function deletePage(event) {
  event.preventDefault();

  const isAddPageDivOpen = sessionStorage.getItem("addPageDivOpen");
  if (isAddPageDivOpen === "true") {
    return;
  }

  const editorTextArray = document.getElementsByClassName("editor-text");
  const lengthOfArray = editorTextArray.length;
  let pageElementArray = "";

  if (lengthOfArray == 1) {
    pageElementArray = "No pages to delete";
  } else {
    for (let index = 0; index < lengthOfArray; index++) {
      pageElementArray += `<ul class="page-lst- page-${index}">Page ${
        index + 1
      }</ul>`;
    }
  }
  let pageDelDivCode = `
  <div class="pages-lst">
        <img src="assets/image/black-close-icon.png" alt="" id="page-close-icon">  
        <li class="page-lst">
            ${pageElementArray}
        </li>
    </div>
  `;

  body.insertAdjacentHTML("beforeend", pageDelDivCode);
  sessionStorage.setItem("deletePageDivOpen", "true");

  const pageDelCloseBtn = document.querySelector("#page-close-icon");
  const pageDelDiv = document.querySelector(".pages-lst");
  pageDelCloseBtn.addEventListener("click", function (event) {
    event.preventDefault();
    pageDelDiv.remove();
    sessionStorage.removeItem("deletePageDivOpen");
  });

  const pageDelElements = document.getElementsByClassName("page-lst-");
  for (let index = 0; index < pageDelElements.length; index++) {
    const element = pageDelElements[index];
    element.addEventListener("click", deletePage_);
  }
}

function deletePage_(event) {
  event.preventDefault();

  const classLst = event.target.classList;
  const class_ = String(classLst[classLst.length - 1]);
  const indexNumArray = class_.split("-");
  const indexNum = indexNumArray[1];

  const pageDelDiv = document.querySelector(".pages-lst");

  const editorTextArray = document.getElementsByClassName("editor");
  editorTextArray[indexNum].remove();

  pageDelDiv.remove();
  sessionStorage.removeItem("deletePageDivOpen");
}
