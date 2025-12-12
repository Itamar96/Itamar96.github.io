// scripts/intro-form.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('introForm');
  const output = document.getElementById('intro-output');
  const coursesContainer = document.getElementById('courses-container');
  const addCourseBtn = document.getElementById('add-course');
  const removeCourseBtn = document.getElementById('remove-course');

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  addCourseBtn.addEventListener('click', () => {
    const rowCount = coursesContainer.querySelectorAll('.course-row').length;
    const newIndex = rowCount + 1;

    const row = document.createElement('div');
    row.className = 'course-row';

    row.innerHTML = `
      <label>
        Course title
        <input type="text" class="style course-title" name="courseTitle" id="course${newIndex}Title" required />
      </label>
      <label>
        Course note
        <input type="text" class="style course-note" name="courseNote" id="course${newIndex}Note" required />
      </label>
    `;

    coursesContainer.appendChild(row);
  });

  removeCourseBtn.addEventListener('click', () => {
    const rows = coursesContainer.querySelectorAll('.course-row');
    if (rows.length > 1) {
      coursesContainer.removeChild(rows[rows.length - 1]);
    }
  });

  // ✅ NEW: clear the generated introduction on reset
  form.addEventListener('reset', () => {
    output.innerHTML = '';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const aboutMe = document.getElementById('aboutMe').value.trim();
    const personalBackground = document.getElementById('personalBackground').value.trim();
    const academicBackground = document.getElementById('academicBackground').value.trim();
    const interestingFact = document.getElementById('interestingFact').value.trim();
    const shareSomething = document.getElementById('shareSomething').value.trim();

    const titleEls = coursesContainer.querySelectorAll('.course-title');
    const noteEls = coursesContainer.querySelectorAll('.course-note');

    const courses = [];
    for (let i = 0; i < titleEls.length; i++) {
      const title = titleEls[i].value.trim();
      const note = noteEls[i].value.trim();
      if (title !== '' || note !== '') {
        courses.push({ title, note });
      }
    }

    let coursesHTML = '';
    courses.forEach((course) => {
      const safeTitle = escapeHtml(course.title);
      const safeNote = escapeHtml(course.note);
      coursesHTML += `<li><strong>${safeTitle}</strong>: ${safeNote}</li>`;
    });

    const introHtml = `
      <h2>Introduction</h2>

      <h3 data-section-title>About Me</h3>
      <p>${escapeHtml(aboutMe)}</p>

      <h3 data-section-title>Quick Facts</h3>
      <ul>
        <li><strong>Personal background</strong><br>${escapeHtml(personalBackground)}</li>
        <li><strong>Academic background</strong><br>${escapeHtml(academicBackground)}</li>
        <li><strong>Courses I am taking</strong>
          <ol>
            ${coursesHTML}
          </ol>
        </li>
        <li><strong>Interesting fact</strong><br>${escapeHtml(interestingFact)}</li>
        <li><strong>Something I would like to share</strong><br>${escapeHtml(shareSomething)}</li>
      </ul>

      <figure data-gold>
        <img loading="lazy"
          src="images/hiking_mountain_lake_500w.jpg"
          alt="Portrait of a hiker in nature"
          width="500"
          height="694"
          style="width: 100%; height: auto;" />
        <figcaption data-note-gold>Grounded in nature, inspired to heal. Colorado 2025.</figcaption>
      </figure>

      <blockquote>
        <p>“Strength does not come from physical capacity. It comes from an indomitable will.”</p>
        <cite>- Mahatma Gandhi</cite>
      </blockquote>
    `;

    output.innerHTML = introHtml;
    output.scrollIntoView({ behavior: 'smooth' });
  });
});