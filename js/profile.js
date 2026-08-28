// Profile page logic to show and update student details.

document.addEventListener("DOMContentLoaded", () => {
  const student = getCurrentStudent();
  if (!student) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("profileDisplayName").textContent = student.name;
  document.getElementById("parentDisplay").textContent = student.parentName || "Parent";
  document.getElementById("profileName").value = student.name;
  document.getElementById("profileAge").value = student.age;
  document.getElementById("profileClass").value = student.className;
  document.getElementById("profileSchool").value = student.school;
  document.getElementById("profileParent").value = student.parentName || "";
  document.getElementById("profileMobile").value = student.mobile || "";

  document.getElementById("profileForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const updatedStudent = {
      ...student,
      name: document.getElementById("profileName").value.trim(),
      age: document.getElementById("profileAge").value,
      className: document.getElementById("profileClass").value,
      school: document.getElementById("profileSchool").value,
      parentName: document.getElementById("profileParent").value.trim(),
      mobile: document.getElementById("profileMobile").value.trim(),
    };

    const students = getStudents();
    const index = students.findIndex((existing) => existing.name === student.name && existing.school === student.school);
    if (index !== -1) {
      students[index] = updatedStudent;
      saveStudents(students);
    }
    setCurrentStudent(updatedStudent);
    document.getElementById("profileDisplayName").textContent = updatedStudent.name;
    document.getElementById("parentDisplay").textContent = updatedStudent.parentName || "Parent";
    alert("Profile updated successfully.");
  });
});
