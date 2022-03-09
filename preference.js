Array.prototype.shuffle = function () {
    var i = this.length;
    while (i) {
        var j = Math.floor(Math.random() * i);
        var t = this[--i];
        this[i] = this[j];
        this[j] = t;
    }
    return this;
}

// invalid enter key
function invalid_enter() {
    if (window.event.keyCode == 13) {
        return false;
    }
}

const pickN = (min, max, n) => {
    const list = new Array(max - min + 1).fill().map((_, i) => i + min);
    const ret = [];
    while (n--) {
        const rand = Math.floor(Math.random() * (list.length + 1)) - 1;
        ret.push(...list.splice(rand, 1))
    }
    return ret;
}

// start experiment
function start_experiment() {
    // get user name
    var name = document.getElementById("name").value.replace(" ", "_");
    if (name == "") {
        alert("Please enter your name.");
        return false;
    }

    // convert display
    Display();

    var methods = [];
    methods.push(wav_dir + "world/");
    methods.push(wav_dir + "psfgan/");

    var rands = pickN(0, n_utt, 8);

    file_list = makeFileList(methods, rands);
    outfile = name + ".csv";
    scores = (new Array(file_list.length)).fill(0);
    eval = document.getElementsByName("eval");
    init();
}

// convert display
function Display() {
    document.getElementById("Display1").style.display = "none";
    document.getElementById("Display2").style.display = "block";
}

// load text file
function loadText(filename) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", filename, false);
    xhr.send(null);
    var list = xhr.responseText.split(/\r\n|\r|\n/);
    list.pop();

    return list;
}

// make file list
function makeFileList(methods, rands) {
    var files = new Array();
    var names = loadText(wavnames);
    for (var i = 0; i < methods.length - 1; i++) {
        for (var j = i + 1; j < methods.length; j++) {
            for (var k = 0; k < rands.length; k++) {
                pair = [methods[i] + names[rands[k]] + "_f0.50.wav", methods[j] + names[rands[k]] + "_f0.50.wav"];
                files.push(pair);
                pair = [methods[i] + names[rands[k]] + "_f0.71.wav", methods[j] + names[rands[k]] + "_f0.71.wav"];
                files.push(pair);
                pair = [methods[i] + names[rands[k]] + "_f1.41.wav", methods[j] + names[rands[k]] + "_f1.41.wav"];
                files.push(pair);
                pair = [methods[i] + names[rands[k]] + "_f2.00.wav", methods[j] + names[rands[k]] + "_f2.00.wav"];
                files.push(pair);
                pair = [methods[i] + names[rands[k]] + ".wav", methods[j] + names[rands[k]] + ".wav"];
                files.push(pair);
                pair = [methods[j] + names[rands[k]] + "_f0.50.wav", methods[i] + names[rands[k]] + "_f0.50.wav"];
                files.push(pair);
                pair = [methods[j] + names[rands[k]] + "_f0.71.wav", methods[i] + names[rands[k]] + "_f0.71.wav"];
                files.push(pair);
                pair = [methods[j] + names[rands[k]] + "_f1.41.wav", methods[i] + names[rands[k]] + "_f1.41.wav"];
                files.push(pair);
                pair = [methods[j] + names[rands[k]] + "_f2.00.wav", methods[i] + names[rands[k]] + "_f2.00.wav"];
                files.push(pair);
                pair = [methods[j] + names[rands[k]] + ".wav", methods[i] + names[rands[k]] + ".wav"];
                files.push(pair);
            }
        }
    }
    files.shuffle();
    console.log(files);
    return files;
}

function setAudio() {
    document.getElementById("page").textContent = "" + (n + 1) + "/" + scores.length;

    document.getElementById("audio_a").innerHTML = 'Voice A<br>'
        + '<audio src="' + file_list[n][0]
        + '" controls preload="auto">'
        + '</audio>';

    document.getElementById("audio_b").innerHTML = 'Voice B<br>'
        + '<audio src="' + file_list[n][1]
        + '" controls preload="auto">'
        + '</audio>';
}

function init() {
    n = 0;
    setAudio();
    evalCheck();
    setButton();
}

function evalCheck() {
    const c = scores[n];
    if ((c <= 0) || (c > eval.length)) {
        for (var i = 0; i < eval.length; i++) {
            eval[i].checked = false;
        }
    }
    else {
        eval[c - 1].checked = true;
    }
}

function setButton() {
    if (n == (scores.length - 1)) {
        document.getElementById("prev").disabled = false;
        document.getElementById("next").disabled = true;
        document.getElementById("finish").disabled = true;
        for (var i = 0; i < eval.length; i++) {
            if (eval[i].checked) {
                document.getElementById("finish").disabled = false;
                break;
            }
        }
    }
    else {
        if (n == 0) {
            document.getElementById("prev").disabled = true;
        }
        else {
            document.getElementById("prev").disabled = false;
        }
        document.getElementById("next").disabled = true;
        document.getElementById("finish").disabled = true;
        for (var i = 0; i < eval.length; i++) {
            if (eval[i].checked) {
                document.getElementById("next").disabled = false;
                break;
            }
        }
    }
}

function evaluation() {
    for (var i = 0; i < eval.length; i++) {
        if (eval[i].checked) {
            scores[n] = i;
        }
    }
    setButton();
}

function exportCSV() {
    var csvData = "";
    for (var i = 0; i < file_list.length; i++) {
        csvData += "" + file_list[i] + ","
            + scores[i] + "\r\n";
    }

    const link = document.createElement("a");
    document.body.appendChild(link);
    link.style = "display:none";
    const blob = new Blob([csvData], { type: "octet/stream" });
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.download = outfile;
    link.click();
    window.URL.revokeObjectURL(url);
    link.parentNode.removeChild(link);
}

function next() {
    n++;
    setAudio();
    evalCheck();
    setButton();
}

function prev() {
    n--;
    setAudio();
    evalCheck();
    setButton();
}

function finish() {
    exportCSV();
}


// directory name
const wav_dir = "wav/";
const wavnames = "wav/wavnames.txt"
const n_utt = 4 * 66;

// invalid enter key
document.onkeypress = invalid_enter();

// global variables
var outfile;
var file_list;
var scores;

// since loadText() doesn't work in local
var n = 0;
var eval = document.getElementsByName("eval");