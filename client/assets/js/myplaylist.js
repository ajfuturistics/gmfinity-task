const cardContainerElement = document.getElementById("playlist-container");
var dialogElement = document.getElementById("update-modal-dialog");
var adddModalElement = document.getElementById("add-modal-dialog");

var updateTitleElement = document.getElementById("updatetitle");
var updateShareElement = document.getElementById("updateshare");
var updateIdElement = document.getElementById("updateid");

var addTitleElement = document.getElementById("addtitle");
var addShareElement = document.getElementById("addshare");

function addModal() {
  const token = JSON.parse(localStorage.getItem("token"));

  if (!token) {
    alert("Login to create");
    return;
  }

  if (adddModalElement.classList.contains("open-dialog")) {
    adddModalElement.classList.remove("open-dialog");
    adddModalElement.classList.add("close-dialog");
  } else {
    adddModalElement.classList.remove("close-dialog");
    adddModalElement.classList.add("open-dialog");
  }
}

function updateModal(element) {
  const token = JSON.parse(localStorage.getItem("token"));

  if (!token) {
    alert("Login to update");
    return;
  }

  if (dialogElement.classList.contains("open-dialog")) {
    dialogElement.classList.remove("open-dialog");
    dialogElement.classList.add("close-dialog");
  } else {
    dialogElement.classList.remove("close-dialog");
    dialogElement.classList.add("open-dialog");

    updateShareElement.value = element?.share || "private";
    updateTitleElement.value = element?.title || "";
    updateIdElement.value = element._id || "";
  }
}

function generatePlaylists(data) {
  data.forEach((element) => {
    const card = document.createElement("div");
    card.className = "playlist-card";

    const title = document.createElement("h3");
    title.textContent = element.title;
    const line = document.createElement("hr");
    line.className = "my-heading";

    const visibility = document.createElement("p");
    visibility.textContent = `Visibility: ${element.share}`;

    const numberofMovies = document.createElement("p");
    numberofMovies.textContent = `Movies added: ${
      element?.movies?.length || 0
    }`;

    const addedBy = document.createElement("p");
    addedBy.textContent = `Added by: ${element?.userId?.username}`;

    const updatebtn = document.createElement("button");
    updatebtn.textContent = "Update";
    updatebtn.addEventListener("click", () => {
      updateModal(element);
    });

    const deletebtn = document.createElement("button");
    deletebtn.textContent = "Delete";
    deletebtn.addEventListener("click", () => {
      handleDeletePlaylist(element._id);
    });

    card.append(
      title,
      line,
      visibility,
      numberofMovies,
      addedBy,
      updatebtn,
      deletebtn
    );
    cardContainerElement.appendChild(card);
  });
}

async function onLoadFunction() {
  const token = JSON.parse(localStorage.getItem("token"));

  if (!token) {
    alert("Login to access this page");
    window.location.href = "/";
    return;
  } else {
    await fetch(`http://localhost:5000/playlist`, {
      headers: {
        authorization: `bearer ${token}`,
      },
    }).then(async (res) => {
      if (res.ok) {
        const result = await res.json();
        generatePlaylists(result.playlists);
      } else {
        const result = await res.json();
        alert(result?.message || "failed to login");
      }
    });
  }
}

window.onload = onLoadFunction();

async function handleAddPlaylist() {
  if (
    addTitleElement.value.trim() === "" ||
    addShareElement.value.trim() === ""
  ) {
    alert("Enter valid details");
    return;
  }
  const token = JSON.parse(localStorage.getItem("token"));

  await fetch(`http://localhost:5000/playlist`, {
    method: "POST",
    headers: {
      authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: addTitleElement.value,
      share: addShareElement.value,
      movies: [],
    }),
  }).then(async (res) => {
    if (res.ok) {
      const result = await res.json();
      console.log(result);
      window.location.reload();
    } else {
      const result = await res.json();
      alert(result?.message || "something went wrong");
    }
  });
}
async function handleUpdatePlaylist() {
  if (
    updateTitleElement.value.trim() === "" ||
    updateShareElement.value.trim() === ""
  ) {
    alert("Enter valid details");
    return;
  }
  const token = JSON.parse(localStorage.getItem("token"));

  await fetch(`http://localhost:5000/playlist/${updateIdElement.value}`, {
    method: "PUT",
    headers: {
      authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: updateTitleElement.value,
      share: updateShareElement.value,
    }),
  }).then(async (res) => {
    if (res.ok) {
      const result = await res.json();
      console.log(result);
      window.location.reload();
    } else {
      const result = await res.json();
      alert(result?.message || "something went wrong");
    }
  });
}
async function handleDeletePlaylist(id) {
  const isDelete = confirm("Are you sure want to delete this playlist");
  if (!isDelete) {
    return;
  }
  const token = JSON.parse(localStorage.getItem("token"));

  await fetch(`http://localhost:5000/playlist/${id}`, {
    method: "DELETE",
    headers: {
      authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then(async (res) => {
    if (res.ok) {
      const result = await res.json();
      console.log(result);
      alert(result?.message || "Playlist deleted successfully");
      window.location.reload();
    } else {
      const result = await res.json();
      alert(result?.message || "something went wrong");
    }
  });
}
