$(function() {
    "use strict"

    //_________________________________________________________General variable declarations
    var isPlaying = false,
        tempo = 120.0, // tempo (in beats per minute)
        current16thNote = 1,
        futureTickTime = 0.0,
        timerID = 0;

    //_________________________________________________________END General variable declarations


    //_________________________________________________________Load sounds
    var kick = audioFileLoader("sounds/kick.mp3"),
        snare = audioFileLoader("sounds/snare.mp3"),
        hihat = audioFileLoader("sounds/hihat.mp3"),
        shaker = audioFileLoader("sounds/shaker.mp3");


    //_________________________________________________________END Load sounds


    //_________________________________________________________Track que array
    var track1Que = [],
        track2Que = [],
        track3Que = [],
        track4Que = [];
    //_________________________________________________________END Track que arrays


    //_________________________________________________________Track arrays
    var track1 = [],
        track2 = [],
        track3 = [],
        track4 = [];

    //_________________________________________________________END Track arrays





    //_________________________________________________________Future tick
    function futureTick() {
        var secondsPerBeat = 60.0 / tempo;
        futureTickTime += 0.25 * secondsPerBeat;
        current16thNote++;
        if (current16thNote > 16) {
            current16thNote = 1
        }
    }

    //_________________________________________________________END Future tick



    //_________________________________________________________Set demo div colors

    function setDemoDivColors(domElementGridNote, arr) {

        for (var i = 0; i < arr.length; i += 1) {
            $(domElementGridNote + arr[i]).css("background-color", "yellow");

        }
    }

    setDemoDivColors('#gridBeatTrack1-Rhyth', track1);
    setDemoDivColors('#gridBeatTrack2-Rhyth', track2);
    setDemoDivColors('#gridBeatTrack3-Rhyth', track3);
    setDemoDivColors('#gridBeatTrack4-Rhyth', track4);

    //_________________________________________________________END Set demo div colors



    //_________________________________________________________CheckRecordAndPlay

    function checkIfRecordedAndPlay(trackArray, sndToPlay, gridBeat, timeVal) {

        for (var i = 0; i < trackArray.length; i += 1) {

            if (gridBeat === trackArray[i]) {
                sndToPlay.play(timeVal)

            }
        }






    };
    //_________________________________________________________ END CheckRecordAndPlay

    //__________________________________________________________Schedule note
    function scheduleNote(beatDivisionNumber, time) {

        $("#metro-ui-" + (beatDivisionNumber)).effect("pulsate", {
            times: 1
        }, 10);



        checkIfRecordedAndPlay(track1, kick, beatDivisionNumber, time);
        checkIfRecordedAndPlay(track2, snare, beatDivisionNumber, time);
        checkIfRecordedAndPlay(track3, hihat, beatDivisionNumber, time);
        checkIfRecordedAndPlay(track4, shaker, beatDivisionNumber, time);


        removeDuplicates(track1);
        removeDuplicates(track2);
        removeDuplicates(track3);
        removeDuplicates(track4);

        track1.push(track1Que[0]);
        track1Que[0] = undefined;

        track2.push(track2Que[0]);
        track2Que[0] = undefined;

        track3.push(track3Que[0]);
        track3Que[0] = undefined;

        track4.push(track4Que[0]);
        track4Que[0] = undefined;

        // var osc = audioContext.createOscillator(); // Oscillator 
        // osc.connect(audioContext.destination)
        // osc.start(time)
        // osc.stop(time + 0.1)

    }



    //_________________________________________________________END schedule note


    //_________________________________________________________Scheduler

    function scheduler() {
        while (futureTickTime < audioContext.currentTime + 0.1) {
            scheduleNote(current16thNote, futureTickTime);
            futureTick();

        }
        timerID = window.setTimeout(scheduler, 50.0)
    }


    //_________________________________________________________END Scheduler



    //_________________________________________________________Transport controls

    function play() {
        isPlaying = !isPlaying;

        if (isPlaying) {
            current16thNote = 1;
            futureTickTime = audioContext.currentTime;
            console.log(futureTickTime)
            scheduler();
            return "stop";
        } else {
            window.clearTimeout(timerID);
            return "play";
        }
    }


    $("#play-button").on("click", function() {
        play();
    })

    $("#tempo").on("change", function() {
        tempo = this.value;
        $("#showTempo").html(tempo);
    })



    //__________________________________________________________END Transport controls






    //__________________________________________________________Grid toggle


    function sequenceGridToggler(classDomEle, arr) {
        $(classDomEle).on("mousedown", function() {
            // console.log(classDomEle)
            var rhythmicValue = parseInt(this.id.match(/(\d+)$/)[0], 10);
            var index = arr.indexOf(rhythmicValue);
            if (index > -1) {
                arr.splice(index, 1);
                $('#' + this.id).css("background-color", "");
            } else {
                arr.push(rhythmicValue);
                $('#' + this.id).css("background-color", "yellow");
            }
        });

    }

    sequenceGridToggler(".grid-track1", track1);
    sequenceGridToggler(".grid-track2", track2);
    sequenceGridToggler(".grid-track3", track3);
    sequenceGridToggler(".grid-track4", track4);


    //__________________________________________________________END Grid toggle






    //__________________________________________________________Remove duplicates


    function removeDuplicates(arr) {

        for (var i = 0; i < arr.length - 1; i += 1) {

            for (var j = i + 1; j < arr.length; j += 1)

                if (arr[i] === arr[j]) {
                arr.splice(i, 1);

            }
        };
    };

    //___________________________________________________________END remove duplicates





    //___________________________________________________________Drum Pad Events

    function drumPadAction(domElementDrumPad, domElementGridNote, arrayTrack, sound) {
        $(domElementDrumPad).on("mousedown", function() {
            $(domElementGridNote + (current16thNote)).css("background-color", "yellow"); //______The sequencer note grid value is changed color
            arrayTrack[0] = (current16thNote) //_______send to the appropriate array que
            sound.play(audioContext.currentTime);
        });

    }

    drumPadAction("#drumpad-track1", "#gridBeatTrack1-Rhyth", track1Que, kick)
    drumPadAction("#drumpad-track2", "#gridBeatTrack2-Rhyth", track2Que, snare)
    drumPadAction("#drumpad-track3", "#gridBeatTrack3-Rhyth", track3Que, hihat)
    drumPadAction("#drumpad-track4", "#gridBeatTrack4-Rhyth", track4Que, shaker)


    //____________________________________________________________END Drum Pad Events

});