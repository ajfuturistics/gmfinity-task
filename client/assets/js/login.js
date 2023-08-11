const usernameElement = document.getElementById("username");
const passwordElement = document.getElementById("password");

async function login() {
  if (
    usernameElement.value.trim() === "" ||
    passwordElement.value.trim() === ""
  ) {
    alert("Enter valid username and password");
    return;
  }

  await fetch(`https://gmfinity-task.vercel.app/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: usernameElement.value,
      password: passwordElement.value,
    }),
  }).then(async (res) => {
    if (res.ok) {
      const result = await res.json();
      localStorage.setItem("token", JSON.stringify(result.token));
      window.location.href = "/";
    } else {
      const result = await res.json();
      alert(result?.message || "failed to login");
    }
  });
}
async function register() {
  if (
    usernameElement.value.trim() === "" ||
    passwordElement.value.trim() === ""
  ) {
    alert("Enter valid username and password");
    return;
  }

  await fetch(`https://gmfinity-task.vercel.app/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: usernameElement.value,
      password: passwordElement.value,
    }),
  }).then(async (res) => {
    if (res.ok) {
      const result = await res.json();
      localStorage.setItem("token", JSON.stringify(result.token));
      window.location.href = "/";
    } else {
      const result = await res.json();
      alert(result?.message || "failed to login");
    }
  });
}
