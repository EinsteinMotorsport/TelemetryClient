function RefreshRateTracker() {

    this.footerNotifier = new FooterNotifier();

    this.notRespondingInterval = null;

    /**
     * Tells the tracker a new value is received, so the tracker can estimate if
     * the car is not responding after a while
     */
    this.notify = function () {
        const me = this;

        me.footerNotifier.reset();
        // Clear old car not responding interval
        clearInterval(this.notRespondingInterval);

        // Set new interval -> status car not responding if not cleared before 1000 ms
        this.notRespondingInterval = setInterval(function () {
            // Send error to the footer navigation bar
            me.footerNotifier.error('Car is not responding');
        }, 1000);
    }

}