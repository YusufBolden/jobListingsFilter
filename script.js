const jobListingsContainer = document.getElementById("job-listings");
const filterBar = document.getElementById("filter-bar");
const filterTagsContainer = document.getElementById("filter-tags");
const clearButton = document.getElementById("clear-filters");
let activeFilters = [];

async function loadJobListings() {
  const response = await fetch("data.json");
  const listings = await response.json();
  renderListings(listings);
}

function renderListings(listings) {
  jobListingsContainer.innerHTML = "";
  listings.forEach((listing) => {
    if (activeFilters.length && !matchesFilters(listing)) return;

    const card = document.createElement("div");
    card.className = `bg-white shadow-md rounded-md p-6 border-l-4 ${
      listing.featured ? "border-[#5CA5A5]" : "border-transparent"
    } flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`;

    card.innerHTML = `
      <!-- Job Listing: ${listing.company} -->
      <div class="flex items-start sm:items-center gap-6">
        <img src="${listing.logo}" alt="${
      listing.company
    } logo" class="w-12 h-12 sm:w-16 sm:h-16 -mt-12 sm:mt-0" />
        <div>
          <div class="flex items-center gap-4 mb-2">
            <span class="text-[#5CA5A5] font-bold">${listing.company}</span>
            ${
              listing.new
                ? '<span class="bg-[#5CA5A5] text-white text-xs font-bold uppercase rounded-full px-2 py-1">New!</span>'
                : ""
            }
            ${
              listing.featured
                ? '<span class="bg-[#2B3939] text-white text-xs font-bold uppercase rounded-full px-2 py-1">Featured</span>'
                : ""
            }
          </div>
          <h2 class="text-[#2B3939] font-bold text-lg hover:text-[#5CA5A5] cursor-pointer">${
            listing.position
          }</h2>
          <ul class="flex gap-4 text-[#7B8E8E] mt-2 text-sm">
            <li>${listing.postedAt}</li>
            <li>&bull;</li>
            <li>${listing.contract}</li>
            <li>&bull;</li>
            <li>${listing.location}</li>
          </ul>
        </div>
      </div>
      <div class="flex flex-wrap gap-4 pt-2 sm:pt-0 sm:justify-end border-t sm:border-none border-gray-200 mt-4 sm:mt-0">
        ${[listing.role, listing.level, ...listing.languages, ...listing.tools]
          .map(
            (tag) =>
              `<button class="bg-[#EFFAFA] text-[#5CA5A5] font-bold px-2 py-1 rounded hover:bg-[#5CA5A5] hover:text-white" data-tag="${tag}">${tag}</button>`
          )
          .join("")}
      </div>
    `;
    jobListingsContainer.appendChild(card);
  });

  // Add event listeners for tags
  document.querySelectorAll("button[data-tag]").forEach((button) => {
    button.addEventListener("click", () => {
      const tag = button.dataset.tag;
      if (!activeFilters.includes(tag)) {
        activeFilters.push(tag);
        updateFilterBar();
        renderListings(listings);
      }
    });
  });
}

function matchesFilters(listing) {
  const tags = [
    listing.role,
    listing.level,
    ...listing.languages,
    ...listing.tools,
  ];
  return activeFilters.every((filter) => tags.includes(filter));
}

function updateFilterBar() {
  filterTagsContainer.innerHTML = "";
  if (activeFilters.length > 0) {
    filterBar.classList.remove("hidden");
  } else {
    filterBar.classList.add("hidden");
  }

  activeFilters.forEach((tag) => {
    const tagElement = document.createElement("div");
    tagElement.className =
      "flex items-center bg-[#EFFAFA] rounded overflow-hidden";
    tagElement.innerHTML = `
      <span class="text-[#5CA5A5] font-bold px-2">${tag}</span>
      <button class="bg-[#5CA5A5] hover:bg-[#2B3939] px-2 text-white" data-remove="${tag}">
        <img src="./images/icon-remove.svg" alt="Remove filter" />
      </button>
    `;
    filterTagsContainer.appendChild(tagElement);
  });

  document.querySelectorAll("button[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      const tag = button.dataset.remove;
      activeFilters = activeFilters.filter((f) => f !== tag);
      updateFilterBar();
      loadJobListings();
    });
  });
}

clearButton.addEventListener("click", () => {
  activeFilters = [];
  updateFilterBar();
  loadJobListings();
});

loadJobListings();
