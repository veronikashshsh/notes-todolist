const noteForm = document.getElementById("noteForm");
const noteContent = document.getElementById("noteContent");
const chosenSection = document.getElementById("chosenSection");

// Функція створення нотатки
function createNoteElement(content, section, date) {
  const noteItem = document.createElement("li");
  noteItem.innerHTML = `
    <div class="note-item">
      <div class="note-header">
        <span class="note-section">${section}</span>
        <span class="note-date">${date}</span>
      </div>
      <br>
      <div class="note-content" >${content}</div>
      <button class="delete-btn" title="Done">&#10004;</button>
    </div>
  `;

  noteItem.querySelector(".delete-btn").addEventListener("click", () => {
    let notes = JSON.parse(localStorage.getItem("todoListData")) || [];
    notes = notes.filter(note => {
      const isSameNote =
        note.content === content &&
        note.section === section &&
        note.date === date

        return !isSameNote; // Фільтруємо нотатку, яку потрібно видалити
    }
      );
    localStorage.setItem("todoListData", JSON.stringify(notes)); 
    noteItem.remove(); // Видаляємо нотатку з DOM

    loadNotes(noteItemf); // Оновлюємо список нотаток
  });

  return noteItem;
}

noteForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const content = noteContent.value.trim();
  const date = new Date().toLocaleDateString();
  const section = chosenSection.value;

  if (!content || !section) {
    alert("Please fill in all fields.");
    return;
  }

  const noteForAll = createNoteElement(content, section, date);
  const noteForSection = createNoteElement(content, section, date);

  document.getElementById("notesList-all").prepend(noteForAll);
  document.getElementById(`notesList-${section}`).prepend(noteForSection);

  noteContent.value = "";
  chosenSection.value = "work"; 
  saveNotes(); 
});


// Функція для фільтрації нотаток за секцією
const navLinks = document.querySelectorAll(".nav-list a"); // Отримуємо всі навігаційні посилання
const sections = ["all", "work", "study", "home"]; // Список всіх секцій

// Спочатку показати тільки "all"
showSection("all");

// Вішай події на навігаційні посилання
navLinks.forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault(); // зупиняємо перехід по посиланню
    const target = this.getAttribute("href").substring(1); // Отримуємо ID секції з href
    showSection(target); // Показуємо відповідну секцію
  });
});

function showSection(sectionToShow) {
  sections.forEach(section => {
    const el = document.getElementById(section);
    if (section === sectionToShow) {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const themeSwitch = document.getElementById("themeSwitch");

  if (!themeSwitch) {
    console.error("themeSwitch не знайдено");
    return;
  }

  themeSwitch.addEventListener("change", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeSwitch.checked = true;
  }

  loadNotes(); 
});


function saveNotes() {
  const notes = [];
  const allNotes = document.querySelectorAll("#notesList-all .note-item");
  
  allNotes.forEach(note => { // Проходимо по всіх нотатках
    const content = note.querySelector(".note-content").textContent;
    const section = note.querySelector(".note-section").textContent;
    const date = note.querySelector(".note-date").textContent;

    notes.push({content, section, date }); 
  });

  localStorage.setItem("todoListData", 
    JSON.stringify(notes)); 
}

function loadNotes() {
  const notes = JSON.parse(localStorage.getItem("todoListData")) || [];

  notes.forEach(note => {
    const {content, section, date } = note;

    const noteForAll = createNoteElement(content, section, date);
    const noteForSection = createNoteElement(content, section, date);

    document.getElementById("notesList-all").prepend(noteForAll);
    document.getElementById(`notesList-${section}`).prepend(noteForSection);

  });
}