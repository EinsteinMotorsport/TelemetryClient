// Draggable object for dragging the cards around
draggable = {

    // class which should made draggable
    draggableClass: 'card',

    // Inits Draggable functionality
    init: function () {
        // Register all events of this object
        this.registerEvents();
    },

    // Register all events
    registerEvents: function () {
        let me = this;

        // Register the Drag and Drop events on the elements and give them ids to identify them
        let elements = document.getElementsByClassName(me.draggableClass);
        let c = 1;
        Array.prototype.forEach.call(elements, function (e) {
            e.draggable = true;
            e.ondragstart = me.dragstart;
            e.ondrop = me.drop;
            e.ondragover = me.dragover;
            e.ondragenter = me.dragenter;
            e.ondragleave = me.dragleave;
            if (e.id === "") {
                e.id = "_dd_" + c;
                c++;
            }
        })
    },

    // Drag starts
    dragstart: function (e) {
        // Add active dragging class
        e.target.classList.add('dragging');

        // Add ID to DataTransfer
        e.dataTransfer.setData("text/plain", e.target.id);
        e.dataTransfer.dropEffect = "move";
    },

    // Preventing anything on dragging an element over another
    dragover: function (e) {
        e.stopPropagation();
        e.preventDefault();
    },

    dragenter: function (e) {
        e.preventDefault();

        // Add class while dragging over
        e.target.closest("." + draggable.draggableClass).classList.add('dragover');
    },

    dragleave: function (e) {
        e.preventDefault();

        // Remove dragover class when leaving element
        e.target.closest("." + draggable.draggableClass).classList.remove('dragover');
    },

    // Element drops
    drop: function (e) {
        e.preventDefault();

        // define the two elements dragged and dropped over
        let draggedElement = document.querySelector("#" + e.dataTransfer.getData("text/plain"));
        let droppedOverElement = e.target.closest("." + draggable.draggableClass);

        // Remove active dragging class
        draggedElement.classList.remove('dragging');
        droppedOverElement.classList.remove('dragover');

        // Check if the element is dropped in the first half of the element
        if (e.offsetX < droppedOverElement.offsetWidth/2) {
            // Insert the element BEFORE the element where it is dropped over
            draggedElement.parentNode.insertBefore(draggedElement, droppedOverElement);
        } else {
            // Insert the element AFTER the element where it is dropped over
            draggedElement.parentNode.insertBefore(draggedElement, droppedOverElement.nextSibling);
        }
    }
};