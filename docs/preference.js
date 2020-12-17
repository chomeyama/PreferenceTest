Array.prototype.shuffle = function(){
    var i = this.length;
    while(i){
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
function start_experiment(){
    // get user name
    var name = document.getElementById("name").value;
    if(name == ""){
        alert("Please enter your name.");
        return false;
    }

    // get setlist number
    var set_num = "0"
    var number = document.getElementsByName("set");
    for(var i=0; i<number.length; i++){
        if(number[i].checked){
            set_num = number[i].value;
        }
    }
    if(set_num == "0"){
        alert("Please press the button.");
        return false;
    }

    //convert display
    Display()

    // lead filepath
    //var es_list = wav_dir + "set" + set_num + "/set" + set_num + "_ES.list";
    //var na_list = wav_dir + "set" + set_num + "/set" + set_num + "_NA.list";
    //var mis_list = wav_dir + "set" + set_num + "/set" + set_num + "_misacoustic.list";
    var es_list = wav_dir + "test/test_ES.list";
    var na_list = wav_dir + "test/test_NA.list";
    var mis_list = wav_dir + "test/test_misacoustic.list";
    method_es = loadText(es_list);
    method_na = loadText(na_list);
    method_mis = loadText(mis_list);
    //outfile = name + "_set" + set_num + "_100.csv";
    outfile = name + "_test_100.csv";
    file_list = makeFileList()
    scores = (new Array(file_list.length)).fill(0);
    eval = document.getElementsByName("eval");
    init()

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
    var files = Array((method_es.length - 1) * 3);
    for(var i=0; i<(method_es.length-1); i++){
        files[i*3] = [method_es[i], method_na[i]].shuffle();
        files[i*3 + 1] = [method_es[i], method_mis[i]].shuffle();
        files[i*3 + 2] = [method_na[i], method_mis[i]].shuffle();
    }
    files.shuffle();

    return files;
}

function setAudio(){
    document.getElementById("page").textContent = "" + (n+1) + "/" + scores.length;

    document.getElementById("audio_a").innerHTML = 'Voice1:<br>'
        + '<audio src="' + file_list[n][0]
        + '" controls preload="auto">'
        + '</audio>';

    document.getElementById("audio_b").innerHTML = 'Voice2:<br>'
        + '<audio src="' + file_list[n][1]
        + '" controls preload="auto">'
        + '</audio>';
}

function init(){
    n = 0;
    setAudio();
    evalCheck();
    setButton();
}

function evalCheck(){
    const c = scores[n];
    if((c <= 0) || (c > eval.length)){
        for(var i=0; i<eval.length; i++){
            eval[i].checked = false;
        }
    }
    else{
        eval[c-1].checked = true;
    }
}

function setButton(){
    if(n == (scores.length - 1)){
        document.getElementById("prev").disabled=false;
        document.getElementById("next2").disabled=true;
        document.getElementById("finish").disabled=true;
        for(var i=0; i<eval.length; i++){
            if(eval[i].checked){
                document.getElementById("finish").disabled=false;
                break;
            }
        }
    }
    else{
        if(n == 0){
            document.getElementById("prev").disabled=true;
        }
        else{
            document.getElementById("prev").disabled=false;
        }
        document.getElementById("next2").disabled=true;
        document.getElementById("finish").disabled=true;
        for(var i=0; i<eval.length; i++){
            if(eval[i].checked){
                document.getElementById("next").disabled=false;
                break;
            }
        }
    }
}

function evaluation(){
    for(var i=0; i<eval.length; i++){
        if(eval[i].checked){
            scores[n] = i+1;
        }
    }
    setButton();
}

function exportCSV(){
    var csvData = "";
    for(var i=0; i<file_list.length; i++){
        csvData += "" + file_list[i][0] + ","
        + file_list[i][1] + ","
        + scores[i] + "\r\n";
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

function next(){
    n++;
    setAudio();
    evalCheck();
    setButton();
}

function prev(){
    n--;
    setAudio();
    evalCheck();
    setButton();
}

function finish(){
    exportCSV();
}


// --------- 設定 --------- //

// ディレクトリ名
const wav_dir = "wav/w_vctk/T100/";

// invalid enter key
document.onkeypress = invalid_enter();

var method_es;
var method_na;
var method_mis;
var outfile;
var file_list;
var scores;

// ローカルで行う場合はloadText()は動作しないため
var n = 0;
var eval = document.getElementsByName("eval");
