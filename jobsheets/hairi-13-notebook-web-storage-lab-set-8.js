var titleInput = document.getElementById("noteTitle");
var textInput = document.getElementById("noteText");
var message = document.getElementById("message");
var count = document.getElementById("count");
var noteList = document.getElementById("noteList");
var notes = [];

function loadNotes() {
  var saved = localStorage.getItem("notes");
  if (saved !== null) {
    notes = JSON.parse(saved);
  }
}

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function showMessage(text) {
  message.textContent = text;
  setTimeout(function () {
    message.textContent = "";
  }, 1500);
}

function renderNotes() {
  noteList.innerHTML = "";
  notes.forEach(function (note, index) {
    var box = document.createElement("div");
    box.className = "note";

    var h3 = document.createElement("h3");
    h3.textContent = note.title;

    var p = document.createElement("p");
    p.textContent = note.text;

    var small = document.createElement("small");
    small.textContent = note.date;

    var del = document.createElement("button");
    del.className = "del";
    del.textContent = "Delete";
    del.addEventListener("click", function () {
      notes.splice(index, 1);
      saveNotes();
      renderNotes();
    });

    box.appendChild(h3);
    box.appendChild(p);
    box.appendChild(small);
    box.appendChild(del);
    noteList.appendChild(box);
  });
  count.textContent = notes.length + " note(s) saved";
}

document.getElementById("saveBtn").addEventListener("click", function () {
  var title = titleInput.value.trim();
  var text = textInput.value.trim();
  if (title === "" || text === "") {
    showMessage("Please fill in the title and the note.");
    return;
  }
  notes.push({ title: title, text: text, date: new Date().toLocaleString() });
  saveNotes();
  renderNotes();
  titleInput.value = "";
  textInput.value = "";
  showMessage("Note saved!");
});

document.getElementById("clearBtn").addEventListener("click", function () {
  notes = [];
  localStorage.removeItem("notes");
  renderNotes();
  showMessage("All notes deleted.");
});

function applyTheme() {
  document.body.classList.toggle("dark", localStorage.getItem("theme") === "dark");
}

document.getElementById("themeBtn").addEventListener("click", function () {
  var newTheme = localStorage.getItem("theme") === "dark" ? "light" : "dark";
  localStorage.setItem("theme", newTheme);
  applyTheme();
});

loadNotes();
renderNotes();
applyTheme();
