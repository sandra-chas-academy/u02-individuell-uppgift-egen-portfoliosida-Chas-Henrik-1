import { isCVUpdated, loadCV, saveToLocalStorage, readFromLocalStorage } from "./json-loader.js";
import { connectToGitHub, getRepoEndpoints } from "./github-api.js";

// *** Progress Bar functions ***

function displayProgressControl(value) {
    let progressControl = document.getElementById("progress-control-id");
    progressControl.style.display = value;
}

function updateProgressAction(progress) {
    let progressAction = document.getElementById("progress-action-id");
    progressAction.textContent = progress;
}

function updateProgressBar(progress) {
    let progressBar = document.getElementById("progress-bar-id");
    let progressBarValue = document.getElementById("progress-bar-value-id");

    progressBarValue.textContent = `${Math.round(progress).toFixed(0)}%`;
    progressBar.style.background = `conic-gradient(#0F0BFC ${progress * 3.6}deg, #BCE9F5 0deg)`;
}


// *** Grid functions ***

function expandAllDetails(e) {
    const expandAllButton = e.target;
    const container = e.target.parentElement.parentElement;
    const details = container.querySelectorAll("details");

    if (expandAllButton.innerText === "Expand All") {
        expandAllButton.innerText = "Collapse All";
        details.forEach((detail) => {
            detail.open = true;
        });
    } else {
        expandAllButton.innerText = "Expand All";
        details.forEach((detail) => {
            detail.open = false;
        });
    }
    e.preventDefault();
}

// *** Connect to GitHub & populate page ***
const REPOS = [ 
    {name: "Minesweeper", site: "https://chas-henrik.github.io/Minesweeper/"}, 
    {name: "OOP-Poker", site: "https://chas-henrik.github.io/OOP-Poker/"},
    {name: "ToDo-List-Typescript-Firebase", site: "https://chas-henrik.github.io/ToDo-List-Typescript-Firebase/"},
    {name: "Word-Count", site: "https://chas-henrik.github.io/Word-Count/"},
    {name: "Profile-Card", site: "https://chas-henrik.github.io/Profile-Card/"},
    {name: "Menu-Nailbiter", site: "https://chas-henrik.github.io/Menu-Nailbiter/"}
];
const skillsAccumulated = {};

await main();

async function main() {
    try {
        displayProgressControl("flex");
        updateProgressAction("Populating page with JSON data...");
        updateProgressBar(0);
        await connectToGitHub();
        await populatePage();
    } catch (error) {
        console.error("Error:", error);
    } finally {
        displayProgressControl("none");
    }
}

// *** Populate Page ***

async function populatePage() {
    await populateGrid();
    await populateProjectCards();
}


// *** Populate grids from JSON file ***

// Populate grid containers
async function populateGrid() {
    try {
        const dataObj = await loadCV("./../json/cv.json");
        populateAboutMe(dataObj["aboutMe"]);
        populateGridContainer(dataObj["workExperience"], "grid-work-experience");
        populateAccumulatedSkillsElement(getSortedSkillsArray());
        populateGridContainer(dataObj["education"], "grid-education");
        updateProgressBar(10);
    } catch (error) {
        console.error("Unable to read JSON file:", error);
    }
}

// Populate About Me
function populateAboutMe(aboutMeObj) {
    const aboutDescriptionElement = document.getElementById("about--description");
    const p = document.createElement('p');
    aboutDescriptionElement.innerText = aboutMeObj["description"];
}

// Populate grid container
function populateGridContainer(workExperienceObjs, parentElementId) {
    const workExperienceElement = document.getElementById(parentElementId);
    const detailsExpandAll = document.createElement('details');

    detailsExpandAll.classList.add("grid__item--details", "grid__item--description", "paragraph__size--grid-fig-caption");
    detailsExpandAll.innerHTML = `<summary class="grid__item--clickable paragraph__size--grid-summary">Expand All</summary>`;
    workExperienceElement.appendChild(detailsExpandAll);

    const summary = detailsExpandAll.querySelector("summary");
    summary.addEventListener("click", (e) => expandAllDetails(e));

    for(const obj in workExperienceObjs){
        const article = document.createElement('article');
        article.classList.add('grid', 'grid--experience', 'break-inside--avoid');
        workExperienceElement.appendChild(article);
        populateGridElements(workExperienceObjs[obj], article);
    };
}

// Populate grid elements
function populateGridElements(workExperienceObj, gridContainerElement) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    let years = 0;
    for(const key in workExperienceObj) {
        switch(key) {
            case 'role':
                const h2 = document.createElement("h2");
                h2.classList.add("grid--text", "grid__item--role", "paragraph__size--grid-role");
                h2.innerText = workExperienceObj[key];
                gridContainerElement.appendChild(h2);
                break;
            case 'type':
                const p = document.createElement("p");
                p.classList.add("grid--text", "grid__item--type", "paragraph__size--grid-fig-caption");
                p.innerText = workExperienceObj[key];
                gridContainerElement.appendChild(p);
                break;
            case 'provider':
                const figureProvider = document.createElement("figure");
                figureProvider.classList.add("grid__figure", "grid__item--provider");
                figureProvider.innerHTML = `<img class="grid__figure--item" src="./svg/office-building.svg" alt="Office Building Icon" loading="lazy"><figcaption class="grid--text grid__figure--item paragraph__size--grid-fig-caption">${workExperienceObj[key]}</figcaption>`;
                gridContainerElement.appendChild(figureProvider);
                break;
            case 'date':
                const figureDate = document.createElement("figure");
                const yearsArr = workExperienceObj[key].split(" - ").map((item) => item.toLowerCase() === "present" ? currentYear : parseInt(item));
                if(!isNaN(yearsArr[1]) && !isNaN(yearsArr[0])) {
                    years = yearsArr[1] - yearsArr[0];
                } else {
                    years = 0;
                }
                figureDate.classList.add("grid__figure", "grid__item--date");
                figureDate.innerHTML = `<img class="grid__figure--item" src="./svg/calender.svg" alt="Calender Icon" loading="lazy"><figcaption class="grid--text grid__figure--item paragraph__size--grid-fig-caption">${workExperienceObj[key]}</figcaption>`;
                gridContainerElement.appendChild(figureDate);
                break;
            case 'location':
                const figureLocation = document.createElement("figure");
                figureLocation.classList.add("grid__figure", "grid__item--location");
                figureLocation.innerHTML = `<img class="grid__figure--item" src="./svg/location.svg" alt="Location Icon" loading="lazy"><figcaption class="grid--text grid__figure--item paragraph__size--grid-fig-caption">${workExperienceObj[key]}</figcaption>`;
                gridContainerElement.appendChild(figureLocation);
                break;
            case 'description':
                const detailsDescription = document.createElement("details");
                const olDescription = document.createElement("ol");
                detailsDescription.classList.add("grid__item--details", "grid__item--description", "paragraph__size--grid-text");
                detailsDescription.innerHTML = `<summary class="grid--text grid__item--clickable paragraph__size--grid-summary">Description</summary>`;
                gridContainerElement.appendChild(detailsDescription);
                olDescription.classList.add("grid__ol--description");
                detailsDescription.appendChild(olDescription);
                workExperienceObj[key].forEach((item) => {
                    const li = document.createElement("li");
                    li.innerText = item;
                    li.classList.add("grid--text", "text--wrap-anywhere");
                    olDescription.appendChild(li);
                });
                break;
            case 'skills':
                const detailsSkills= document.createElement("details");
                detailsSkills.classList.add("grid__item--details", "grid__item--skill", "paragraph__size--grid-text");
                detailsSkills.innerHTML = `<summary class="grid--text grid__item--clickable paragraph__size--grid-summary">Skills</summary><ul class="grid__ul--skill"></ul>`;
                gridContainerElement.appendChild(detailsSkills);
                const ulSkills = detailsSkills.querySelector("ul");
                workExperienceObj[key].forEach((item) => {
                    const li = document.createElement("li");
                    li.innerText = item;
                    li.classList.add("grid--text", "text--wrap-anywhere");
                    ulSkills.appendChild(li);
                    skillsAccumulated[item] = item in skillsAccumulated ? skillsAccumulated[item] + years : years;
                });
                break;
        }
    }
}

// *** Sort accumulated skills (descending) ***
function sortAccumulatedSkills() {
    const skillsAccumulatedArr = Object.entries(skillsAccumulated);
    const sortedSkillsArray = skillsAccumulatedArr.sort((a, b) => b[1] - a[1]);
    saveToLocalStorage("sortedSkillsArray", sortedSkillsArray);
    return sortedSkillsArray;
}

function getSortedSkillsArray() {
    // Check if CV has been updated
    if(!isCVUpdated) {
        // Read from local storage (if available)
        const sortedSkillsArray = readFromLocalStorage("sortedSkillsArray");
        if(sortedSkillsArray) {
            return sortedSkillsArray;
        }
    }

    return sortAccumulatedSkills();
}

// *** Populate accumulated skills ***
function populateAccumulatedSkillsElement(sortedSkillsArray) {
    const MAX_SKILLS = 15;
    const skillsAccumulatedElement = document.getElementById("grid-skills-accumulated-id");
    const h4YearsElement = document.createElement("h4");
    const h4SkillElement = document.createElement("h4");

    //Populate grid caption
    h4YearsElement.innerText = "Years";
    h4SkillElement.innerText = "Skill";
    h4YearsElement.classList.add("grid-skills__item--skills", "grid-skills__item--years", "paragraph__size--grid-role");
    h4SkillElement.classList.add("grid-skills__item--skills", "grid-skills__item--skill", "paragraph__size--grid-role");
    skillsAccumulatedElement.appendChild(h4YearsElement);
    skillsAccumulatedElement.appendChild(h4SkillElement);

    //Populate grid elements
    for(let i=0; i<MAX_SKILLS && i<sortedSkillsArray.length; i++) {
        const item = sortedSkillsArray[i];
        const pYearsElement = document.createElement("p");
        const pSkillElement = document.createElement("p");
        pYearsElement.classList.add("grid-skills__item--skills", "grid-skills__item--years", "paragraph__size--grid-fig-caption");
        pSkillElement.classList.add("grid-skills__item--skills", "grid-skills__item--skill", "paragraph__size--grid-fig-caption");
        pYearsElement.innerText = `${item[1]}`;
        pSkillElement.innerText = `${item[0]}`;
        skillsAccumulatedElement.appendChild(pYearsElement);
        skillsAccumulatedElement.appendChild(pSkillElement);
    };
}

// *** Populate projects from GitHub ***

async function populateProjectCards() {
    const projectCardsDiv = document.getElementById("projectCards");
    const cardArticle = projectCardsDiv.querySelectorAll(".card");
    const repoObjs = [];
    const languageObjs = [];
    // Fetch data from GitHub API
    await fetchRepoEndpoints(REPOS, repoObjs, languageObjs);

    for(let i=0; i<cardArticle.length && i<repoObjs.length; i++) {
        const card = cardArticle[i];
        const repoObj = repoObjs[i]; 
        const titleElement = card.querySelector(".card__title");
        const descriptionElement = card.querySelector(".card__description");
        const techStackElement = card.querySelector(".card__tech-stack");
        const linkElements = card.querySelectorAll("a");
        const languageStr = Object.keys(languageObjs[i].data).sort((a, b) => a.toLowerCase() > b.toLowerCase() ? 1 : -1).join(", ");

        // Populate card elements with data from GitHub API
        titleElement.innerText = repoObj.data.name;
        descriptionElement.innerText = repoObj.data.description;
        techStackElement.innerText = languageStr;
        linkElements[0].href = REPOS[i].site;
        linkElements[1].href = repoObj.data.html_url;
    };
}

async function fetchRepoEndpoints(repos, repoObjs, languageObjs) {
    for(let i=0; i<repos.length; i++) {
        const repoName = REPOS[i].name;
        const endpointObjs = await getRepoEndpoints(repoName, ['GET /repos/{owner}/{repo}', 'GET /repos/{owner}/{repo}/languages']);
        updateProgressBar(10 + 90*(i+1)/repos.length);
        if(endpointObjs != null) {
            repoObjs.push(endpointObjs[0]);
            languageObjs.push(endpointObjs[1]);
        }
    };
}


