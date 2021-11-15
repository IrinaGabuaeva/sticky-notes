import "./App.css";
import { useDrag, useDrop } from "react-dnd";
import { useState, useEffect, useRef } from "react";

function Screen() {
  const defaultList =
    JSON.parse(window.localStorage.getItem("listOfNotes")) ?? [];
  console.log("defaultList", defaultList);
  let [listOfNotes, setLocalList] = useState(defaultList);
  console.log("listOfNotes", listOfNotes);
  console.log("string version", JSON.stringify(listOfNotes));

  const listOfNotesRef = useRef(listOfNotes);

  const setListOfNotes = (listOfNotes) => {
    console.log("list!!!!", listOfNotes);
    window.localStorage.setItem("listOfNotes", JSON.stringify(listOfNotes));
    listOfNotesRef.current = listOfNotes;
    setLocalList(listOfNotes);
  };

  const createNote = (x, y) => {
    console.log("X, Y", x, y);
    x -= 125;
    y -= 125;
    const newNote = {
      position: {
        x,
        y,
      },
      text: "",
    };
    console.log("Add new note!!", [...listOfNotes, newNote]);
    console.log("LIST IN CREATE NEW NOTE", listOfNotes);
    setListOfNotes([...listOfNotesRef.current, newNote]);
  };

  useEffect(() => {
    const setFromEvent = (e) => createNote(e.clientX, e.clientY);
    window.addEventListener("dblclick", setFromEvent);
    return () => {
      window.removeEventListener("dblclick", setFromEvent);
    };
  }, []);

  const moveNote = (id, position) => {
    const newList = [...listOfNotes];
    newList[id].position = position;
    console.log("newList", newList);
    setListOfNotes(newList);
  };

  const [, drop] = useDrop(
    () => ({
      accept: "NOTE",
      drop: (item, monitor) => {
        const position = monitor.getSourceClientOffset();
        moveNote(item.id, position, item.noteText);
      },
    }),
    [moveNote]
  );

  const deleteNote = (id) => {
    const newList = listOfNotes
      .slice(0, id)
      .concat(listOfNotes.slice(id + 1, listOfNotes.length));
    console.log("id", id);
    console.log("newList", newList);
    setListOfNotes(newList);
  };

  const clearAll = () => {
    setListOfNotes([]);
  };
  return (
    <div className="Screen" ref={drop}>
      <h3>Double click anywhere on the screen to create a note :)</h3>
      <button style={{ height: "30px" }} onClick={() => clearAll()}>
        Clear All
      </button>
      {listOfNotes
        ? listOfNotes.map((note, id) => {
            return (
              <Note note={note} key={id} id={id} deleteNote={deleteNote} />
            );
          })
        : ""}
    </div>
  );
}

function Note(props) {
  console.log("props", props);
  const { x, y, text } = props.note.position;
  const [noteText, setText] = useState(text);
  const [clicked, setClicked] = useState(false);
  console.log("clicked", clicked);
  const id = props.id;
  const [, drag] = useDrag(() => ({
    type: "NOTE",
    item: { id, noteText },
  }));

  return (
    <div
      className="Note"
      style={{ left: `${x}px`, top: `${y}px` }}
      ref={drag}
      onClick={() => setClicked(true)}
    >
      <button onClick={() => props.deleteNote(id)}>X</button>

      {clicked ? (
        <textarea
          className="NoteText"
          value={noteText}
          autoFocus
          onFocus={(e) => {
            let val = e.target.value;
            e.target.value = "";
            e.target.value = val;
          }}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => setClicked(false)}
        />
      ) : (
        <div className="NoteText">{noteText}</div>
      )}
    </div>
  );
}
export default Screen;
