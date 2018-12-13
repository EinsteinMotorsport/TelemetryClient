chartConfiguration = {
    init: function () {
        let me = this;

        me.registerEvents();
    },

    registerEvents: function () {
        let me = this;

        // On click open overlay
        document.querySelectorAll("[data-overlay-open='chart-configuration']").on('click', function (e) {
            me.onClickOpenOverlay(e)
        });

        // On click close overlay
        document.querySelectorAll("[data-overlay-close='chart-configuration']").on('click', function (e) {
            me.onClickCloseOverlay(e)
        });
        // On click close overlay
        document.getElementsByClassName("overlay--container").on('click', function (e) {
            me.onClickOverlayContainer(e)
        });

    },

    onClickOpenOverlay: function (e) {
        document.querySelector("[data-overlay='configure']").classList.add("overlay--visible");
    },

    onClickCloseOverlay: function (e) {
        document.querySelector("[data-overlay='configure']").classList.remove("overlay--visible");
    },

    onClickOverlayContainer: function (e) {
        console.log(e);
        if (e.srcElement.classList.contains("overlay--container"))
            this.onClickCloseOverlay(e);
    }
};