import { useDrag } from "react-dnd";
import { useState } from "react";
import { colors } from "./Colors";

export default function Note(props) {
  console.log("Props:", props);
  const { x, y } = props.note.position;
  const { text, bgColor } = props.note;
  const { id } = props;

  const [noteText, setText] = useState(text);
  const [clicked, setClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
      style={{ left: `${x}px`, top: `${y}px`, backgroundColor: bgColor }}
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
      {!isHovered ? (
        <div
          className="Circle"
          style={{
            position: "absolute",
            bottom: "2%",
            left: "9%",
          }}
          onMouseOver={() => setIsHovered(true)}
        />
      ) : (
        <div className="Colors" onMouseLeave={() => setIsHovered(false)}>
          {Object.values(colors).map((color) => {
            return (
              <div
                key={color}
                className="Circle"
                style={{ background: color }}
                onClick={() => props.changeBgColor(id, color)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
