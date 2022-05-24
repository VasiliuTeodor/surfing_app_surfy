const searchBar = document.querySelector(".search-bar");
const spotsList = document.querySelector(".container");

function checkLogin() {
  const userLogo = document.querySelector(".logout-btn");

  if (localStorage.getItem("user")) {
    userLogo.innerText = "Logout";
  } else {
    userLogo.innerText = "Login";
  }
}
checkLogin();

const getSpots = async () => {
  try {
    const getAllSpots = "https://6232e7d76de3467dbac2d149.mockapi.io/spot";
    const response = await fetch(getAllSpots);
    const spots = await response.json();

    displaySpots(spots);
  } catch (error) {
    console.log(error);
  }
};

window.addEventListener("load", getSpots);

const displaySpots = (spots) => {
  const spotsTable = spots
    .map((spot) => {
      return `
    <tr class="table-rows">
    <td class="table-row">${spot.name}</td>
    <td class="table-row country">${spot.country}</td>
    <td class="table-row ">${spot.lat}</td>
    <td class="table-row ">${spot.long}</td>
    <td class="table-row ">${spot.probability}%</td>
    <td class="table-row ">${spot.month}</td>
    </tr>
  `;
    })
    .join("");
  spotsList.innerHTML += spotsTable;
};

document
  .querySelector(".img-user")
  .addEventListener("click", function logout() {
    document.querySelector(".logout-btn").classList.toggle("logout-btn-show");
  });

document.querySelector(".logout-btn").addEventListener("click", () => {
  if (localStorage.getItem("user")) {
    location.href = "login.html";
    localStorage.removeItem("user");
  } else {
    location.href = "login.html";
  }
});

searchBar.addEventListener("keyup", (spots) => {
  const filteredSpots = [spots].filter((spot) => {
    return spot.name.toLowerCase().includes(searchBar.value);
  });
  console.log(filteredSpots);
  displaySpots(filteredSpots);
});

function initMap() {
  const markerBtn = `<div><button class="fav-btn">Add to favorites</button></div>`;

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 49.30998521731613, lng: -2.925218573532669 },
    zoom: 5,
    mapId: "e938c394dd3d50ae",
    mapTypeControl: false,
    streetViewControl: false,
  });

  const markers = [
    ["kite spot", 49.30998521731613, -2.925218573532669],
    ["kite spot", 52.594617400068564, -4.465434677789958],
    ["kite spot", 54.13605690307553, 14.414633757621088],
    ["kite spot", 44.17437591441193, 8.849982026110894],
    ["kite spot from api", 4.0294, 8.7876],
  ];

  for (let i = 0; i < markers.length; i++) {
    const currentMarker = markers[i];
    const marker = new google.maps.Marker({
      position: { lat: currentMarker[1], lng: currentMarker[2] },
      map,
      title: currentMarker[0],
      icon: { url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" },
    });
    const infowindow = new google.maps.InfoWindow({
      content: markerBtn,
    });

    marker.addListener("click", () => {
      infowindow.open({
        anchor: marker,
        map,
        shouldFocus: false,
      });
    });
  }

  window.addEventListener("click", async (event) => {
    if (event.target.classList.contains("fav-btn")) {
      const respone = await fetch(
        "https://6232e7d76de3467dbac2d149.mockapi.io/favourites",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            spot: Map.random,
          }),
        }
      );
    }
  });
}

async function saluteUser(user) {
  const users = await fetch("https://6232e7d76de3467dbac2d149.mockapi.io/user");
  const results = await users.json();

  const checkUser = localStorage.getItem("user");

  results.forEach((result) => {
    if (result.id === checkUser) {
      document.querySelector(".user-name").innerHTML = "Hello, " + result.name;
      document.querySelector(
        ".user-image-div"
      ).innerHTML = `<img src='${result.avatar}' alt="" class="user-image" /> `;
      return;
    } else if (!checkUser) {
      document.querySelector(".user-name").innerHTML =
        "Hello, anon" + Math.floor(Math.random() * 201);
      return;
    }
    console.log("Finding user failed");
  });

  // results.filter((result) => {
  //   if (result.id === "3") {
  //     console.log(result.name);
  //   }
  // });
}
saluteUser();

window.addEventListener("click", (event) => {
  const sideMenu = document.querySelector(".side-menu");
  const overlayDiv = document.querySelector(".overlay");
  const click = event.target;

  if (click.matches(".open") || click.matches(".menu-bar")) {
    sideMenu.classList.add("show-side-menu-overlay");
    overlayDiv.classList.add("side-menu-overlay");
  }

  if (click.matches(".close-side-menu") || click.matches(".overlay")) {
    sideMenu.classList.remove("show-side-menu-overlay");
    overlayDiv.classList.remove("side-menu-overlay");
  }
});
