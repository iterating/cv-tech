export async function fetchYamlResume(url) {
  try {
    const response = await fetch(url, { method: "GET" });
    // console.log(response);

    const resumeJson = await response.text().then(jsyaml.load); // Convert YAML to JSON

    // console.log(resumeJson);
    return resumeJson;
  } catch (error) {
    console.error("Error loading YAML file", error);
  }
}

export async function renderResume(data) {
  // Profile section
  // document.getElementById('avatar').src = data.sidebar.avatar;
  document.getElementById("name").textContent = data.sidebar.name;
  document.getElementById("tagline").textContent = data.sidebar.tagline;
  let aboutHTML = "";
  if (data.sidebar.email) {
    aboutHTML += `
    <p class="email"><p class="fas fa-envelope"></p>
      <div class="details">${data.sidebar.email}</div>
    `;
  }
  if (data.sidebar.citizenship) {
    aboutHTML += `
    <p class="phone"><p class="fas fa-passport"></p>
      <div class="details">${data.sidebar.citizenship}</div>
    `;
  }
  document.getElementById("about-section").innerHTML = aboutHTML;

  // Education - Populating DOM by iterating over array
  let educationHTML = "";
  for (let i = 0; i < data.education.info.length; i++) {
    let school = data.education.info[i];
    let detailsMd = marked.parse(school.details);

    educationHTML += `
      <div class="item">
        <h4 class="degree">${school.degree}</h4>
        <h5 class="meta">${school.university}</h5>
        <div class="timeeducation">${school.time}</div>
        <div class="details">${detailsMd}</div>
      </div>`;
  }
  document.getElementById("education-section").innerHTML = educationHTML;

  // Summary
  let summaryHTML = "";
  let summaryMd = marked.parse(data.careerprofile.summary);
  summaryHTML += `
      <div class="item">
        <div class="details"> ${summaryMd}</div>
      </div>
     `;
  document.getElementById("summary-section").innerHTML = summaryHTML;

  // Experience - Populating DOM by using array.forEach
  let experiencesHTML = "";
  data.experiences.info.forEach((experience) => {
    let detailsMd = marked.parse(experience.details);
    experiencesHTML += `
      <div class="item">
        <div class="meta">
          <div class="upper-row">
            <h3 class="job-title">${experience.role}</h3>
            <div class="time">${experience.time}</div>
          </div>
          <div class="company">${experience.company}</div>
        </div>
        <div class="details"> ${detailsMd}</div>
      </div>`;

    // Check for additional roles within the same company
    if (experience.role2 && experience.time2 && experience.details2) {
      let detailsMd2 = marked.parse(experience.details2);
      experiencesHTML += `
          <div class="item">
            <div class="meta">
              <div class="upper-row">
                <h3 class="job-title">${experience.role2}</h3>
                <div class="time">${experience.time2}</div>
              </div>
              <div class="company"></div>
            </div>
            <div class="details">${detailsMd2}</div>
          </div>`;
    }
  });
  document.getElementById("experiences").innerHTML = experiencesHTML;

  // Skills - Populating DOM by using array.map
  let skillsHTML = data.skills.toolset
    .map(
      (skill) => `
      <div class="item">
        <h6 class="level-title">${skill.name}</h6>
        <div class="level-bar">
          <div class="level-bar-inner" style="width: ${skill.level}%"></div>
        </div>
      </div>`
    )
    .join(""); //.join() joins the the html together without separators ∴ no commas
  document.getElementById("skills-section").innerHTML = skillsHTML;
}

export async function renderPage() {
  const ready = await fetchYamlResume("./data/data.yml");
  renderResume(ready);
}
