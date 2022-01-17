import './App.css';
import {useEffect, useState} from 'react'
import Note from './components/Note.js'
import NoteList from './components/NotesList.js'
import findHashtags from './findHashtags.js'

function App() {

  const [notesArray, setNotesArray] = useState();
  const [editButtonPressed, setEditButtonPressed] = useState(false);
  const [addButtonPressed, setAddButtonPressed] = useState(false);
  const [choosenNote, setChoosenNote] = useState();
  const [tagsArray, setTagsArray] = useState([]);
  const [shouldbeSorted, setShouldbeSorted] = useState(false);
  const [sortedNotes, setSortedNotes] = useState([]);

  const callBackendAPI = async () => {
    const response = await fetch('https://notes-app-serv.herokuapp.com/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };

  const listOfTags = tagsArray.map((tag, index) => {
    return (
      <li key={index}>
        <span onClick={handleHashTagClick}>{tag}</span>
        <span onClick={handleDeleteTagClick}>&#10006;</span>
      </li>
    )
  });

  useEffect(() => {
    callBackendAPI()
      .then((res) => {
        setNotesArray(JSON.parse(res.data)["notesArray"]);
        setTagsArray(JSON.parse(res.data)["tagsArray"])
      })
      .catch(err => console.log(err));
  }, [])

  function handleEditClick(noteId) {
    setEditButtonPressed(true);
    const choosenNoteData = notesArray.find(item => {
      return item.noteId === noteId
    });
    setChoosenNote(choosenNoteData);
  }

  function handleDeleteClick(noteId) {
    const action = 'delete';
    updateJSON(action, noteId, undefined, tagsArray);
  }

  function handleSaveClick(noteData, noteId, action) {
    let uniqueTagsFromNote;
    const tagsArrayCopy = tagsArray.slice();
    if(findHashtags(noteData)) {
      uniqueTagsFromNote = Array.from(new Set(findHashtags(noteData)));
      choosenNote.noteTags = uniqueTagsFromNote;
      uniqueTagsFromNote.forEach((tag) => {
        if(tagsArray.indexOf(tag) === -1){
          tagsArrayCopy.push(tag);
        }
      });
    }
    setEditButtonPressed(false);
    setAddButtonPressed(false);
    choosenNote.noteData = noteData;
    updateJSON(action, noteId, choosenNote, tagsArrayCopy);
  }

  function updateJSON(action, noteId, choosenNote, tagsArrayCopy) {
    const currentNote = notesArray.find(item => {
      return item.noteId === noteId
    });
    const notesArrayCopy = notesArray.slice();
    const sortedNotesCopy = sortedNotes.slice();
    if(action === 'edit') {
      if (shouldbeSorted) {
        sortedNotesCopy.splice(sortedNotesCopy.indexOf(currentNote), 1, choosenNote);
      }
      notesArrayCopy.splice(notesArrayCopy.indexOf(currentNote), 1, choosenNote);
    } else if(action === 'delete') {
      if(shouldbeSorted) {
        sortedNotesCopy.splice(sortedNotesCopy.indexOf(currentNote), 1);
      }
      notesArrayCopy.splice(notesArrayCopy.indexOf(currentNote), 1);
    } else if(action === 'add') {
      notesArrayCopy.push(choosenNote);
    }
    setSortedNotes(sortedNotesCopy);
    sendData(notesArrayCopy, tagsArrayCopy);
  }

  function sendData(notesArrayCopy, tagsArrayCopy) {
    const newJson = {
      notesArray: notesArrayCopy,
      tagsArray: tagsArrayCopy
    }
    const requestOptions = {
      method: 'POST',
      headers: {
                'Content-Type': 'application/json',
                },
      body: JSON.stringify(newJson)
    };
    fetch('https://notes-app-serv.herokuapp.com/express_backend_delete', requestOptions)
      .then(response => response.json())
      .then(data => {
        setNotesArray(data['notesArray']);
        setTagsArray(data['tagsArray']);
      });
  }

  function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  function handleAddClick() {
    setChoosenNote({
      noteData: '',
      noteId: randomInteger(3, 10000),
      noteTags: []
    });
    setAddButtonPressed(true);
  }

  function handleHashTagClick(event) {
    setShouldbeSorted(true);
    const hashtag = event.target.textContent;
    const notesWithCurrentTags = [];
    notesArray.forEach((item) => {
      if(item.noteTags.indexOf(hashtag) !== -1) {
        notesWithCurrentTags.push(item);
      }
    });
    setSortedNotes(notesWithCurrentTags);
  }

  function handleShowAllClick() {
    setShouldbeSorted(false);
  }

  function handleDeleteTagClick(event) {
    const tagForRemoving = event.target.previousSibling.textContent;
    const tagsArrayCopy = tagsArray.slice();
    const notesArrayCopy = notesArray.slice();
    tagsArrayCopy.splice(tagsArrayCopy.indexOf(tagForRemoving), 1);
    notesArrayCopy.forEach((item) => {
      if(item.noteTags.indexOf(tagForRemoving) !== -1) {
        const noteTagsArray = item.noteTags.slice();
        noteTagsArray.splice(noteTagsArray.indexOf(tagForRemoving), 1);
        item.noteTags = noteTagsArray;
      }
    });
    sendData(notesArrayCopy, tagsArrayCopy);
  }

  let notesData = shouldbeSorted ? sortedNotes : notesArray;

  return (
    <div className="App">
      <span onClick={handleShowAllClick} className='showall-button'>Show all notes </span>
      <span>Filter by hashtags:</span>
      <ul className='tags'>
        {listOfTags}
      </ul>
      {!(notesArray === undefined) &&
        <NoteList
          notesArray={notesData}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}/>
      }
      {(editButtonPressed || addButtonPressed) &&
        <Note
          noteData={choosenNote}
          handleSaveClick={handleSaveClick}
          action={editButtonPressed ? 'edit' : 'add'}/>
      }
      <button
        type='button'
        className='addbutton'
        onClick={handleAddClick}>+</button>
    </div>
  );
}

export default App;
