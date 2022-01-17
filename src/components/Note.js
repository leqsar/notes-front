import TagsList from './TagsList.js'
import {useState} from 'react'
import findHashtags from '../findHashtags.js'

function Note(props) {
  let initialNoteData = props.noteData.noteData;
  const [noteData, setNoteData] = useState(initialNoteData);
  const [noteTags, setNoteTags] = useState(props.noteData.noteTags);
  const [isEditable, setIsEditable] = useState(false);

  function handleChange(event) {
    setNoteData(event.target.value);
  }

  function findTags() {
    if(noteData !== '') {
      const tags = noteTags;
      const arr = noteData.split(' ');
      const value = arr.map((word, index) => {
        if(tags.indexOf(word) !== -1) {
          return <mark key={index}>{word}</mark>
        } else {
          return ' '+word+' '
        }
      })
      return value;
    } else {
      return ' '
    }
  }

  function handlePreviewClick(event) {
    setIsEditable(true);
  }

  function handleClick(event) {
    setNoteTags(findHashtags(noteData));
    if(event.target.className !== 'textarea' && event.target.className !== 'preview') {
      setIsEditable(false);
    }
  }

  const previewNoteElem =
    <div
      className='preview'
      onClick={handlePreviewClick}>
      {findTags()}
    </div>;

  return (
    <div className='note' onClick={handleClick}>
      {isEditable ?
        <textarea
          placeholder='Enter your note'
          autoFocus
          onChange={handleChange}
          value={noteData}
          className='textarea'
        ></textarea> :
        previewNoteElem
      }
      <TagsList
        tagsArray={noteTags}/>
      <button
        type='button'
        onClick={() => {
                  props.handleSaveClick(noteData, props.noteData.noteId, props.action)
                }}>
      Save note</button>
    </div>
  )
}

export default Note;
