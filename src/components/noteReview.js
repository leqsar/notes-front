function NoteReview(props) {
  return (
    <div className='note-preview'>
      <p className='note-preview__data'>{props.noteData}</p>
      <div>
        <p onClick={(event) => {
          props.handleEditClick(props.noteId)
        }}>Edit</p>
        <p onClick={(event) => {
          props.handleDeleteClick(props.noteId)
        }}>Delete</p>
      </div>
    </div>
  )
}

export default NoteReview
