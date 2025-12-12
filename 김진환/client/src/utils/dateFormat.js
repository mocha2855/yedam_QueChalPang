function dateFormat(dateString, format) {
  let date = new Date(dateString);
  let year = date.getFullYear();
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  let result = format.replace("yyyy", year).replace("MM", month).replace("dd", day);
  return result;
}
export default dateFormat;
