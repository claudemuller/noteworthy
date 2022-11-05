let hasSelection = false;

window.addEventListener("mousedown", (event) => {
  hasSelection = document.getSelection().toString().length;
});

window.addEventListener("mouseup", (e) => {
  if (hasSelection) {
    const selection = window.getSelection();
    const selectionText = selection.toString();
    const selectionLen = selectionText.length;
    const targetContainsSelection = selection.containsNode(e.target, true);

    if (selectionLen > 0 && targetContainsSelection) {
      const noteRef = saveNote(selectionText);
      openNote(noteRef, selectionText, e.offsetX, e.offsetY);
    }
  }
});

function saveNote(text) {
  const ref = Date.now();
  const note = { text };
  localStorage.setItem(ref, JSON.stringify(note));
  return ref;
}

function openNote(noteRef, text, x, y) {
  const container = document.createElement("div");
  container.setAttribute("id", "noteworthy-note");
  container.style.position = "absolute";
  container.style.left = `${x}px`;
  container.style.top = `${y}px`;
  container.style.padding = "10px";
  container.style.width = "400px";
  container.style.height = "200px";
  container.style.background = "white";
  container.style.color = "black";
  container.style.boxShadow = "3px 3px 5px black";
  container.style.overflow = "hidden";

  const inner = document.createElement("div");
  inner.setAttribute("id", "noteworthy-note-inner");

  const note = document.createElement("div");
  note.style.paddingBottom = "10px";
  note.style.marginBottom = "10px";
  note.style.fontSize = "0.9rem";
  note.style.color = "#999";
  note.style.borderBottom = "1px solid #eee";
  note.style.fontStyle = "italic";
  note.innerText = `{ ${text} }`;

  const textInput = document.createElement("textarea");
  textInput.style.width = "100%";
  textInput.style.height = "150px";

  const saveBtn = document.createElement("button");
  saveBtn.addEventListener("click", (e) => {
    const note = JSON.parse(localStorage.getItem(noteRef));
    note.note = textInput.value;
    localStorage.setItem(noteRef, JSON.stringify(note));

    fetch("http://127.0.0.1:8888", {
      method: "POST",
      data: note,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        localStorage.removeItem(noteRef);
        container.remove();
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  });
  saveBtn.innerText = "Save";

  inner.appendChild(note);
  inner.appendChild(textInput);
  inner.appendChild(saveBtn);

  container.appendChild(inner);
  document.getElementsByTagName("body")[0].appendChild(container);

  container.style.height = `${inner.offsetHeight + 15}px`;
}
