import "./less/material.less"
import App from "./js/App";

// Start application when document is completely loaded
document.addEventListener("DOMContentLoaded", function () {
    App.getInstance().init();
});
