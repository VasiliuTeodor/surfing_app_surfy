const clickLogin = async (event) => {
  const getUsers = "https://6232e7d76de3467dbac2d149.mockapi.io/user";

  const userName = document.querySelector("#username").value;
  const userPassword = document.querySelector("#password").value;

  const login = await fetch(getUsers, {
    method: "GET",
  });
  // const users = await login.text();
  const users = await login.json();

  users.forEach((user, element) => {
    if (
      userName === user.name ||
      (userName === user.email && userPassword === user.password)
    ) {
      // TO DO
      localStorage.setItem("user", user.id);
      location.href = "index.html";
      return;
    }
  });

  console.log("Failed to login");
};

document.querySelector(".btn").addEventListener("click", clickLogin);

window.addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    if (
      event.target.matches("body") ||
      event.target.matches("#password") ||
      event.target.matches("#username")
    ) {
      clickLogin();
    }
  }
});
