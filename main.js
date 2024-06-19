let mySchool = new School("Tung's School");
window.onload = function() {
    showAllStudent();
};
//showAllStudent();
/*
function prepareId(id, className){
    let classChar = className.slice(0,2).toUpperCase();
    if(!id.startsWith(classChar)){
        id = classChar + id;
    }
    return id;
}
*/

function addStudent() {
    let idInput = document.getElementById("id").value;
    let nameInput = document.getElementById("name").value;
    let ageInput = document.getElementById("age").value;
    let genderInput = "";
    let genderRadio = document.querySelector('input[name="gender"]:checked');
    if(genderRadio){
        genderInput = genderRadio.value;
    } else {
        alert("Bạn phải chọn giới tính cho sinh viên!");
        return;
    }
    let imgInput = document.getElementById("img").value;
    let classInput = document.getElementById("class").value;
    let markInput = document.getElementById("mark").value;
    markInput = markInput.split(",").map(Number);
    if (!validateStudentInfo(idInput, nameInput, ageInput, markInput)) {
        return;
    }
    
    //idInput = prepareId(idInput,classInput);
    let newStudent = new Student(idInput, nameInput, ageInput, genderInput, imgInput, classInput, markInput);
    mySchool.addStudent(newStudent);
    resetFormStudent();
    showAllStudent();
}

function getEditStudent(index) {
    let editStudent = mySchool.getEditStudent(index);
    document.getElementById("id").value = editStudent.id;
    document.getElementById("name").value = editStudent.name;
    document.getElementById("age").value = editStudent.age;
    let genderRadio = document.querySelector(`input[name="gender"][value="${editStudent.gender}"]`);
    if(genderRadio){
        genderRadio.checked = true;
    } else {
        let genderRadios = document.getElementsByName("gender");
        for(let i = 0; i < genderRadios.length; i++){
            genderRadios[i].checked = false;
        }
    }
    document.getElementById("img").value = editStudent.img;
    document.getElementById("class").value = editStudent.class;
    document.getElementById("mark").value = editStudent.mark;
    document.getElementById("btn").innerHTML = `<button class="btn btn-add" onclick="editStudent(${index})">Sửa thông tin sinh viên</button>`;
    showAllStudent();
}

function editStudent(index) {
    let idInput = document.getElementById("id").value;
    let nameInput = document.getElementById("name").value;
    let ageInput = document.getElementById("age").value;
    let genderInput = document.querySelector('input[name="gender"]:checked').value;
    let imgInput = document.getElementById("img").value;
    let classInput = document.getElementById("class").value;
    let markInput = document.getElementById("mark").value;
    markInput = markInput.split(",").map(Number);
    if (!validateStudentInfo(idInput, nameInput, ageInput, markInput, true, index)) {
        return;
    }
    if (!genderInput) {
        alert("Bạn phải chọn giới tính cho sinh viên!");
        return;
    }
    //idInput = prepareId(idInput,classInput);
    let editStudent = new Student(idInput, nameInput, ageInput, genderInput, imgInput, classInput, markInput);
    mySchool.editStudent(index, editStudent);
    showAllStudent();
    resetFormStudent();
}

function removeStudent(index) {
    let isConfirm = confirm("Bạn có chắc chắn muốn xóa sinh viên này không?");
    if (isConfirm) {
        //alert("Xóa sinh viên thành công!");
        mySchool.removeStudent(index);
    }
    showAllStudent();
}

function validateStudentInfo(id, name, age, mark, isEditing = false, index = -1) {
    if (id === "" || name === "") {
        alert("Mã sinh viên hoặc Tên sinh viên không được để trống. Yêu cầu nhập dữ liệu!");
        return false;
    }
    if (id < 0){
        alert("Mã sinh viên không hợp lệ. Yêu cầu nhập lại!");
        return false;
    }
    if (!isEditing) {
        let isDuplicate = mySchool.listStudent.some(student => student.id === id);
        if (isDuplicate) {
            alert("Mã sinh viên đã tồn tại. Yêu cầu nhập lại!");
            return false;
        }
    } else {
        let isDuplicate = mySchool.listStudent.some((student, i) => student.id === id && i !== index);
        if (isDuplicate) {
            alert("Mã sinh viên đã tồn tại. Yêu cầu nhập lại!");
            return false;
        }
    }
    if (isNaN(age) || age < 18 || age > 60) {
        alert("Tuổi của sinh viên không hợp lệ. Yêu cầu nhập lại!");
        return false;
    }
    if (mark.length !== 3) {
        alert("Không nhập đủ cơ số điểm cho sinh viên, hiện tại đang có " + mark.length + " điểm. Yêu cầu nhập lại!");
        return false;
    }
    let checkMark = mark.filter(mark => isNaN(mark) || mark > 10 || mark < 0);
    if (checkMark > 0) {
        alert("Điểm của sinh viên không hợp lệ. Yêu cầu nhập lại!");
        return false;
    }
    return true;
}

function searchStudent(){
    let searchName = document.getElementById("search").value.toLowerCase();
    let searchStudent = mySchool.searchStudent(searchName);
    showAllStudent(searchStudent);
}

function showTopStudent(){
    let students = mySchool.listStudent;
    students.sort((a,b) => averageMark(b.mark) - averageMark(a.mark));
    let topStudents = students.slice(0,5);

    let strTopStudent = `
        <tr>
            <th>STT</th>
            <th>Mã sinh viên</th>
            <th>Tên sinh viên</th>
            <th>Tuổi sinh viên</th>
            <th>Giới tính</th>
            <th>Ảnh sinh viên</th>
            <th>Lớp sinh viên</th>
            <th>Điểm kiểm tra</th>
            <th>Điểm giữa kỳ</th>
            <th>Điểm cuối kỳ</th>
            <th>Điểm trung bình</th>
            <th colspan="2">Hành động</th>
        </tr>
    `;
    
    for (let i = 0; i < topStudents.length; i++) {
        //let student = list[i];
        let avgMark = averageMark(topStudents[i].mark);
        strTopStudent += `
        <tr>
            <td>${i+1}</td>
            <td>${topStudents[i].id}</td>
            <td>${topStudents[i].name}</td>
            <td>${topStudents[i].age}</td>
            <td>${topStudents[i].gender}</td>
            <td><img src="${topStudents[i].img}" ></td>
            <td>${topStudents[i].class}</td>`
        for (let j = 0; j < topStudents[i].mark.length; j++) {
            strTopStudent += `
                <td>${topStudents[i].mark[j]}</td>
                `
        }
        strTopStudent += `<td>${avgMark}</td>
            <td><button class="btn btn-edit" onclick="getEditStudent(${i})">Sửa</button></td>
            <td><button class="btn btn-remove" onclick="removeStudent(${i})">Xóa</button></td>
        </tr>
        `
    }
    document.getElementById("listStudent").innerHTML = strTopStudent;
}

function showAllStudent(students = mySchool.listStudent) {
    //let list = mySchool.listStudent;
    let strStudent = `
        <tr>
            <th>STT</th>
            <th>Mã sinh viên</th>
            <th>Tên sinh viên</th>
            <th>Tuổi sinh viên</th>
            <th>Giới tính</th>
            <th>Ảnh sinh viên</th>
            <th>Lớp sinh viên</th>
            <th>Điểm kiểm tra</th>
            <th>Điểm giữa kỳ</th>
            <th>Điểm cuối kỳ</th>
            <th>Điểm trung bình</th>
            <th colspan="2">Hành động</th>
        </tr>
    `;
    
    for (let i = 0; i < students.length; i++) {
        //let student = list[i];
        let avgMark = averageMark(students[i].mark);
        strStudent += `
        <tr>
            <td>${i+1}</td>
            <td>${students[i].id}</td>
            <td>${students[i].name}</td>
            <td>${students[i].age}</td>
            <td>${students[i].gender}</td>
            <td><img src="${students[i].img}" ></td>
            <td>${students[i].class}</td>`
        for (let j = 0; j < students[i].mark.length; j++) {
            strStudent += `
                <td>${students[i].mark[j]}</td>
                `
        }
        strStudent += `<td>${avgMark}</td>
            <td><button class="btn btn-edit" onclick="getEditStudent(${i})">Sửa</button></td>
            <td><button class="btn btn-remove" onclick="removeStudent(${i})">Xóa</button></td>
        </tr>
        `
    }
    document.getElementById("listStudent").innerHTML = strStudent;
}

function averageMark(marks) {
    let sum = 0;
    sum += parseFloat(marks[0]);
    sum += parseFloat(marks[1]) * 2;
    sum += parseFloat(marks[2]) * 3;
    //console.log(sum);
    return (sum / 6).toFixed(2);
}

function sortDescMark(){
    mySchool.listStudent.sort((a, b)=>averageMark(b.mark) - averageMark(a.mark));
    showAllStudent();
}

function sortAscMark(){
    mySchool.listStudent.sort((a, b)=>averageMark(a.mark) - averageMark(b.mark));
    showAllStudent();
}

function resetFormStudent() {
    document.getElementById("id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    let genderRadios = document.getElementsByName("gender");
    for(let i = 0; i<genderRadios.length; i++){
        genderRadios[i].checked = false;
    }
    document.getElementById("img").value = "";
    document.getElementById("class").value = "Java";
    document.getElementById("mark").value = "";
    document.getElementById("btn").innerHTML = `<button class="btn btn-add" onclick="addStudent()">Thêm sinh viên</button>`;
}