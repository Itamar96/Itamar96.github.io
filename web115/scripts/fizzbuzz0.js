document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("name-form");
  const outputList = document.getElementById("datas");

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    const first = document.getElementById("first_name").value.trim();
    const middle = document.getElementById("middle_initial").value.trim();
    const last = document.getElementById("last_name").value.trim();

    let fullName = first;
    if (middle) fullName += " " + middle + ".";
    fullName += " " + last;

    // Personalized greeting
    alert(`Welcome ${fullName}! Enjoy your FizzBuzz results!`);

    // Clear previous results
    outputList.innerHTML = "";

    // Generate FizzBuzz from 1 to 125
    for (let i = 1; i <= 125; i++) {
      let text = "";
      if (i % 3 === 0) text += "Fizz";
      if (i % 5 === 0) text += "Buzz";
      if (!text) text = i;

      const li = document.createElement("li");
      li.textContent = text;
      outputList.appendChild(li);
    }
  });
});
