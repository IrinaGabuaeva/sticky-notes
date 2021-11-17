import "./App.css";
import { useDrag, useDrop } from "react-dnd";
import { useState, useEffect, useRef } from "react";

function Screen() {
  const defaultList =
    JSON.parse(window.localStorage.getItem("listOfNotes")) ?? {};

  const [listOfNotes, setListOfNotes] = useState(defaultList);
  const listOfNotesRef = useRef(listOfNotes);

  const setAllNotes = (list) => {
    window.localStorage.setItem("listOfNotes", JSON.stringify(list));
    // listOfNotesRef.current = list;
  };

  const noteIds = Object.keys(listOfNotes);
  const lastNoteId = noteIds[noteIds.length - 1];
  let currentId = lastNoteId ? parseInt(lastNoteId) + 1 : 1;
  const createNote = (x, y) => {
    x -= 125;
    y -= 125;
    const newNote = {
      position: {
        x,
        y,
      },
      text: "",
    };
    listOfNotesRef.current[currentId.toString()] = newNote;
    setAllNotes(listOfNotesRef.current);
    setListOfNotes((prev) => ({ ...prev, [currentId.toString()]: newNote }));
    currentId++;
  };

  useEffect(() => {
    const setFromEvent = (e) => createNote(e.clientX, e.clientY);
    window.addEventListener("dblclick", setFromEvent);
    return () => {
      window.removeEventListener("dblclick", setFromEvent);
    };
  }, []);

  const moveNote = (id, position) => {
    const newList = { ...listOfNotes };
    newList[id].position = position;
    setListOfNotes(newList);
  };

  const [, drop] = useDrop(
    () => ({
      accept: "NOTE",
      drop: (item, monitor) => {
        const position = monitor.getSourceClientOffset();
        moveNote(item.id, position);
      },
    }),
    [moveNote]
  );

  const deleteNote = (id) => {
    delete listOfNotes[id];
    const newList = { ...listOfNotes };
    setListOfNotes(newList);
    setAllNotes(newList);
  };

  const clearAll = () => {
    setListOfNotes({});
    setAllNotes({});
  };

  const saveText = (id, text) => {
    const newList = { ...listOfNotes };
    newList[id].text = text;
    setListOfNotes(newList);
    setAllNotes(newList);
  };

  return (
    <div className="Screen" ref={drop}>
      <h3 className="Text">
        Double click anywhere on the screen to create a note
      </h3>
      {console.log("listOfNotes in render", listOfNotes)}
      {Object.keys(listOfNotes).map((id) => {
        return (
          <Note
            id={id}
            note={listOfNotes[id]}
            key={id}
            deleteNote={deleteNote}
            saveText={saveText}
          />
        );
      })}
      <button
        className="ClearButton"
        style={{ height: "30px" }}
        onClick={() => clearAll()}
      >
        Clear All
      </button>
    </div>
  );
}

function Note(props) {
  console.log("Props:", props);
  const { x, y } = props.note.position;
  const { text } = props.note;
  const { id } = props;

  const [noteText, setText] = useState(text);
  const [clicked, setClicked] = useState(false);

  const [, drag] = useDrag(() => ({
    type: "NOTE",
    item: { id, noteText },
  }));

  const saveText = () => {
    setClicked(false);
    props.saveText(id, noteText);
  };

  const deleteNote = (id) => {
    props.deleteNote(id);
  };

  return (
    <div
      className="Note"
      style={{ left: `${x}px`, top: `${y}px` }}
      ref={drag}
      onClick={() => setClicked(true)}
    >
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
          onBlur={() => saveText()}
        />
      ) : (
        <div className="NoteText">{noteText}</div>
      )}
      <button className="DeleteButton" onClick={() => deleteNote(id)}>
        X
      </button>
    </div>
  );
}
export default Screen;
