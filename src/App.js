import './App.css';
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { HTML5Backend } from "react-dnd-html5-backend";
import {useState} from 'react'

function Screen() {
  const [listOfNotes, setListOfNotes] = useState([
    {
    position: {
      x: 0,
      y: 0,
    },
    text: "Hello"
  },
    {
      position: {
        x: 200,
        y: 60,
      },
      text: "" 
    },
    {
      position: {
        x: 100,
        y: 100,
      },
      text: "" 
    }
  ])
  console.log("listOfNotes", listOfNotes)
  const createNote = () => {
    const newNote = {
      position: {
        x: 0,
        y: 0,
      },
      text: ""
    }
   setListOfNotes(listOfNotes => [...listOfNotes, newNote])
  }

  return (
    <div className="Screen">
      {listOfNotes ? listOfNotes.map((note, id) => {
      return (<Note note={note} key={id} />)
    }): ""}
      
      <button onClick={() => createNote()}>New Note</button>
    </div>
  );
}

function Note(props) {
  console.log("props", props)
  const {position, text} = props.note
  return (
    <div className="Note" style={{ left: `${position.x}px`, top: `${position.y}px`}}>{text}</div>
  )
}
export default Screen;
