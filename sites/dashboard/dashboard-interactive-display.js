let highestZIndex = 1; //The z index of the navbar, arbitrarily set by bootstrap
let arraySizes = []; //This is an array that stores the original sizes of the col boxes
let resizeFlag = true; //We fill the arraySizes array up whenever we detect that this is a new window/resized window

function initInteractivePage() {
    //First fill of Array sizes
    fillArraySizes();
    //Adjust the boxes width based on screen
    adjustBoxesWidth();
    //Setup the col boxes
    initColBoxes();
    //Init the draggable objects
    initDraggableObjects();
    //Adjust the Boxes Sizes

    window.addEventListener("resize", function () {
        resetEverything();
    });

    //Record the array sizes when there is a click on the document (after a fresh resize event)
    document.onmousedown = fillArraySizes;
}

function resetEverything() {
    resetDraggableBoxes(); //reset transforms and resizes, set position static
    let colBoxes = document.querySelectorAll(".col-box");
    for (let i = 0; i < colBoxes.length; i++) {
        //reset col-boxes for bootstrap grid to adjust
        removeDimensions(colBoxes[i]);
        positionNull(colBoxes[i]);
    }

    //reinitiate everything that was reset on mouse up
    initColBoxes();
    let draggableObjects = document.querySelectorAll(".draggable");
    for (let i = 0; i < draggableObjects.length; i++) {
        positionAbsolute(draggableObjects[i]);
    }
    adjustBoxesWidth();
}

function adjustBoxesWidth() {
    if (window.innerWidth > 1800) {
        document.querySelector("#col-resizable-1 .draggable-infobox").style.left = 0;
        document.querySelector("#col-resizable-3 .draggable-infobox").style.right = 0;
        document.querySelector("#col-resizable-4 .draggable-infobox").style.left = 0;
        document.querySelector("#col-resizable-5 .draggable-infobox").style.right = 0;
        document.querySelector("#col-resizable-1").classList.remove("col-4");
        document.querySelector("#col-resizable-2").classList.remove("col-4");
        document.querySelector("#col-resizable-3").classList.remove("col-4");
        document.querySelector("#col-resizable-chart-1 .draggable-charts").style.left = 0;
        document.querySelector("#col-resizable-chart-3 .draggable-charts").style.right = 0;
        document.querySelector("#col-resizable-chart-4 .draggable-charts").style.left = 0;
        document.querySelector("#col-resizable-chart-5 .draggable-charts").style.right = 0;
        document.querySelector("#col-resizable-chart-1").classList.remove("col-4");
        document.querySelector("#col-resizable-chart-2").classList.remove("col-4");
        document.querySelector("#col-resizable-chart-3").classList.remove("col-4");
        document.querySelector("#col-resizable-chart-6 .draggable-charts").style.left = 0;
        document.querySelector("#col-resizable-chart-8 .draggable-charts").style.right = 0;
        document.querySelector("#col-resizable-chart-9 .draggable-charts").style.left = 0;
        document.querySelector("#col-resizable-chart-10 .draggable-charts").style.right = 0;
        document.querySelector("#col-resizable-chart-6").classList.remove("col-4");
        document.querySelector("#col-resizable-chart-7").classList.remove("col-4");
        document.querySelector("#col-resizable-chart-8").classList.remove("col-4");
        let allDOM1 = document.querySelectorAll(".draggable-infobox");
        for (let i of allDOM1) {
            i.style.width = Math.max(window.innerWidth / 6, 357) + "px";
        }
        let allDOM2 = document.querySelectorAll(".draggable-charts");
        for (let i of allDOM2) {
            i.style.width = Math.max(window.innerWidth / 6, 357) + "px";
            i.style.height = 230 + Math.max(window.innerWidth / 6, 357) - 357 + "px";
        }
    } else if (window.innerWidth > 1426) {
        document.querySelector("#col-resizable-1").classList.add("col-4");
        document.querySelector("#col-resizable-2").classList.add("col-4");
        document.querySelector("#col-resizable-3").classList.add("col-4");
        document.querySelector("#col-resizable-1 .draggable-infobox").style.left = "auto";
        document.querySelector("#col-resizable-3 .draggable-infobox").style.right = "auto";
        document.querySelector("#col-resizable-4 .draggable-infobox").style.left = "auto";
        document.querySelector("#col-resizable-5 .draggable-infobox").style.right = "auto";
        document.querySelector("#col-resizable-chart-1").classList.add("col-4");
        document.querySelector("#col-resizable-chart-2").classList.add("col-4");
        document.querySelector("#col-resizable-chart-3").classList.add("col-4");
        document.querySelector("#col-resizable-chart-1 .draggable-charts").style.left = "auto";
        document.querySelector("#col-resizable-chart-3 .draggable-charts").style.right = "auto";
        document.querySelector("#col-resizable-chart-4 .draggable-charts").style.left = "auto";
        document.querySelector("#col-resizable-chart-5 .draggable-charts").style.right = "auto";
        document.querySelector("#col-resizable-chart-6").classList.add("col-4");
        document.querySelector("#col-resizable-chart-7").classList.add("col-4");
        document.querySelector("#col-resizable-chart-8").classList.add("col-4");
        document.querySelector("#col-resizable-chart-6 .draggable-charts").style.left = "auto";
        document.querySelector("#col-resizable-chart-8 .draggable-charts").style.right = "auto";
        document.querySelector("#col-resizable-chart-9 .draggable-charts").style.left = "auto";
        document.querySelector("#col-resizable-chart-10 .draggable-charts").style.right = "auto";
    } else if (window.innerWidth > 1090) {
        document.querySelector("#col-resizable-1").classList.remove("col-4");
        document.querySelector("#col-resizable-2").classList.remove("col-4");
        document.querySelector("#col-resizable-3").classList.remove("col-4");
        document.querySelector("#col-resizable-chart-1").classList.remove("col-4");
        document.querySelector("#col-resizable-chart-2").classList.remove("col-4");
        document.querySelector("#col-resizable-chart-3").classList.remove("col-4");
        document.querySelector("#col-resizable-chart-6").classList.remove("col-4");
        document.querySelector("#col-resizable-chart-7").classList.remove("col-4");
        document.querySelector("#col-resizable-chart-8").classList.remove("col-4");
        document.querySelector("#col-resizable-1 .draggable-infobox").style.left = 0;
        document.querySelector("#col-resizable-3 .draggable-infobox").style.right = 0;
        document.querySelector("#col-resizable-4 .draggable-infobox").style.left = 0;
        document.querySelector("#col-resizable-5 .draggable-infobox").style.right = 0;
        document.querySelector("#col-resizable-chart-1 .draggable-charts").style.left = 0;
        document.querySelector("#col-resizable-chart-3 .draggable-charts").style.right = 0;
        document.querySelector("#col-resizable-chart-4 .draggable-charts").style.left = 0;
        document.querySelector("#col-resizable-chart-5 .draggable-charts").style.right = 0;
        document.querySelector("#col-resizable-chart-6 .draggable-charts").style.left = 0;
        document.querySelector("#col-resizable-chart-8 .draggable-charts").style.right = 0;
        document.querySelector("#col-resizable-chart-9 .draggable-charts").style.left = 0;
        document.querySelector("#col-resizable-chart-10 .draggable-charts").style.right = 0;
        document.querySelector("#col-resizable-1").classList.remove("col-5");
        document.querySelector("#col-resizable-2").classList.remove("col-5");
        document.querySelector("#col-resizable-3").classList.remove("col-5");
        document.querySelector("#col-resizable-4").classList.remove("col-5");
        document.querySelector("#col-resizable-1 .draggable-infobox").style.left = 0;
        document.querySelector("#col-resizable-2 .draggable-infobox").style.right = 0;
        document.querySelector("#col-resizable-3 .draggable-infobox").style.left = 0;
        document.querySelector("#col-resizable-4 .draggable-infobox").style.right = 0;
        document.querySelector("#col-resizable-chart-1").classList.remove("col-5");
        document.querySelector("#col-resizable-chart-2").classList.remove("col-5");
        document.querySelector("#col-resizable-chart-3").classList.remove("col-5");
        document.querySelector("#col-resizable-chart-4").classList.remove("col-5");
        document.querySelector("#col-resizable-chart-1 .draggable-charts").style.left = 0;
        document.querySelector("#col-resizable-chart-2 .draggable-charts").style.right = 0;
        document.querySelector("#col-resizable-chart-3 .draggable-charts").style.left = 0;
        document.querySelector("#col-resizable-chart-4 .draggable-charts").style.right = 0;
        document.querySelector("#col-resizable-chart-6").classList.remove("col-5");
        document.querySelector("#col-resizable-chart-7").classList.remove("col-5");
        document.querySelector("#col-resizable-chart-8").classList.remove("col-5");
        document.querySelector("#col-resizable-chart-9").classList.remove("col-5");
        document.querySelector("#col-resizable-chart-6 .draggable-charts").style.left = 0;
        document.querySelector("#col-resizable-chart-7 .draggable-charts").style.right = 0;
        document.querySelector("#col-resizable-chart-8 .draggable-charts").style.left = 0;
        document.querySelector("#col-resizable-chart-9 .draggable-charts").style.right = 0;
    } else if (window.innerWidth > 800) {
        document.querySelector("#col-resizable-1").classList.add("col-5");
        document.querySelector("#col-resizable-2").classList.add("col-5");
        document.querySelector("#col-resizable-3").classList.add("col-5");
        document.querySelector("#col-resizable-4").classList.add("col-5");
        document.querySelector("#col-resizable-1 .draggable-infobox").style.left = "auto";
        document.querySelector("#col-resizable-2 .draggable-infobox").style.right = "auto";
        document.querySelector("#col-resizable-3 .draggable-infobox").style.left = "auto";
        document.querySelector("#col-resizable-4 .draggable-infobox").style.right = "auto";
        document.querySelector("#col-resizable-chart-1").classList.add("col-5");
        document.querySelector("#col-resizable-chart-2").classList.add("col-5");
        document.querySelector("#col-resizable-chart-3").classList.add("col-5");
        document.querySelector("#col-resizable-chart-4").classList.add("col-5");
        document.querySelector("#col-resizable-chart-1 .draggable-charts").style.left = "auto";
        document.querySelector("#col-resizable-chart-2 .draggable-charts").style.right = "auto";
        document.querySelector("#col-resizable-chart-3 .draggable-charts").style.left = "auto";
        document.querySelector("#col-resizable-chart-4 .draggable-charts").style.right = "auto";
        document.querySelector("#col-resizable-chart-6").classList.add("col-5");
        document.querySelector("#col-resizable-chart-7").classList.add("col-5");
        document.querySelector("#col-resizable-chart-8").classList.add("col-5");
        document.querySelector("#col-resizable-chart-9").classList.add("col-5");
        document.querySelector("#col-resizable-chart-6 .draggable-charts").style.left = "auto";
        document.querySelector("#col-resizable-chart-7 .draggable-charts").style.right = "auto";
        document.querySelector("#col-resizable-chart-8 .draggable-charts").style.left = "auto";
        document.querySelector("#col-resizable-chart-9 .draggable-charts").style.right = "auto";
        let allDOM1 = document.querySelectorAll(".draggable-infobox");
        for (let i of allDOM1) {
            i.style.width = "357px";
        }
        let allDOM2 = document.querySelectorAll(".draggable-charts");
        for (let i of allDOM2) {
            i.style.width = "357px";
            i.style.height = "230px";
        }
        let allDOM3 = document.querySelectorAll(".draggable-flexi");
        for (let i of allDOM3) {
            i.style.width = "714px";
            i.style.height = "460px";
        }
    } else if (window.innerWidth > 725) {
        document.querySelector("#col-resizable-1").classList.remove("col-5");
        document.querySelector("#col-resizable-2").classList.remove("col-5");
        document.querySelector("#col-resizable-3").classList.remove("col-5");
        document.querySelector("#col-resizable-4").classList.remove("col-5");
        document.querySelector("#col-resizable-1 .draggable-infobox").style.left = 0;
        document.querySelector("#col-resizable-2 .draggable-infobox").style.right = 0;
        document.querySelector("#col-resizable-3 .draggable-infobox").style.left = 0;
        document.querySelector("#col-resizable-4 .draggable-infobox").style.right = 0;
        document.querySelector("#col-resizable-chart-1").classList.remove("col-5");
        document.querySelector("#col-resizable-chart-2").classList.remove("col-5");
        document.querySelector("#col-resizable-chart-3").classList.remove("col-5");
        document.querySelector("#col-resizable-chart-4").classList.remove("col-5");
        document.querySelector("#col-resizable-chart-1 .draggable-charts").style.left = 0;
        document.querySelector("#col-resizable-chart-2 .draggable-charts").style.right = 0;
        document.querySelector("#col-resizable-chart-3 .draggable-charts").style.left = 0;
        document.querySelector("#col-resizable-chart-4 .draggable-charts").style.right = 0;
        document.querySelector("#col-resizable-chart-6").classList.remove("col-5");
        document.querySelector("#col-resizable-chart-7").classList.remove("col-5");
        document.querySelector("#col-resizable-chart-8").classList.remove("col-5");
        document.querySelector("#col-resizable-chart-9").classList.remove("col-5");
        document.querySelector("#col-resizable-chart-6 .draggable-charts").style.left = 0;
        document.querySelector("#col-resizable-chart-7 .draggable-charts").style.right = 0;
        document.querySelector("#col-resizable-chart-8 .draggable-charts").style.left = 0;
        document.querySelector("#col-resizable-chart-9 .draggable-charts").style.right = 0;
        let allDOM1 = document.querySelectorAll(".draggable-infobox");
        for (let i of allDOM1) {
            i.style.width = "357px";
        }
        let allDOM2 = document.querySelectorAll(".draggable-charts");
        for (let i of allDOM2) {
            i.style.width = "357px";
            i.style.height = "230px";
        }
        let allDOM3 = document.querySelectorAll(".draggable-flexi");
        for (let i of allDOM3) {
            i.style.width = "714px";
            i.style.height = "460px";
        }
    } else {
        let allDOM1 = document.querySelectorAll(".draggable-infobox");
        for (let i of allDOM1) {
            i.style.width = window.innerWidth - 30 + "px";
        }
        let allDOM2 = document.querySelectorAll(".draggable-charts");
        for (let i of allDOM2) {
            i.style.width = window.innerWidth - 30 + "px";
            i.style.height = Math.max(window.innerWidth - 100, 230) + "px";
        }
        let allDOM3 = document.querySelectorAll(".draggable-flexi");
        for (let i of allDOM3) {
            i.style.width = window.innerWidth - 30 + "px";
        }
    }
}

//Fill the array arraySizes with the original sizes
function fillArraySizes() {
    if (resizeFlag) {
        arraySizes = [];
        let draggableObjects = document.querySelectorAll(".draggable");
        for (let i = 0; i < draggableObjects.length; i++) {
            arraySizes.push([draggableObjects[i].offsetWidth, draggableObjects[i].offsetHeight]);
        }
        resizeFlag = false;
    }
}

//Absolute Relative Positioning Logic
function initColBoxes() {
    let colBoxes = document.querySelectorAll(".col-box");
    for (let i = 0; i < colBoxes.length; i++) {
        setDimensions(colBoxes[i]);
        positionRelative(colBoxes[i]);
    }
}

//Run through all event listeners for dragable objects
function initDraggableObjects() {
    let draggableObjects = document.querySelectorAll(".draggable");
    for (let i = 0; i < draggableObjects.length; i++) {
        makeDraggable(draggableObjects[i]);
        highestZIndexOnClickAndResize(draggableObjects[i]);
        setCloseButton(draggableObjects[i]);
        positionAbsolute(draggableObjects[i]);
    }
}

//fixing the height and width of the col boxes
function setDimensions(domElement) {
    domElement.style.height = domElement.offsetHeight + "px";
    domElement.style.width = domElement.offsetWidth + "px";
}

function removeDimensions(domElement) {
    domElement.style.height = null;
    domElement.style.width = null;
}

//changing position to relative
function positionRelative(domElement) {
    domElement.style.position = "relative";
}

//changing position to absolute
function positionAbsolute(domElement) {
    domElement.style.position = "absolute";
}

//changing position to null
function positionNull(domElement) {
    domElement.style.position = null;
}

//make the input element draggable
//requirement: input element must be positioned absolutely
//requirement: the draggable area in the input element must have an id of #${element.id}-header
function makeDraggable(domElement) {
    let oldX = 0;
    let oldY = 0;

    domElement.querySelector(`.draggable-header`).addEventListener("mousedown", dragMouseDown);

    function dragMouseDown(event) {
        event.preventDefault(); //prevent default event behaviour
        // Place it above everything
        domElement.style.zIndex = highestZIndex + 1;
        highestZIndex++;
        // we need to determine the current position of the window
        // regex expression and split the old transform values
        let [transX, transY] = domElement.style.transform.replace(/[^0-9-,]/g, "").split(",");
        // In case of zero
        transX = transX || 0;
        transY = transY || 0;
        // Get the original position of the window
        oldX = event.clientX - Number(transX);
        oldY = event.clientY - Number(transY);
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    //Event on drag element
    function elementDrag(event) {
        event.preventDefault();
        // set the element's new position by translating x,y
        domElement.style.transform = `translate(${event.clientX - oldX}px, ${event.clientY - oldY}px)`;
    }

    function closeDragElement() {
        // Clear all added event listeners when button stops moving
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function highestZIndexOnClickAndResize(domElement) {
    domElement.addEventListener("click", function () {
        domElement.style.zIndex = highestZIndex + 1;
        highestZIndex++;
    });
    const resizeObserver = new ResizeObserver(function () {
        domElement.style.zIndex = highestZIndex + 1;
        highestZIndex++;
    });
    resizeObserver.observe(domElement);
}

//this function sets the close button
function setCloseButton(domElement) {
    domElement.querySelector(".fa-xmark").addEventListener("click", function () {
        domElement.remove();
    });
}

//for responsiveness, we reset all draggable boxes on any resize event (plus making it relative)
function resetDraggableBoxes() {
    let draggableObjects = document.querySelectorAll(".draggable");
    for (let i = 0; i < draggableObjects.length; i++) {
        draggableObjects[i].style.transform = `translate(0,0)`;
        draggableObjects[i].style.position = "relative";
        if (!resizeFlag) {
            //this means that resize was first called
            draggableObjects[i].style.width = arraySizes[i][0] + "px";
            draggableObjects[i].style.height = arraySizes[i][1] + "px";
            draggableObjects[i].style.width = null; //quirk
            draggableObjects[i].style.height = null; //quirk
        }
    }
    document.querySelector("#flexi-3-parent").style.transform = "translateY(230px)";
    resizeFlag = true;
}
