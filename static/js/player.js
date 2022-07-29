var skinSideBar = document.getElementById("skinSideBar");
var skinEditBtn = document.getElementById("skinEditBtn");

// console.log("Skin Edit Button:", skinEditBtn);
skinEditBtn.addEventListener("click", () => {
    skinSideBar.classList.toggle("active-sidebar");
    if(skinEditBtn.innerHTML == "Edit Skin")
        skinEditBtn.innerHTML = "Close";
    else
        skinEditBtn.innerHTML = "Edit Skin";
});

var downloadBtn = document.getElementById("downloadBtn");
var skinCarouselInner = document.getElementById("skinCarouselInner");

downloadBtn.addEventListener("click", () => {
    console.log("Click!");
    // skinCarouselInner.getElementsByClassName("active")[0];
});