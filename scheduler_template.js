var futureTickTime = audioContext.currentTime;

function scheduler() {
    while (futureTickTime < audioContext.currentTime + 0.1) {
        futureTickTime += 0.5; //____can be any time value. 0.5 happens 
        //____to be a quarter note at 120 bpm
        console.log(futureTickTime)
    }

    window.setTimeout(scheduler, 50.0)
}

scheduler();