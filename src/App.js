import "./App.css";
import { useDrop } from "react-dnd";
import { useState, useEffect, useRef } from "react";
import Note from "./Note";

export default function Screen() {
  const defaultList =
    JSON.parse(window.localStorage.getItem("listOfNotes")) ?? {};

  const [listOfNotes, setListOfNotes] = useState(defaultList);
  console.log("LIST:::", listOfNotes);
  const listOfNotesRef = useRef(listOfNotes);
  const [defaultBgColor, setDefaultBgColor] = useState("#0db9a1");
  const defaultBgColorRef = useRef(defaultBgColor);
  console.log("COLOR!!", defaultBgColorRef);

  const updateState = (list) => {
    window.localStorage.setItem("listOfNotes", JSON.stringify(list));
    listOfNotesRef.current = list;
    setListOfNotes(list);
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
      bgColor: defaultBgColorRef.current,
    };
    console.log("NEW NOTE COLOR", newNote.bgColor);
    const newList = {
      ...listOfNotesRef.current,
      [currentId.toString()]: newNote,
    };
    updateState(newList);
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
    updateState(newList);
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
    updateState(newList);
  };

  const clearAll = () => {
    updateState({});
  };

  const saveText = (id, text) => {
    const newList = { ...listOfNotes };
    newList[id].text = text;
    updateState(newList);
  };

  const changeBgColor = (id, color) => {
    const newList = { ...listOfNotes };
    newList[id].bgColor = color;
    updateState(newList);
    defaultBgColorRef.current = color;
    const newColor = defaultBgColorRef.current;
    console.log("DEFAULT COLOR REF", defaultBgColorRef.current);
    setDefaultBgColor(newColor);
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
            changeBgColor={changeBgColor}
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
