Array.prototype.shuffle = function(){
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
function invalid_enter(){
    if(window.event.keyCode == 13){
        return false;
    }
}

// start experiment
function start_experiment() {
    // get user name
    var name = document.getElementById("name").value;
    // get setlist number
    var number = document.getElementsByName("set");
    for (var i=0; i<number.length; i++) {
        if (number[i].checked) {
            var set_num = number[i].value;
        }
    }

    console.log(name);
    console.log(set_num);
    //convert display
    Display()

    // lead filepath
    var es_list = wav_dir + "set" + set_num + "/set" + set_num + "_ES.list";
    var na_list = wav_dir + "set" + set_num + "/set" + set_num + "_NA.list";
    var mis_list = wav_dir + "set" + set_num + "/set" + set_num + "_misacoustic.list";
    var method_es = loadText(es_list);
    var method_na = loadText(na_list);
    var method_mis = loadText(mis_list);
    var outfile = name + "_set" + set_num + "_100.csv";
    console.log(method_na);
    console.log(method_es);
    console.log(method_mis);
    console.log(outfile);
}

// convert display
function Display(){
    document.getElementById("Display1").style.display = "none";
    document.getElementById("Display2").style.display = "block";
}

// load text file
function loadText(filename){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", filename, false);
    xhr.send(null);
    var list = xhr.responseText.split(/\r\n|\r|\n/);

    return list;
}

// make file list
function makeFileList(){
    var files = Array(method_es.length * 3);
    for (var i=0; i<method_es.length; i++) {
        files[i*3] = [method_es[i], method_na[i]].shuffle();
        files[i*3 + 1] = [method_es[i], method_mis[i]].shuffle();
        files[i*3 + 2] = [method_na[i], method_mis[i]].shuffle();
    }
    files.shuffle();

    return files;
}

function setAudio(){
    document.getElementById("page").textContent = "" + (n+1) + "/" + scores.length;

    document.getElementById("audio_a").innerHTML = 'Voice1:<br>';
        + '<audio src="' + file_list[n][0]
        + '" controls preload="auto">'
        + '</audio>';
    showLabels();

    document.getElementById("audio_b").innerHTML = 'Voice2:<br>'
        + '<audio src="' + file_list[n][1]
        + '" controls preload="auto">'
        + '</audio>';
    showLabels();
}
















function setButton()
{
    if (n == scores.length - 1) {
        document.getElementById("prev").disabled=false;
        document.getElementById("next").disabled=true;
        document.getElementById("finish").disabled=true;
        for (var i=0; i<eval.length; i++) {
            if (eval[i].checked) {
                document.getElementById("finish").disabled=false;
                break;
            }
        }
    }
    else {
        if (n == 0) {
            document.getElementById("prev").disabled=true;
        }
        else {
            document.getElementById("prev").disabled=false;
        }
        document.getElementById("next").disabled=true;
        document.getElementById("finish").disabled=true;
        for (var i=0; i<eval.length; i++) {
            if (eval[i].checked) {
                document.getElementById("next").disabled=false;
                break;
            }
        }
    }
}



function evalCheck()
{
    const c = scores[n];
    if ((c <= 0) || (c > eval.length)) {
        for (var i=0; i<eval.length; i++) {
            eval[i].checked = false;
        }
    }
    else {
        eval[c-1].checked = true;
    }
}

function setButton()
{
    if (n == scores.length - 1) {
        document.getElementById("prev").disabled=false;
        document.getElementById("next").disabled=true;
        document.getElementById("finish").disabled=true;
        for (var i=0; i<eval.length; i++) {
            if (eval[i].checked) {
                document.getElementById("finish").disabled=false;
                break;
            }
        }
    }
    else {
        if (n == 0) {
            document.getElementById("prev").disabled=true;
        }
        else {
            document.getElementById("prev").disabled=false;
        }
        document.getElementById("next").disabled=true;
        document.getElementById("finish").disabled=true;
        for (var i=0; i<eval.length; i++) {
            if (eval[i].checked) {
                document.getElementById("next").disabled=false;
                break;
            }
        }
    }
}


function evaluation()
{
    for (var i=0; i<eval.length; i++){
        if (eval[i].checked){
            scores[n] = i+1;
        }
    }
    setButton();
    // showScores();
}


function showScores()
{
    var r = Math.floor(scores.length / 10);
    var table = "";
    for(var i=0; i<r; i++){
        for(var j=0; j<10; j++){
            table += scores[i*10+j] + " ";
        }
        table += "<br>";
    }
    for(var j=0; j<scores.length%10; j++){
        table += scores[r*10+j] + " ";
    }
    document.getElementById("table").innerHTML = table;
}

function setAudio()
{
    document.getElementById("page").textContent = "" + (n+1) + "/" + scores.length;

    document.getElementById("sub_a").innerHTML = '評価歌声A<br>'
        + '<audio src="' + file_list[n][1]
        + '" controls preload="auto">'
        + '</audio>';
    document.getElementById("sub_b").innerHTML = '評価歌声B<br>'
        + '<audio src="' + file_list[n][0]
        + '" controls preload="auto">'
        + '</audio>';
}

function exportCSV()
{
    var csvData = "";
    for (var i=0; i<pairs.length; i++) {
        csvData += "" + pairs[i][0] + ","
            + pairs[i][scores[i]] + "\r\n";
    }

    const link = document.createElement("a");
    document.body.appendChild(link);
    link.style = "display:none";
    const blob = new Blob([csvData], {type: "octet/stream"});
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.download = outfile;
    link.click();
    window.URL.revokeObjectURL(url);
    link.parentNode.removeChild(link);
}

function init()
{
    n = 0;
    setAudio();
    evalCheck();
    setButton();
    // showScores();
}

function next()
{
    n++;
    setAudio();
    evalCheck();
    setButton();
}

function prev()
{
    n--;
    setAudio();
    evalCheck();
    setButton();
}

function finish()
{
    exportCSV();
}


// --------- 設定 --------- //

// ディレクトリ名
const wav_dir = "wav/w_vctk/T100/";

// invalid enter key
document.onkeypress = invalid_enter();


// ローカルで行う場合はloadText()は動作しないため

var file_list = makeFileList();
console.log(file_list);

var n = 0;

var eval = document.getElementsByName("eval");
var scores = (new Array(file_list.length)).fill(0);
