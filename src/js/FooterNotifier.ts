/**
 *  The notifier class allows to send an error notification to the bottom navbar.
 *
 * @constructor
 */
export default class FooterNotifier {

    // Footer element
    navbarElement = document.getElementsByClassName('navbar-bottom')[0];

    // Element which should contain the message
    footerNotifierElement = document.getElementsByClassName('footer-notifier')[0];

    /**
     * Reset the footer bars style and remove the notification messages
     */
    reset() {
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
    error(message: string) {
        // Display error message
        this.footerNotifierElement.innerHTML = message;
        // Add the specific error styles (footer=red)
        this.navbarElement.classList.add('error');
    };
}
