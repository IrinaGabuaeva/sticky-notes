import "./App.css";
import { useDrag, useDrop } from "react-dnd";
import { useState, useEffect, useRef } from "react";

function Screen() {
  const defaultList =
    JSON.parse(window.localStorage.getItem("listOfNotes")) ?? [];
  let [listOfNotes, setLocalList] = useState(defaultList);
  const listOfNotesRef = useRef(listOfNotes);

  const setListOfNotes = (listOfNotes) => {
    window.localStorage.setItem("listOfNotes", JSON.stringify(listOfNotes));
    listOfNotesRef.current = listOfNotes;
    setLocalList(listOfNotes);
  };

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
    setListOfNotes(newList);
  };

  const clearAll = () => {
    setListOfNotes([]);
  };
  const saveText = (id, text) => {
    const newList = [...listOfNotes];
    newList[id].text = text;
    setListOfNotes(newList);
  };
  return (
    <div className="Screen" ref={drop}>
      <h3 className="Text">
        Double click anywhere on the screen to create a note
      </h3>
      {listOfNotes
        ? listOfNotes.map((note, id) => {
            return (
              <Note
                note={note}
                key={id}
                id={id}
                deleteNote={deleteNote}
                saveText={saveText}
              />
            );
          })
        : ""}
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
  console.log("PROPS", props);
  const { x, y } = props.note.position;
  const { text } = props.note;
  console.log("text", text);
  const id = props.id;
  console.log("id", id);
  const [noteText, setText] = useState(text);
  const [clicked, setClicked] = useState(false);
  console.log("noteText", noteText);
  const [, drag] = useDrag(() => ({
    type: "NOTE",
    item: { id, noteText },
  }));

  const saveText = () => {
    console.log("BLURR");
    setClicked(false);
    props.saveText(id, noteText);
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
          onMouseLeave={() => saveText()}
        />
      ) : (
        <div className="NoteText">{noteText}</div>
      )}
      <button className="DeleteButton" onClick={() => props.deleteNote(id)}>
        X
      </button>
    </div>
  );
}
export default Screen;
