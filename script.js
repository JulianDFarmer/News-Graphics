// Global variables to keep track of which elements are in vision
var isLiveBugOn = false;
var isLiveLocatorOn = false;
var isHeadAstonOn = false;
var isNameAstonOn = false;
var isClockOn = true;
var isProgNameOn = false;
var restoreProgName = false;
var headlineNext = false;
var isTickerOn = true;
var whichSubHead = 1;
var subHeadTimeout;

// Arrays to store headlines / ticker stories...
var subHeadlines = ["Chauvin offered condolences to Floyd family in brief statement","Chauvin was convicted of murdering Mr Floyd","Hailed as longest sentence of an American policeman","Chauvin found guilty in April of murdering George Floyd","Floyd's brother: 'Chauvin had no regard for human life'","Chauvin's mother: 'Lengthy sentence will not serve him well'"];
var tickerStories = [["HEADLINES","Germany knife attack: Three dead and several more injured in Wurzburg","Matt Hancock has admitted he breached social distancing guidance","Boris Johnson 'considers the matter closed' after Matt Hancock apology","Labour Party chair Anneliese Dodds calls for Health Sec to be sacked"],
                     ["BREAKING","Derek Chauvin sentenced to 22yrs and 6 months for George Floyd murder"]];
var tickerTracker = [0,0];
var subHeadTracker = 1;

/**
 * Called when the page loads
 */
function initPage() {
    updateTime();
    rotateTicker();
    startTicker();
    setInterval(updateTime,1000);
}

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

    // Lower the sub headlines out of the viewable area so that we can animate it on later.
    // There are two, as they are both visible as they transition on/off, so we alternate
    // between them when we swap subheads.
    $("#screen-lowerthirds-heads-subhead-1").css({"transform": "translateY(2vw)"});
    $("#screen-lowerthirds-heads-subhead-2").css({"transform": "translateY(2vw)"});

    $("#screen-lowerthirds-heads-subhead-1")[0].innerText = subHeadlines[0];

    // Set the whichSubHead global var to 1 to show that the first element is on screen
    whichSubHead = 1;

    // Grow the entire headline Aston container from 0 height to its full size.
    anime({
        targets: '#screen-lowerthirds-heads-container',
        height: "4.9vw",
        easing: 'easeInOutQuad',
        duration: 400
    });

    // Animate the sub headline upwards as the headline Aston container comes into view.
    anime({
        targets: '#screen-lowerthirds-heads-subhead-1',
        translateY: "0vw",
        easing: 'easeInOutQuad',
        delay: 200,
        duration: 400
    });
    isHeadAstonOn = true;

    // Call startSubHeads to regularly rotate through sub headlines.
    startSubHeads();
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

    // Cancel any setTimeout for rotating the sub head
    clearTimeout(subHeadTimeout);
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

/**
 * Rotates the ticker to the next story
 */
function rotateTicker() {
    // Increment the story counter...
    tickerTracker[1]++;
    // If we've gone past the last story in the current category...
    if(tickerTracker[1]>=tickerStories[tickerTracker[0]].length) {
        // Reset the story counter to 0...
        tickerTracker[1] = 0;
        // Increment the category counter...
        tickerTracker[0]++;
        // ... and check if we've gone past the last category.
        if (tickerTracker[0] >= tickerStories.length) {
            // If so, reset the category counter to 0 to loop back to the first one.
            tickerTracker[0] = 0;
        }
    }

    // Get the next story to put on the ticker.
    let story = tickerStories[tickerTracker[0]][tickerTracker[1]];
    // Get the category of the next story.
    let category = tickerStories[tickerTracker[0]][0];

    // Animate the current story off the top of the ticker.
    anime({
        targets: '#screen-lowerthirds-ticker-text, #screen-lowerthirds-ticker-bullet',
        translateY: "-1.7vw",
        easing: 'easeInOutQuad',
        duration: 400
    });

    // Wait for the animation to complete....
    setTimeout(function() {
        // Move the ticker back below the visible area so it can be animated back in
        $("#screen-lowerthirds-ticker-text").css({"transform": "translateY(1.7vw)"});
        $("#screen-lowerthirds-ticker-bullet").css({"transform": "translateY(1.7vw)"});

        // Replace the story text...
        $("#screen-lowerthirds-ticker-text")[0].innerText = story;

        // If the category is BREAKING, add the class to make the text red.
        if(category == "BREAKING") {
            $("#screen-lowerthirds-ticker-text").addClass("ticker-text-red");
        }
        else {
            $("#screen-lowerthirds-ticker-text").removeClass("ticker-text-red");
        }

        // Animate the ticker back into view from below.
        anime({
            targets: '#screen-lowerthirds-ticker-text, #screen-lowerthirds-ticker-bullet',
            translateY: "0",
            easing: 'easeInOutQuad',
            duration: 400
        });

        // Wait for the animation to finish...
        setTimeout(function() {
            // If the ticker is displaying the category text BREAKING, make the text flash...
            if(story == "BREAKING") {
                flashTickerText();
            }
            // Otherwise, if the ticker is displaying a story in the BREAKING category,
            // make the bullet point flash.
            else if(category == "BREAKING") {
                flashTickerBullet();
            }
        },400);
    },400);
}

/**
 * Rotates the ticker by calling rotateTicker, as long as the ticker is on screen.
 */
function startTicker() {
    let interval = 6;

    // If we're displaying a category name rather than an actual story,
    // it should only be in vision for 4 seconds rather then the default 6
    if(tickerStories[tickerTracker[0]][0]==tickerStories[tickerTracker[0]][tickerTracker[1]]) {
        interval = 4;
    }

    setTimeout(function() {
        rotateTicker();
        if(isTickerOn) {
            startTicker();
        }
    },interval*1000);

}

/**
 * Rotates between sub headlines while the headline Aston is in vision
 */
function rotateSubHead() {
    // If the headline Aston isn't in vision, do nothing.
    if(!isHeadAstonOn) {
        return;
    }
    // If there is only one sub headline, do nothing.
    if(subHeadlines.length == 1) {
        return;
    }
    // Work out which element is in vision, and which is next
    var current;
    var next;
    if(whichSubHead == 1) {
        current = "#screen-lowerthirds-heads-subhead-1";
        next = "#screen-lowerthirds-heads-subhead-2";
        whichSubHead = 2;
    }
    else {
        current = "#screen-lowerthirds-heads-subhead-2";
        next = "#screen-lowerthirds-heads-subhead-1";
        whichSubHead = 1;
    }

    // Increment the subhead counter
    subHeadTracker++;
    // If we've gone past the last one, loop back to the first
    if(subHeadTracker>=subHeadlines.length) {
        subHeadTracker = 0;
    }

    $(next).css({"transform": "translateY(2vw)"});
    // Swap the text on the next element to be rotated in...
    $(next)[0].innerText = subHeadlines[subHeadTracker];

    // Animate the old one off...
    anime({
        targets: current,
        translateY: "-2vw",
        easing: 'easeInOutQuad',
        duration: 500
    });
    // And animate the new one on...
    anime({
        targets: next,
        translateY: "0vw",
        easing: 'easeInOutQuad',
        duration: 500
    });
}

/**
 * Rotates the sub headline by calling rotateSubHead, as long as the headline Aston is in vision
 */
function startSubHeads() {
    subHeadTimeout = setTimeout(function() {
        rotateSubHead();
        if(isHeadAstonOn) {
            startSubHeads();
        }
    },6000);

}

/**
 * Makes the ticker text flash three times
 */
function flashTickerText (){
    anime({
        targets: '#screen-lowerthirds-ticker-text',
        opacity: "0",
        loop: 6,
        direction: "alternate",
        easing: 'easeInOutQuad',
        duration: 200
    });
}

/**
 * Makes the ticker bullet point flash three times
 */
function flashTickerBullet() {
    anime({
        targets: '#screen-lowerthirds-ticker-bullet',
        opacity: "0",
        loop: 6,
        direction: "alternate",
        easing: 'easeInOutQuad',
        duration: 200
    });
}

/**
 * Updates the clock on the ticker
 */
function updateTime() {
    var date = new Date;
    var time = date.toLocaleTimeString('en-GB');
    var timeSplit = time.split(":");
    time = timeSplit[0] + ":" + timeSplit[1];

    $("#screen-lowerthirds-ticker-clock")[0].innerText = time;
}

/**
 * Animates the programme name box out of vision
 */
function progNameOff() {
    // If the programme name box is already out of vision, do nothing.
    if(!isProgNameOn) {
        return;
    }
    // Animate the box upwards out of vision
    anime({
        targets: "#screen-lowerthirds-branding-programme",
        translateY: "-2vw",
        easing: 'easeInOutQuad',
        duration: 400
    });
    isProgNameOn = false;
}

/**
 * Animates the programme name box into vision
 */
function progNameOn() {
    // If the programme name box is already in vision, do nothing.
    if(isProgNameOn) {
        return;
    }
    // Move the box below the bar so that it can be animated upwards into vision
    $("#screen-lowerthirds-branding-programme").css({"transform": "translateY(2vw)"});
    // Override display:none which is set by default when the page is loaded
    $("#screen-lowerthirds-branding-programme").show();
    // Animate it upwards into vision
    anime({
        targets: "#screen-lowerthirds-branding-programme",
        translateY: "0",
        easing: 'easeInOutQuad',
        duration: 400
    });
    isProgNameOn = true;
}

/**
 * Animates the clock out of vision
 */
function clockOff() {
    // If the clock is already out of vision, do nothing
    if(!isClockOn) {
        return;
    }
    // Animate the box upwards out of vision
    anime({
        targets: "#screen-lowerthirds-ticker-clock",
        translateY: "-2vw",
        easing: 'easeInOutQuad',
        duration: 400
    });
    isClockOn = false;
}

/**
 * Animates the clock into vision
 */
function clockOn() {
    // If the clock is already in vision, do nothing
    if(isClockOn) {
        return;
    }
    // Move the box below the bar so that it can be animated upwards into vision
    $("#screen-lowerthirds-ticker-clock").css({"transform": "translateY(2vw)"});
    // Animate it upwards into vision
    anime({
        targets: "#screen-lowerthirds-ticker-clock",
        translateY: "0",
        easing: 'easeInOutQuad',
        duration: 400
    });
    isClockOn = true;
}

/**
 * Animates the ticker (and clock/prog name/branding bar) into vision
 */
function tickerOn() {
    anime({
        targets: "#screen-lowerthirds-ticker-bar",
        translateY: "0",
        easing: 'easeInOutQuad',
        duration: 600,
    });
    anime({
        targets: "#screen-lowerthirds-branding",
        translateY: "0",
        easing: 'easeInOutQuad',
        duration: 600,
    });
    setTimeout(clockOn,500);
    if(restoreProgName) {
        setTimeout(progNameOn,800);
        restoreProgName = false;
    }
}

/**
 * Animates the ticker (and clock/prog name/branding bar) out of vision
 */
function tickerOff() {
    if(isProgNameOn) {
        restoreProgName = true;
    }
    astonHeadOff();
    astonNameOff();
    progNameOff();
    setTimeout(clockOff,300);
    anime({
        targets: "#screen-lowerthirds-ticker-bar",
        translateY: "3.35vw",
        easing: 'easeInOutQuad',
        duration: 600,
        delay: 600
    });
    anime({
        targets: "#screen-lowerthirds-branding",
        translateY: "5.2vw",
        easing: 'easeInOutQuad',
        duration: 600,
        delay: 600
    });
}