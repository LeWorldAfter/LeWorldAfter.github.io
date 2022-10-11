function getFileName(str){
    return str.substring(str.lastIndexOf('/') + 1);
}

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