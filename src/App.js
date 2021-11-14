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
    newList[id] = position;
    setListOfNotes(newList);
  };

  const [{ getItem, didDrop, getSourceClientOffset }, drop] = useDrop(
    () => ({
      accept: "NOTE",
      drop: (item, monitor) => {
        // console.log(
        //   "monitor.getSourceClientOffset()",
        //   monitor.getSourceClientOffset()
        // );
        const coordinates = monitor.getSourceClientOffset();
        console.log("coordinates", coordinates);
        // setListOfNotes((listOfNotes[item.id] = coordinates));
        console.log("LIST", listOfNotes[item.id]);
        moveNote(item.id, coordinates);
      },
      // collect: (monitor) => ({
      //   didDrop: !!monitor.didDrop(),
      //   getItem: monitor.getItem(),
      //   getSourceClientOffset: monitor.getSourceClientOffset(),
      // }),
    }),
    [moveNote]
  );

  console.log("item!!", getItem);
  console.log("didDrop", didDrop);

  // console.log("getClientOffset", getClientOffset);
  console.log("getSourceClientOffset()", getSourceClientOffset);

  // useEffect(() => {
  //   const position = {};
  //   const setFromEvent = (e) =>
  //     console.log("IN USE EFFECT", { x: e.clientX, y: e.clientY });

  //   window.addEventListener("mousemove", setFromEvent);
  //   return () => {
  //     window.removeEventListener("mousemove", setFromEvent);
  //   };
  // }, [didDrop]);

  return (
    <div className="Screen" ref={drop}>
      {didDrop ? moveNote(getItem.id, getSourceClientOffset) : ""}
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
  // console.log("props", props);
  const { x, y, text } = props.note;
  const id = props.id;
  const [, drag] = useDrag(() => ({
    type: "NOTE",
    item: { id },

    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  // console.log("monitor on draggable", monitor);
  // console.log("item on draggable", item);
  // console.log("collect on draggable", collect);
  console.log("drag", drag);
  return (
    <div className="Note" style={{ left: `${x}px`, top: `${y}px` }} ref={drag}>
      {text}
    </div>
  );
}

export default Screen;
