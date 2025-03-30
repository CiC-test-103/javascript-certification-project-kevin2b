// Necessary Imports (you will need to use this)
const { Student } = require('./Student')

/**
 * Node Class (GIVEN, you will need to use this)
 */
class Node {
  // Public Fields
  data               // Student
  next               // Object
  /**
   * REQUIRES:  The fields specified above
   * EFFECTS:   Creates a new Node instance
   * RETURNS:   None
   */
  constructor(data, next = null) {
    this.data = data;
    this.next = next
  }
}

/**
 * Create LinkedList Class (for student management)
 * The class should have the public fields:
 * - head, tail, length
 */
class LinkedList {
  // Public Fields
  head              // Object
  tail              // Object
  length            // Number representing size of LinkedList

  /**
   * REQUIRES:  None
   * EFFECTS:   Creates a new LinkedList instance (empty)
   * RETURNS:   None
   */
  constructor() {
    // TODO
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * REQUIRES:  A new student (Student)
   * EFFECTS:   Adds a Student to the end of the LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about adding to the 'end' of the LinkedList (Hint: tail)
   */
  addStudent(newStudent) {
    // TODO
    const node = new Node(newStudent);
    if (this.length === 0){
      this.head = node;
      this.tail = node;
    }
    else{
      this.tail.next = node;
      this.tail = this.tail.next;
    }
    this.length++;
    return;
  }

  /**
   * REQUIRES:  email(String)
   * EFFECTS:   Removes a student by email (assume unique)
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about how removal might update head or tail
   */
  removeStudent(email) {
    // TODO
    let curr = this.head;
    let prev = null;
    while(curr !== null && curr.data.getEmail() !== email){
      prev = curr;
      curr = curr.next;
    }
    if (curr === null){
      return;
    }

    this.length--;
    if (curr === this.head && curr === this.tail){
      this.head = null;
      this.tail = null;
      return;
    }

    if (curr === this.head){
      this.head = this.head.next;
      return;
    }

    prev.next = curr.next;
    if (curr === this.tail){
      this.tail = prev;
    }
    return;
  }

  /**
   * REQUIRES:  email (String)
   * EFFECTS:   None
   * RETURNS:   The Student or -1 if not found
   */
  findStudent(email) {
    // TODO
    let curr = this.head;
    while(curr !== null && curr.data.getEmail() !== email){
      curr = curr.next;
    }
    return (curr === null)? -1 : curr.data;
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   Clears all students from the Linked List
   * RETURNS:   None
   */
  clearStudents() {
    // TODO
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   LinkedList as a String for console.log in caller
   * CONSIDERATIONS:
   *  - Let's assume you have a LinkedList with two people
   *  - Output should appear as: "JohnDoe, JaneDoe"
   */
  displayStudents() {
    // TODO
    let curr = this.head;
    const names = [];
    while (curr !== null){
      names.push(curr.data.getName());
      curr = curr.next;
    }
    return names.join(", ");
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   A sorted array of students by name
   */
  #sortStudentsByName() {
    // TODO
    let curr = this.head;
    const students = [];
    while (curr !== null){
      students.push(curr.data);
      curr = curr.next;
    }
    //"a" will come before "Z" despite "a" > "Z" 
    return students.sort((a,b) => a.getName().localeCompare(b.getName()));
  }

  /**
   * REQUIRES:  specialization (String)
   * EFFECTS:   None
   * RETURNS:   An array of students matching the specialization, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterBySpecialization(specialization) {
    // TODO
    return this.#sortStudentsByName().filter((student) => student.getSpecialization() === specialization);
  }

  /**
   * REQUIRES:  minAge (Number)
   * EFFECTS:   None
   * RETURNS:   An array of students who are at least minAge, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterByMinAge(minAge) {
    // TODO
    return this.#sortStudentsByName().filter((student) => student.getYear() >= minAge);
  }

  /**
   * REQUIRES:  A valid file name (String)
   * EFFECTS:   Writes the LinkedList to a JSON file with the specified file name
   * RETURNS:   None
   */
  async saveToJson(fileName) {
    // TODO
    const fs = require('fs').promises;
    const students = [];
    let curr = this.head;
    while(curr != null){
      const student = {
        name: curr.data.getName(),
        year: curr.data.getYear(),
        email: curr.data.getEmail(),
        specialization: curr.data.getSpecialization(),
      }
      students.push(student);
      curr = curr.next;
    }
    try{
      await fs.writeFile("./" + fileName, JSON.stringify(students, null, "\t"), 'utf8');
    }
    catch(error){
      console.log("Error: ", error);
    }
  }

  /**
   * REQUIRES:  A valid file name (String) that exists
   * EFFECTS:   Loads data from the specified fileName, overwrites existing LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   *  - Use clearStudents() to perform overwriting
   */
  async loadFromJSON(fileName) {
    // TODO
    const fs = require('fs').promises;
    try{
      const data = await fs.readFile("./" + fileName, 'utf8');
      const studentArray = JSON.parse(data);
      this.clearStudents();
      for(const student of studentArray){
        this.addStudent(new Student(student.name, student.year, student.email, student.specialization));
      }
    }
    catch(error){
      console.log("Error: ", error);
    }
  }

}

module.exports = { LinkedList }
