var fullName = document.getElementById("fullName");
var email = document.getElementById("email");
var course = document.getElementById("course");
var updates = document.getElementById("updates");
var message = document.getElementById("message");
var step = 1;

function saveForm() {
  var data = {
    fullName: fullName.value,
    email: email.value,
    course: course.value,
    updates: updates.checked
  };
  sessionStorage.setItem("formData", JSON.stringify(data));
  sessionStorage.setItem("step", step);
}

function loadForm() {
  var saved = sessionStorage.getItem("formData");
  if (saved !== null) {
    var data = JSON.parse(saved);
    fullName.value = data.fullName;
    email.value = data.email;
    course.value = data.course;
    updates.checked = data.updates;
    message.textContent = "Your progress was restored.";
  }
  step = Number(sessionStorage.getItem("step")) || 1;
}

function showStep() {
  for (var i = 1; i <= 3; i++) {
    document.getElementById("step" + i).style.display = (i === step) ? "block" : "none";
  }
  document.getElementById("stepInfo").textContent = "Step " + step + " of 3";
  document.getElementById("backBtn").disabled = (step === 1);
  document.getElementById("nextBtn").textContent = (step === 3) ? "Submit" : "Next";

  if (step === 3) {
    var review = document.getElementById("review");
    review.innerHTML = "";
    var lines = [
      "Name: " + fullName.value,
      "Email: " + email.value,
      "Course: " + course.value,
      "Updates: " + (updates.checked ? "Yes" : "No")
    ];
    lines.forEach(function (text) {
      var li = document.createElement("li");
      li.textContent = text;
      review.appendChild(li);
    });
  }
}

function validate() {
  if (step === 1) {
    if (fullName.value.trim() === "" || email.value.indexOf("@") === -1) {
      message.textContent = "Enter your name and a valid email.";
      return false;
    }
  }
  if (step === 2 && course.value === "") {
    message.textContent = "Please select a course.";
    return false;
  }
  message.textContent = "";
  return true;
}

document.getElementById("nextBtn").addEventListener("click", function () {
  if (!validate()) { return; }
  if (step < 3) {
    step++;
    saveForm();
    showStep();
  } else {
    sessionStorage.removeItem("formData");
    sessionStorage.removeItem("step");
    document.querySelector(".card").innerHTML = "<h2>Registration submitted!</h2><p>Your temporary data has been cleared.</p>";
  }
});

document.getElementById("backBtn").addEventListener("click", function () {
  if (step > 1) {
    step--;
    saveForm();
    showStep();
  }
});

document.getElementById("resetBtn").addEventListener("click", function () {
  sessionStorage.clear();
  fullName.value = "";
  email.value = "";
  course.value = "";
  updates.checked = false;
  step = 1;
  message.textContent = "Form reset.";
  showStep();
});

[fullName, email, course, updates].forEach(function (field) {
  field.addEventListener("input", saveForm);
  field.addEventListener("change", saveForm);
});

loadForm();
showStep();
