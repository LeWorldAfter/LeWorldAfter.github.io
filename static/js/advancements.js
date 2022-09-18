import netherJsonGlobal from '../json/advancements-json/Nether_Advancements.json' assert {type: 'json'};
import adventureJsonGlobal from '../json/advancements-json/Adventure_Advancements.json' assert {type: 'json'};
import theEndJsonGlobal from '../json/advancements-json/The_End_Advancements.json' assert {type: 'json'};
import husbandryJsonGlobal from '../json/advancements-json/Husbandry_Advancements.json' assert {type: 'json'};
import minecraftJsonGlobal from '../json/advancements-json/Minecraft_Advancements.json' assert {type: 'json'};


let netherJsonPath = document.getElementById('advancementScript').getAttribute('netherJsonParam');
let adventureJsonPath = document.getElementById('advancementScript').getAttribute('adventureJsonParam');
let theEndJsonPath = document.getElementById('advancementScript').getAttribute('theEndJsonParam');
let husbandryJsonPath = document.getElementById('advancementScript').getAttribute('husbandryJsonParam');
let minecraftJsonPath = document.getElementById('advancementScript').getAttribute('minecraftJsonParam');


function getCompletion(amount, capacity) {
    return`
    ${amount}/${capacity}
    `
}

function addNodeElem(jsonFile, jsonFileGlobal) {
    let id = jsonFileGlobal.id;
    let title = jsonFileGlobal.title;
    let description = jsonFileGlobal.description;
    let type = jsonFileGlobal.type;
    let capacity = jsonFileGlobal.capacity;
    let isComplete = jsonFile[id];

    let completionPerc = 0;

    let completionPercStyling;

    let completeString;
    if(isComplete === true)
        completeString = "complete";
    else if(isComplete === false)
        completeString = "incomplete";
    else{
        completionPerc = (isComplete / capacity) * 100;
        completionPercStyling = `style="background:linear-gradient(to right, #b98f2c ${completionPerc}%, #036a96 1px)"`
        if(capacity && isComplete >= capacity)
            completeString = "complete";
        else
            completeString = "incomplete";
    }

    return `
        <div class="node__element">
            <div class="advancement-frame ${type}-${completeString}-frame">
                <div class="advancement-icon ${id}-advancement-icon"></div>
            </div>
            <div class="container-fluid advancement-detailed">
                <div class="advancement-banner ${completeString === "complete" ? "advancement-complete-banner" : ''}" ${capacity ? completionPercStyling : ''}>
                    ${title}${capacity ? getCompletion(isComplete, capacity) : ''}
                </div>
                <div class="advancement-body ${type === "challenge" ? "advancement-challenge-body" : ''}">
                    ${description}
                </div>
            </div>
        </div>
    `
}

function addChildElem(jsonFile, jsonFileGlobal) {
    return `
        <div class="node__line"></div>
        <div class="node__children__line"></div>
        <div class="node__children">
            ${jsonFileGlobal.map((node) => {
                return `
                    <div class="node">
                        <div class="node__line__before"></div>
                        ${addNodeElem(jsonFile, node)}
                        ${node.children ? addChildElem(jsonFile, node.children) : ''}
                    </div>
                `
            }).join('')}
        </div>
    `
}

function renderTree(jsonFile, jsonFileGlobal) {
    return `
        <div class="node node--root">
            ${addNodeElem(jsonFile, jsonFileGlobal)}
            ${jsonFileGlobal.children ? addChildElem(jsonFile, jsonFileGlobal.children) : ''}
        </div>
    `
}

// Nether Json File Mapping
fetch(netherJsonPath)
.then(res => res.json())
.then(netherJson => {
    document.getElementById("netherSection").innerHTML = renderTree(netherJson, netherJsonGlobal)
})
.then(() => {
    const advancementRadioElems = document.querySelector(".advancements").querySelectorAll("input[type=radio]");
    const firstSectionElem = advancementRadioElems[0].nextElementSibling.nextElementSibling.querySelector(".advancementSection");
    
    getChildLineHeight(firstSectionElem);

    Array.from(advancementRadioElems).forEach((radioElem, ind) => {
        if(!ind)
            return;
        
        let sectionElem = radioElem.nextElementSibling.nextElementSibling.querySelector(".advancementSection");
    
        radioElem.addEventListener("change", (e) => {
            getChildLineHeight(sectionElem);
        }, {once : true});
    });
});

// Adventure Json File Mapping
fetch(adventureJsonPath)
.then(res => res.json())
.then(adventureJson => {
    document.getElementById("adventureSection").innerHTML = renderTree(adventureJson, adventureJsonGlobal)
});

// The End Json File Mapping
fetch(theEndJsonPath)
.then(res => res.json())
.then(theEndJson => {
    document.getElementById("endSection").innerHTML = renderTree(theEndJson, theEndJsonGlobal)
});

// Husbandry Json File Mapping
fetch(husbandryJsonPath)
.then(res => res.json())
.then(husbandryJson => {
    document.getElementById("husbandrySection").innerHTML = renderTree(husbandryJson, husbandryJsonGlobal)
});

// Minecraft Json File Mapping
fetch(minecraftJsonPath)
.then(res => res.json())
.then(minecraftJson => {
    document.getElementById("minecraftSection").innerHTML = renderTree(minecraftJson, minecraftJsonGlobal)
});

// Getting accurate height for lines
function getChildLineHeight(sectionElem) {
    let childLineElems = sectionElem.querySelectorAll(".node__children__line");

    Array.from(childLineElems).forEach(childLineElem => {
        let firstChildElem = childLineElem.nextElementSibling.firstElementChild.querySelector(".node__element");
        let firstChildTop = firstChildElem.getBoundingClientRect().top;

        let lastChildElem = childLineElem.nextElementSibling.lastElementChild.querySelector(".node__element");
        let lastChildTop = lastChildElem.getBoundingClientRect().top;

        let childLineElemHeight = (lastChildTop - firstChildTop) + 5 + "px";
        childLineElem.style.height = childLineElemHeight;

        let childLineElemTop = childLineElem.getBoundingClientRect().top;
        let firstChildElemHeight = firstChildElem.getBoundingClientRect().height;

        let heightDiff = childLineElemTop - firstChildTop - (firstChildElemHeight / 2) + 2.5 + "px";
        childLineElem.style.bottom = heightDiff;
        // heightDiff = heightDiff < 0 ? (heightDiff * -1) : heightDiff;

        // let childLineElemHeight = childElemHeight - frameHeight - 20;
        console.log("First Child Elem Height: ", firstChildTop);
        console.log("Last Child Elem Height: ", lastChildTop);
        console.log("Child Line Elem Height: ", childLineElemHeight);
        console.log("Height Diff: ", heightDiff);
    });
}

// Drag Functionality
const advancementSections = document.querySelectorAll(".advancementSection");

Array.from(advancementSections).forEach(slider => {
    let isDown = false;
    let startX;
    let scrollLeft;
    let startY;
    let scrollTop;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        scrollLeft = slider.scrollLeft;
        scrollTop = slider.scrollTop;
        startX = e.pageX - slider.offsetLeft;
        startY = e.pageY - slider.offsetTop;
        console.log(startX);
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
    });

    slider.addEventListener('mousemove', (e) => {
        if(!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const y = e.pageY - slider.offsetTop;
        const walkX = (x - startX) * 1
        const walkY = (y - startY) * 1;
        slider.scrollLeft = scrollLeft - walkX;
        slider.scrollTop = scrollTop - walkY;
    });
});

