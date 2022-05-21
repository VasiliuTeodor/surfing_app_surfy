const getUsers = "https://6232e7d76de3467dbac2d149.mockapi.io/user";
const signUpBtn = document.querySelector(".btn");

function selectElement(selector, parent = document) {
  return parent.querySelector(selector);
}

// Avatars

async function showAvatars() {
  try {
    const avatarUrl = await fetch(
      "https://6232e7d76de3467dbac2d149.mockapi.io/avatars"
    );
    const results = await avatarUrl.json();

    const userAvatar = results
      .map(
        (result) => `
      <img src='${result.avatar}' alt='avatar' class="user-avatar" data-avatar/>
    `
      )
      .join("");

    const nextPageAvatars = selectElement(".avatars");
    const signUpInputs = selectElement(".sign-up-inputs");
    nextPageAvatars.classList.add("active");
    signUpInputs.classList.add("inactive");

    selectElement("[data-show-avatars]").innerHTML = userAvatar;
  } catch (error) {
    console.log(error);
  }
}

function showPrevious() {
  const nextPageAvatars = selectElement(".avatars");
  const signUpInputs = selectElement(".sign-up-inputs");
  nextPageAvatars.classList.remove("active");
  signUpInputs.classList.remove("inactive");

  signUpBtn.removeEventListener("click", clickSignUp);
  signUpBtn.addEventListener("click", showAvatars);
  signUpBtn.innerText = "Next";
}

function assignAvatars(event) {
  const click = event.target;

  if (click.matches("[data-avatar]")) {
    const selectedAvatar = click.getAttribute("src");
    console.log(selectedAvatar);
    selectElement("[data-avatar-input]").value = selectedAvatar;
  }
}

document.addEventListener("click", assignAvatars);
selectElement("[data-previous]").addEventListener("click", showPrevious);

// Sign up

const clickSignUp = async (event) => {
  const userName = document.querySelector("#username").value;
  const userEmail = document.querySelector("#email").value;
  const userPassword = document.querySelector("#password").value;
  const confirmPassword = document.querySelector("#conf-password").value;
  const avatarInput = selectElement("[data-avatar-input]").value;

  const postMethod = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: userName,
      email: userEmail,
      password: userPassword,
      avatar: avatarInput,
    }),
  };

  try {
    if (
      confirm(
        `Are you sure you want to make an account with the name of ${userName}?`
      )
    ) {
      if (userName && userPassword && userEmail) {
        if (userPassword === confirmPassword) {
          const login = await fetch(getUsers, postMethod);
          location.href = "login.html";
        } else {
          alert("Passwords do not match");
        }
      } else if (!userName || !userPassword || !userEmail) {
        alert("Please fill all the fields");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

signUpBtn.addEventListener("click", showAvatars);
// add new event listener to allow signing up
document.addEventListener("click", (event) => {
  const click = event.target;

  if (click.matches(".btn")) {
    signUpBtn.removeEventListener("click", showAvatars);
    signUpBtn.addEventListener("click", clickSignUp);
    signUpBtn.innerText = "Sign up";
  }
});

// allow enter key to execute sign up
window.addEventListener("keyup", (event) => {
  if (selectElement(".inputs").classList.contains("inactive")) {
    if (event.key == "Enter") {
      if (
        event.target.matches("body") ||
        event.target.matches("#password") ||
        event.target.matches("#username")
      ) {
        clickSignUp();
      }
    }
  } else {
    if (event.key == "Enter") {
      showAvatars();
    }
  }
});

// Check if inputs have data
function checkInputData() {
  const inputs = document.querySelectorAll(".user-input");

  inputs.forEach((input) => {
    if (input.value === "") {
      input.classList.add("invalid-data-input");
    } else if (input.value !== "") {
      input.classList.remove("invalid-data-input");
    }
  });
}

document.querySelector(".btn").addEventListener("click", checkInputData);

window.addEventListener("click", (event) => {
  if (event.target.matches(".user-input")) {
    event.target.classList.remove("invalid-data-input");
  }
});
