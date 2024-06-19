class School {
    name;
    listStudent;
    constructor(nameInput) {
        this.name = nameInput;
        this.listStudent = this.loadFromLocalStorage() || [];
    }

    addStudent(newStudent) {
        this.listStudent.push(newStudent);
        this.saveToLocalStorage();
    }

    removeStudent(index) {
        this.listStudent.splice(index, 1);
        this.saveToLocalStorage();
    }

    getEditStudent(index) {
        return this.listStudent[index];
    }

    editStudent(index, editStudent) {
        this.listStudent[index] = editStudent;
        this.saveToLocalStorage();
    }

    searchStudent(searchName) {
        searchName = searchName.toLowerCase();
        return this.listStudent.filter(student => student.name.toLowerCase().includes(searchName));
    }

    saveToLocalStorage() {
        if (this.listStudent) {
            localStorage.setItem("listSchool", JSON.stringify(this.listStudent));
            //showAllStudent();
        }
    }

    loadFromLocalStorage() {
        let data = localStorage.getItem("listSchool");
        return JSON.parse(data);
    }
}