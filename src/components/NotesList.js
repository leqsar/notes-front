import NoteReview from './noteReview';

function NoteList(props) {
  let notesList;
  if(props.notesArray.length !== 0) {
    notesList = props.notesArray.map((elem) => {
      return (
        <NoteReview
          key={elem.noteId}
          noteId={elem.noteId}
          noteData={elem.noteData}
          handleEditClick={props.handleEditClick}
          handleDeleteClick={props.handleDeleteClick}
        />
      )
    });
  }
  return (
    <div className='notes-container'>
      {notesList}
    </div>
  )
}

export default NoteList;
