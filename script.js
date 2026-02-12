const projectGrid = document.querySelector("#project-grid");

const createProjectCard = (project) => {
  const card = document.createElement("article");
  card.className = "card";

  const heading = document.createElement("h3");
  heading.textContent = project.name;

  const summary = document.createElement("p");
  summary.textContent = project.summary || project.tagline || "";

  const actions = document.createElement("div");
  actions.className = "card-actions";

  if (project.website) {
    const websiteLink = document.createElement("a");
    websiteLink.className = "card-button";
    websiteLink.href = project.website;
    websiteLink.textContent = "Visit site";
    actions.appendChild(websiteLink);
  }

  if (project.repo) {
    const repoLink = document.createElement("a");
    repoLink.className = "card-button";
    repoLink.href = project.repo;
    repoLink.textContent = "View repo";
    actions.appendChild(repoLink);
  }

  const detailLink = document.createElement("a");
  detailLink.className = "card-button";
  detailLink.href = `project.html?project=${project.slug}`;
  detailLink.textContent = "Full details";
  actions.appendChild(detailLink);

  card.appendChild(heading);
  card.appendChild(summary);
  card.appendChild(actions);

  return card;
};

const renderProjects = (projects) => {
  if (!projectGrid) {
    return;
  }

  const filter = projectGrid.dataset.filter;
  const filteredProjects = filter === "pinned"
    ? projects.filter((project) => project.pin)
    : projects;

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const aPinned = Boolean(a.pin);
    const bPinned = Boolean(b.pin);
    if (aPinned === bPinned) {
      return 0;
    }
    return aPinned ? -1 : 1;
  });

  projectGrid.innerHTML = "";
  sortedProjects.forEach((project) => {
    projectGrid.appendChild(createProjectCard(project));
  });
};

const loadProjects = async () => {
  if (!projectGrid) {
    return;
  }

  try {
    const response = await fetch("projects.json");
    if (!response.ok) {
      throw new Error("Could not load projects.");
    }
    const projects = await response.json();
    renderProjects(projects);
  } catch (error) {
    projectGrid.innerHTML =
      "<p class=\"lead\">Projects are loading. If you see this for long, refresh.</p>";
  }
};

loadProjects();
