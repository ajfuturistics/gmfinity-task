var dynamicLinkElement = document.getElementById("dynamic-link");
var logoutElement = document.getElementById("logout");

function createfn() {
  const token = localStorage.getItem("token");

  if (token) {
    dynamicLinkElement.href = "myplaylist.html";
    dynamicLinkElement.textContent = "My Playlists";
    logoutElement.style.display = "block";
    if (
      window.location.pathname.includes("login.html") ||
      window.location.pathname.includes("register.html")
    ) {
      window.location.href = "/";
    }
  } else {
    dynamicLinkElement.href = "login.html";
    dynamicLinkElement.textContent = "Login";
    logoutElement.style.display = "none";
  }
}

function handleLogout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}

window.onload = createfn();
