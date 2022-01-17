function TagsList(props) {
  let listOfTags;
  if(props.tagsArray.length !== 0) {
    listOfTags = props.tagsArray.map((tag, index) => {
      return <li key={index}>{tag}</li>
    });
  }

  return (
    <ul className='note-tags'>
      {listOfTags}
    </ul>
  )
}

export default TagsList
