/**
 *  The notifier class allows to send an error notification to the bottom navbar.
 *
 * @constructor
 */
function FooterNotifier() {

    // Footer element
    this.navbarElement = document.getElementsByClassName('navbar-bottom')[0];

    // Element which should contain the message
    this.footerNotifierElement = document.getElementsByClassName('footer-notifier')[0];

    /**
     * Reset the footer bars style and remove the notification messages
     */
    this.reset = function () {
        // Remove message from footer
        this.footerNotifierElement.innerHTML = '';
        // Remove specific notification styles
        this.navbarElement.classList.remove('error');
    };

    /**
     *  Notify the user with a red footer and the message in it
     *
     * @param message
     */
    this.error = function (message) {
        // Display error message
        this.footerNotifierElement.innerHTML = message;
        // Add the specific error styles (footer=red)
        this.navbarElement.classList.add('error');
    };

}