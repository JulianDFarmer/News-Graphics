// Global variables to keep track of which elements are in vision
var isLiveBugOn = false;
var isLiveLocatorOn = false;
var isHeadAstonOn = false;

/**
 * Animates the live bug and locator onto the screen
 * @param locator If true, bring on the locator - otherwise just animate in the live bug.
 */
function liveOn(locator=false) {
    // If the live bug is already in vision, but the locator isn't,
    // and the user wants the locator on...
    if(isLiveBugOn && !isLiveLocatorOn && locator) {
        // Animate the live bug out of vision...
        liveOff();
        // Wait until the animation is finished, then call this function again.
        setTimeout(function() {
           liveOn(true);
        },300);
        return;
    }
    // If the live bug is already in vision, and the locator is too,
    // and the user doesn't want the locator...
    else if(isLiveBugOn && isLiveLocatorOn && !locator) {
        // Animate the live bug out of vision...
        liveOff();
        // Wait until the animation is finished, then call this function again.
        setTimeout(function() {
            liveOn();
        },300);
        return;
    }
    // If the user calls this function when the live bug is already in vision
    // under any other circumstances, do nothing.
    else if(isLiveBugOn) {
        return;
    }

    // Reset the bug/locator back to below the viewable area
    // (it'll be above if it's previously been animated off)
    $("#screen-live-bug").css({top: "1.9vw"});
    $("#screen-live-locator").css({top: "1.9vw"});
    $("#screen-live-locatortail").css({top: "3.73vw"});

    // Animate the live bug up into the viewable area...
    anime({
        targets: '#screen-live-bug',
        top: "0",
        easing: 'easeInOutQuad',
        duration: 300
    });
    // ... and if the user wants the locator, bring that up too.
    if(locator) {
        anime({
            targets: '#screen-live-locator',
            top: "0",
            easing: 'easeInOutQuad',
            duration: 300
        });
        anime({
            targets: '#screen-live-locatortail',
            top: "1.83vw",
            easing: 'easeInOutQuad',
            duration: 300
        });
        isLiveLocatorOn = true;
    }
    isLiveBugOn = true;
}

/**
 * Animates the live bug and locator out of vision.
 */
function liveOff() {
    // If the live bug isn't already in vision, do nothing.
    if(!isLiveBugOn) {
        return;
    }

    // Animate the live bug up out of the viewable area...
    anime({
        targets: '#screen-live-bug',
        top: "-1.9vw",
        easing: 'easeInOutQuad',
        duration: 300
    });
    // ... and if the locator is on as well, animate that off too.
    if(isLiveLocatorOn) {
        anime({
            targets: '#screen-live-locator',
            top: "-1.9vw",
            easing: 'easeInOutQuad',
            duration: 300
        });
        anime({
            targets: '#screen-live-locatortail',
            top: "-0.07vw",
            easing: 'easeInOutQuad',
            duration: 300
        });
    }
    isLiveBugOn = false;
    isLiveLocatorOn = false;
}

/**
 * Animates the headline Aston into vision.
 */
function astonHeadOn() {
    // If the headline Aston is already in vision, do nothing.
    if(isHeadAstonOn) {
        return;
    }

    // Lower the sub headline out of the viewable area so that we can animate it on later.
    $("#screen-lowerthirds-heads-subhead").css({top: "6.5vw"});

    // Raise the entire Aston container upwards into vision, and grow it simultaneously.
    anime({
        targets: '#screen-lowerthirds-container',
        top: "32.1vw",
        height: "6.8vw",
        easing: 'easeInOutQuad',
        duration: 400
    });

    // Animate the sub headline upwards as the Aston container comes into view.
    anime({
        targets: '#screen-lowerthirds-heads-subhead',
        top: "4.33vw",
        easing: 'easeInOutQuad',
        delay: 200,
        duration: 400
    });
    isHeadAstonOn = true;
}

/**
 * Animates the headline Aston out of vision.
 */
function astonHeadOff() {
    // If the headline Aston isn't in vision, do nothing.
    if(!isHeadAstonOn) {
        return;
    }

    // Animate the entire headline Aston container downwards, and shrink it.
    // Once we're done, only the top bit showing the logo will in vision.
    anime({
        targets: '#screen-lowerthirds-container',
        top: "37vw",
        height: "1.9vw",
        easing: 'easeInOutQuad',
        duration: 400
    });
    isHeadAstonOn = false;
}