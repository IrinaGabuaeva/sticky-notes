import "./App.css";
import { useDrag, useDrop } from "react-dnd";
import { useState, useEffect } from "react";

function Screen() {
  const [listOfNotes, setListOfNotes] = useState([]);
  console.log("listOfNotes", listOfNotes);
  const createNote = () => {
    const newNote = {
      position: {
        x: 0,
        y: 0,
      },
      text: "",
    };
    setListOfNotes((listOfNotes) => [...listOfNotes, newNote]);
  };

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

  return (
    <div className="Screen" ref={drop}>
      {listOfNotes
        ? listOfNotes.map((note, id) => {
            return <Note note={note} key={id} id={id} />;
          })
        : ""}

      <button onClick={() => createNote()}>New Note</button>
    </div>
  );
}

function Note(props) {
  console.log("props", props);
  const { x, y, text } = props.note.position;
  const [noteText, setText] = useState("");
  const [clicked, setClicked] = useState(false);
  console.log("clicked", clicked);
  console.log("x, y:", x, y);
  const id = props.id;
  const [, drag] = useDrag(() => ({
    type: "NOTE",
    item: { id, noteText },
  }));

  console.log("drag", drag);
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
          onBlur={() => setClicked(false)}
        />
      ) : (
        <div className="NoteText">{noteText}</div>
      )}
    </div>
  );
}

export default Screen;
