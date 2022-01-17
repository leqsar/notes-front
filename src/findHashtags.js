function findHashtags(searchText) {
  let regexp = /\B\#\w\w+\b/g;
  const result = searchText.match(regexp);
  if (result) {
      return result;
  } else {
      return [];
  }
}

export default findHashtags;
