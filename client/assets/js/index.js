var searchElement = document.getElementById("search");
var cardContainerElement = document.getElementById("card-container");
var dialogElement = document.getElementById("modal-dialog");
var selectElement = document.getElementById("select-playlist");
var btnConfirmATP = document.getElementById("modal-btn-confirm");

async function handleSearch() {
  if (searchElement.value.trim() === "") {
    alert("Enter search value");
    return;
  }

  const data = await fetch(
    `http://localhost:5000/movie?search=${searchElement.value}`
  ).then(async (res) => {
    if (res.ok) {
      const result = await res.json();
      return result.data.Search;
    } else {
      alert("failed to fetch data");
      return [];
    }
  });

  createSearchElements(data);
}

async function addOptionsInSelect(options) {
  console.log(options);
  options.forEach((item) => {
    const option = document.createElement("option");
    option.value = item?._id;
    option.textContent = item?.title;

    selectElement.appendChild(option);
  });
}

async function handleAddToPlaylist(data) {
  const token = JSON.parse(localStorage.getItem("token"));

  await fetch(`http://localhost:5000/playlist/${selectElement.value}`, {
    method: "POST",
    headers: {
      authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      movie: {
        movieId: data?.imdbID,
        title: data?.Title,
        poster: data?.Poster,
        year: data?.Year,
        type: data?.Type,
      },
    }),
  }).then(async (res) => {
    if (res.ok) {
      const result = await res.json();
      console.log(result);
      alert("Movie added to playlist successfully");
      window.location.reload();
    } else {
      const result = await res.json();
      alert(result?.message || "something went wrong");
    }
  });
}

async function openDialog(data) {
  const token = JSON.parse(localStorage.getItem("token"));
  if (!token) {
    alert("Login to add this movie to playlist");
    return;
  }

  if (dialogElement.classList.contains("open-dialog")) {
    dialogElement.classList.remove("open-dialog");
    dialogElement.classList.add("close-dialog");
  } else {
    dialogElement.classList.remove("close-dialog");
    dialogElement.classList.add("open-dialog");

    btnConfirmATP.addEventListener("click", () => {
      handleAddToPlaylist(data);
    });

    await fetch(`http://localhost:5000/playlist`, {
      headers: {
        authorization: `bearer ${token}`,
      },
    }).then(async (res) => {
      if (res.ok) {
        const result = await res.json();
        await addOptionsInSelect(result.playlists);
      } else {
        const result = await res.json();
        alert(result?.message || "failed to fetch options");
      }
    });
  }
}

function createSearchElements(data) {
  data.forEach((element) => {
    const mainCard = document.createElement("div");
    mainCard.className = "movie";
    const poster = document.createElement("img");
    poster.src = element.Poster;
    poster.alt = element.Title;

    mainCard.appendChild(poster);

    const innerDiv = document.createElement("div");

    const title = document.createElement("h2");
    title.textContent = element.Title;

    const year = document.createElement("p");
    year.textContent = element.Year;
    const type = document.createElement("p");
    type.textContent = element.Type;

    const addPlaylistBtn = document.createElement("button");
    addPlaylistBtn.textContent = "Add to Playlist";
    addPlaylistBtn.addEventListener("click", () => {
      openDialog(element);
    });

    innerDiv.appendChild(title);
    innerDiv.appendChild(year);
    innerDiv.appendChild(type);
    innerDiv.appendChild(addPlaylistBtn);

    mainCard.appendChild(innerDiv);

    cardContainerElement.appendChild(mainCard);
  });
}
