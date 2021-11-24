import "./App.css";
import { useDrop } from "react-dnd";
import { useState } from "react";
import Note from "./Note";
import Canvas from "./Canvas";
import { colors } from "./Colors";

export default function Screen() {
  const defaultList =
    JSON.parse(window.localStorage.getItem("listOfNotes")) ?? {};

  const [listOfNotes, setListOfNotes] = useState(defaultList);
  const [defaultBgColor, setDefaultBgColor] = useState("#0db9a1");
  const [isDrawingOn, setIsDrawingOn] = useState(false);
  const [pencilColor, setPencilColor] = useState(colors.teal);
  const [pencilWidth, setPencilWidth] = useState(5);

  const updateState = (list) => {
    window.localStorage.setItem("listOfNotes", JSON.stringify(list));
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
      bgColor: defaultBgColor,
    };

    const newList = {
      ...listOfNotes,
      [currentId.toString()]: newNote,
    };
    updateState(newList);
    currentId++;
  };

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
    setDefaultBgColor(color);
  };

  const toggle = () => {
    isDrawingOn ? setIsDrawingOn(false) : setIsDrawingOn(true);
  };
  const changePencil = (color) => {
    setPencilColor(color);
    setPencilWidth(5);
  };
  const startEraser = () => {
    setPencilColor("#f5f4f1");
    setPencilWidth(10);
  };

  return (
    <div
      className="Screen"
      ref={drop}
      onDoubleClick={(e) => createNote(e.clientX, e.clientY)}
    >
      <h3 className="Text">
        Double click anywhere on the screen to create a note
      </h3>
      {isDrawingOn && (
        <>
          <Canvas pencilColor={pencilColor} pencilWidth={pencilWidth} />
          <div className="Colors">
            {Object.values(colors).map((color) => {
              return (
                <div
                  key={color}
                  className="Circle"
                  style={{ background: color }}
                  onClick={() => changePencil(color)}
                />
              );
            })}
            <button
              className="DeleteButton"
              style={{
                border: "1px solid grey",
                left: "100%",
                bottom: "40%",
                width: "70px",
              }}
              onClick={() => startEraser()}
            >
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
