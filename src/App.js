import "./App.css";
import { useDrop } from "react-dnd";
import { useState, useEffect, useRef } from "react";
import Note from "./Note";
import Canvas from "./Canvas";

export default function Screen() {
  const defaultList =
    JSON.parse(window.localStorage.getItem("listOfNotes")) ?? {};

  const [listOfNotes, setListOfNotes] = useState(defaultList);
  const listOfNotesRef = useRef(listOfNotes);
  const [defaultBgColor, setDefaultBgColor] = useState("#0db9a1");
  const [isDrawingOn, setIsDrawingOn] = useState(false);
  const defaultBgColorRef = useRef(defaultBgColor);

  const colors = {
    teal: "#0db9a1",
    purple: "#6610f2",
    blue: "#007bff",
    pink: "#ef476f",
    yellow: "#ffc145",
  };
  const [pencilColor, setPencilColor] = useState(colors.teal);
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
    setDefaultBgColor(newColor);
  };

  const toggle = () => {
    isDrawingOn ? setIsDrawingOn(false) : setIsDrawingOn(true);
  };
  return (
    <div
      className="Screen"
      ref={drop}
      // onDoubleClick={(e) => createNote(e.clientX, e.clientY)}
    >
      <h3 className="Text">
        Double click anywhere on the screen to create a note
      </h3>
      {isDrawingOn && (
        <>
          <Canvas pencilColor={pencilColor} />
          <div className="Colors">
            {Object.values(colors).map((color) => {
              return (
                <div
                  key={color}
                  className="Circle"
                  style={{ background: color }}
                  onClick={() => setPencilColor(color)}
                />
              );
            })}
            <button onClick={() => setPencilColor("rgba(255, 193, 69, 0.055)")}>
              Eraser
            </button>
          </div>
        </>
      )}
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
        className="Button"
        style={{ left: "37%" }}
        onClick={() => clearAll()}
      >
        Clear All Notes
      </button>

      <button
        className="Button"
        style={{ right: "37%" }}
        onClick={() => toggle()}
      >
        {!isDrawingOn ? `Draw` : `Stop Drawing`}
      </button>
    </div>
  );
}
