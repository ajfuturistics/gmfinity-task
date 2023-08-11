const playlistElement = document.getElementById("playlist-container");
const modalShareElement = document.getElementById("modal-share");
const linkGetElement = document.getElementById("link-get");

function generatePlaylist(data) {
  const card = document.createElement("div");
  card.className = "playlist-card";

  const titleContainer = document.createElement("div");
  titleContainer.className = "titleContainer";

  const title = document.createElement("h3");
  title.textContent = data.title;

  const shareLogo = document.createElement("img");
  shareLogo.src = "./assets/logo/share.svg";
  shareLogo.alt = "share";
  shareLogo.className = "share-logo";
  shareLogo.addEventListener("click", () => {
    openShareModal();
  });

  titleContainer.append(title, shareLogo);

  const line = document.createElement("hr");
  line.className = "my-heading";

  const visibility = document.createElement("p");
  visibility.textContent = `Visibility: ${data.share}`;

  const numberofMovies = document.createElement("p");
  numberofMovies.textContent = `Movies added: ${data.movies.length}`;

  const addedBy = document.createElement("p");
  addedBy.textContent = `Added by: ${data.userId.username}`;

  const lineTwo = document.createElement("hr");
  lineTwo.className = "my-heading";

  const cardContainer = document.createElement("div");
  cardContainer.id = "card-container";

  // movie card
  if (data.movies.length === 0) {
    const emptyEle = document.createElement("p");
    emptyEle.className = "text-center my-heading";
    emptyEle.textContent = "No movies or series added in playlist";
    cardContainer.appendChild(emptyEle);
  } else {
    data.movies.forEach((element) => {
      const mainCard = document.createElement("div");
      mainCard.className = "movie bg-gray";
      const poster = document.createElement("img");
      poster.src = element?.poster;
      poster.alt = element?.title;

      mainCard.appendChild(poster);

      const innerDiv = document.createElement("div");

      const idEle = document.createElement("p");
      idEle.textContent = `#${element?.movieId}`;

      const movietitle = document.createElement("h2");
      movietitle.textContent = element?.title;

      const year = document.createElement("p");
      year.textContent = `Year: ${element?.year}`;
      const type = document.createElement("p");
      type.textContent = `Type: ${element?.type}`;

      innerDiv.appendChild(idEle);
      innerDiv.appendChild(movietitle);
      innerDiv.appendChild(year);
      innerDiv.appendChild(type);

      mainCard.appendChild(innerDiv);
      cardContainer.appendChild(mainCard);
    });
  }

  card.append(
    titleContainer,
    line,
    visibility,
    numberofMovies,
    addedBy,
    lineTwo,
    cardContainer
  );

  playlistElement.appendChild(card);
}

async function getData() {
  linkGetElement.textContent = window.location.href;

  const token = JSON.parse(localStorage.getItem("token")) || "";

  let url = new URL(window.location.href);
  let searchParams = new URLSearchParams(url.search);
  const id = searchParams.get("playlistId") || "0";

  await fetch(`http://localhost:5000/playlist/${id}`, {
    headers: {
      authorization: `bearer ${token}`,
    },
  }).then(async (res) => {
    if (res.ok) {
      const result = await res.json();
      await generatePlaylist(result.playlist);
    } else {
      const result = await res.json();
      const errorElement = document.createElement("p");
      errorElement.className = "text-center my-heading";
      errorElement.textContent = result?.message || "failed to fetch playlist";
      playlistElement.appendChild(errorElement);
      // alert(result?.message || "failed to fetch options");
    }
  });
  //   generatePlaylist();
}

window.onload = getData();

function openShareModal() {
  if (modalShareElement.classList.contains("open-dialog")) {
    modalShareElement.classList.remove("open-dialog");
    modalShareElement.classList.add("close-dialog");
  } else {
    modalShareElement.classList.remove("close-dialog");
    modalShareElement.classList.add("open-dialog");
  }
}

function copyToClipboard() {
  navigator.clipboard.writeText(window.location.href);
  alert("Link copied to clipboard");
}
