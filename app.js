const cards = [...document.querySelectorAll(".collection-card")];
const filterButtons = [...document.querySelectorAll(".filter-chip")];
const searchInput = document.querySelector("#collection-search");
const resultsNote = document.querySelector("#results-note");
const emptyState = document.querySelector("#empty-state");
const grid = document.querySelector("#collection-grid");
const dialog = document.querySelector("#board-dialog");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

let activeFilter = "all";

function updateCollections() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  let visibleCount = 0;

  for (const card of cards) {
    const categoryMatches = activeFilter === "all" || card.dataset.category === activeFilter;
    const searchable = `${card.dataset.search} ${card.innerText}`.toLocaleLowerCase();
    const queryMatches = !query || searchable.includes(query);
    const visible = categoryMatches && queryMatches;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  }

  grid.hidden = visibleCount === 0;
  emptyState.hidden = visibleCount !== 0;
  resultsNote.textContent = query || activeFilter !== "all"
    ? `${visibleCount} ${visibleCount === 1 ? "collection" : "collections"} shown`
    : "";
}

for (const button of filterButtons) {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    for (const chip of filterButtons) {
      const selected = chip === button;
      chip.classList.toggle("is-active", selected);
      chip.setAttribute("aria-pressed", String(selected));
    }
    updateCollections();
  });
}

searchInput.addEventListener("input", updateCollections);
document.querySelector(".reset-search").addEventListener("click", () => {
  searchInput.value = "";
  activeFilter = "all";
  for (const chip of filterButtons) {
    const selected = chip.dataset.filter === "all";
    chip.classList.toggle("is-active", selected);
    chip.setAttribute("aria-pressed", String(selected));
  }
  updateCollections();
  searchInput.focus();
});

document.querySelectorAll(".card-open").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".collection-card");
    const title = button.dataset.board;
    const description = card.querySelector(".card-desc").textContent;
    const kicker = card.querySelector(".card-kicker").textContent;
    const art = card.querySelector(".card-art");
    const dialogArt = document.querySelector("#dialog-art");
    document.querySelector("#dialog-title").textContent = title;
    document.querySelector("#dialog-description").textContent = description;
    document.querySelector("#dialog-category").textContent = kicker;
    dialogArt.className = `dialog-art ${[...art.classList].find((name) => name.startsWith("art-"))}`;
    dialogArt.innerHTML = `<span class="dialog-emoji">${art.querySelector(".art-figure").textContent}</span>`;
    dialog.showModal();
  });
});

document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

menuButton.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!expanded));
  nav.classList.toggle("is-open", !expanded);
});

nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
}));

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
});
