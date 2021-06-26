// Global variables to keep track of which elements are in vision
var isLiveBugOn = false;
var isLiveLocatorOn = false;
var isHeadAstonOn = false;
var isNameAstonOn = false;
var headlineNext = false;

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
    // If a name Aston is in vision, set headlineNext to true so that
    // the headline Aston will be set in vision once the name Aston is done
    if(isNameAstonOn) {
        headlineNext = true;
        return;
    }

    // Lower the sub headline out of the viewable area so that we can animate it on later.
    $("#screen-lowerthirds-heads-subhead").css({"transform": "translateY(2vw)"});

    // Grow the entire headline Aston container from 0 height to its full size.
    anime({
        targets: '#screen-lowerthirds-heads-container',
        height: "4.9vw",
        easing: 'easeInOutQuad',
        duration: 400
    });

    // Animate the sub headline upwards as the headline Aston container comes into view.
    anime({
        targets: '#screen-lowerthirds-heads-subhead',
        translateY: "0vw",
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

    // Animate the headline Aston container to 0 height. The branding bar
    // above will automatically move downwards as the headline container shrinks.
    anime({
        targets: '#screen-lowerthirds-heads-container',
        height: "0",
        easing: 'easeInOutQuad',
        duration: 400
    });
    isHeadAstonOn = false;
}

/**
 * Animates the name Aston into vision
 * @param duration How long the Aston should stay in vision (in seconds) - default 5
*/
function astonNameOn(duration=5) {
    // If the name Aston is already in vision, do nothing.
    if(isNameAstonOn) {
        return;
    }
    // If the headline Aston is in vision, turn it off, and call this function again
    // after the animation is done. Set headlineNext to true so that the headline Aston
    // comes back after the name Aston has animated off.
    else if(isHeadAstonOn) {
        astonHeadOff();
        setTimeout(function() {
            headlineNext = true;
            astonNameOn(duration);
        },500);
        return;
    }

    // Translate the name and title down so that they can be animated up later.
    $("#screen-lowerthirds-nameaston-name").css({"transform": "translateY(2vw)"});
    $("#screen-lowerthirds-nameaston-title").css({"transform": "translateY(2vw)"});

    // Grow the entire name Aston container from 0 height to its full size.
    anime({
        targets: '#screen-lowerthirds-nameaston-container',
        height: "4.9vw",
        easing: 'easeInOutQuad',
        duration: 400
    });
    // Animate the name and title upwards as the container comes into view.
    anime({
        targets: '#screen-lowerthirds-nameaston-name',
        translateY: "0vw",
        easing: 'easeInOutQuad',
        delay: 100,
        duration: 400
    });
    anime({
        targets: '#screen-lowerthirds-nameaston-title',
        translateY: "0vw",
        easing: 'easeInOutQuad',
        delay: 200,
        duration: 400
    });

    isNameAstonOn = true;

    setTimeout(function() {
        astonNameOff();
        if(headlineNext) {
            setTimeout(function() {
                astonHeadOn();
                headlineNext = false;
            },500);
        }
    },duration*1000);
}

/**
 * Animates the name Aston out of vision.
 */
function astonNameOff() {
    // If the name Aston isn't in vision, do nothing.
    if(!isNameAstonOn) {
        return;
    }

    // Animate the name Aston container to 0 height.
    anime({
        targets: '#screen-lowerthirds-nameaston-container',
        height: "0",
        easing: 'easeInOutQuad',
        duration: 400
    });
    isNameAstonOn = false;
}