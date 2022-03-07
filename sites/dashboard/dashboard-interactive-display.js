let highestZIndex = 1; //The z index of the navbar, arbitrarily set by bootstrap
let arraySizes = []; //This is an array that stores the original sizes of the col boxes
let resizeFlag = true; //We fill the arraySizes array up whenever we detect that this is a new window/resized window

function initInteractivePage() {
    //First fill of Array sizes
    fillArraySizes();
    //Setup the col boxes
    initColBoxes();
    //Init the draggable objects
    initDraggableObjects();

    window.addEventListener("resize", function () {
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
    });

    //Record the array sizes when there is a click on the document (after a fresh resize event)
    document.onmousedown = fillArraySizes;
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
