let saveBtn = document.querySelector("#save-file-btn");
let fileChooser = document.querySelector("#file-select");
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

backBtn.addEventListener("click", function (event) {
  event.preventDefault();
  let backOpen = sessionStorage.getItem("backOpen");
  if (backOpen == "true") {
    sessionStorage.setItem("isBack", "true");
    window.location = "../editor.html";
  }
});

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

let fileText;
saveBtn.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("Working..");
  let dropDownVal = fileChooser.value;
  if (dropDownVal == "wmail") {
    fileText = sessionStorage.getItem("editorParentInnerHTML");
    
    if (fileText == null || fileText == undefined) {
      eel.show_file_error()(function (){});
      return ;
    }

    eel.save_file(
      fileText,
      "wmail"
    )((fileName) => {
      sessionStorage.setItem("fileName", fileName);
      sessionStorage.setItem("isBack", "true");
      sessionStorage.setItem("isSaved", "true");
      window.location = "../editor.html";
    });
  }
  if (dropDownVal == "txt") {
    fileText = sessionStorage.getItem("editorParentInnerText");

    if (fileText == null || fileText == undefined) {
      eel.show_file_error()(function () {});
      return;
    }

    eel.save_file(
      fileText,
      "txt"
    )((fileName) => {
      sessionStorage.setItem("fileName", fileName);
      sessionStorage.setItem("isBack", "true");
      sessionStorage.setItem("isSaved", "true");
      window.location = "../editor.html";
    });
  }
});
