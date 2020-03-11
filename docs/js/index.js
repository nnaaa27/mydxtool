
var tab = "-> "

//起動時

//一時停止
document.addEventListener("pause", onPause, false);
function onPause() {
    // Handle the pause event
}

//バックグラウンドから戻る
document.addEventListener("resume", onResume, false);
function onResume() {
    // Handle the pause event
}

//戻るボタン
document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown() {

}


function addLog(str){
  pun = "----------\n"
  log_str = localStorage.getItem("log");
  if(!log_str){
    log_str = "";
  }
  log_str = log_str + pun + str;
  localStorage.setItem("log", log_str);
  localStorage.setItem("slog", str);
  //document.getElementById("log").value = localStorage.getItem("log");
}



//dise
function diseRadio1(){
  document.getElementById("cri_men_l").innerHTML = "C値";
}
function diseRadio2(){
  document.getElementById("cri_men_l").innerHTML = "面の数";
}

function rollButton(){
  document.getElementById('sound').play();

  var d = Number(document.getElementById("roll").value);
  var cm = Number(document.getElementById("cri_men").value);
  var t = Number(document.getElementById("add").value);
  var str = document.getElementById("roll_text").value

  if(!d){d = 1}
  if(!cm){cm = 10}
  if(!t){t = 0}

  var radio = document.getElementsByName("roll_type");
  if(radio[0].checked){
    showJudge(rollJudge(d, cm, t, str));
  }else if(radio[1].checked){
    showSum(rollSum(d, cm, t, str));
  }
}

function rollJudge(d, c, t, str){
  var data = []
  data['data'] = [d, c, t]
  data['1l'] = "行為判定：" + str;
  data['ex'] = d + "Dx@" + c
  if(t){
    data['ex'] += " + " + t
  }
  data['cn'] = 0;

  var n = d;
  var l = 0; //dataの最後のインデックス
  var list = []

  while(true){
    list.push(dise(n,10));
    l = list.length - 1;
    //クリティカルの数
    n = (list[l].filter(function(v){return v >= c})).length;
    if (n == 0){
      data['max'] = Math.max(...list[l]);
      list[l] = '[' + list[l] + ']（C:' + n + '個）'
      break;
    }
    list[l] = '[' + list[l] + ']（C:' + n + '個）'
    data['cn']++;
  }
  data['list'] = list;
  data['res'] = data['cn'] * 10 + data['max'] + t
  return data
}

function showJudge(data){
  str = "";
  str += data['1l'] + "\n";
  str += data['ex'] + "(C:" + data['cn'] + "回) = " + data['res'] + "\n";
  data['list'].forEach(s => str += tab + s + "\n");
  str += tab + (data['cn'] * 10 + data['max']) + " + " + data['data'][2] + " = " + data['res'] + "\n";

  //document.getElementById("judge_result").value = str;
  document.getElementById("judge_res").innerHTML = str ;
  addLog(str);
}

function rollSum(d, m, t, str){
  var data = [];
  data['data'] = [d, m, t];
  data['1l'] = "出目の合計：" + str;
  data['ex'] = d + "D" + m;
  if(t){
    data['ex'] += " + " + t;
  }
  data['list'] = dise(d, m);
  data['dsum'] = 0;
  data['list'].forEach(d => data['dsum'] += d);
  data['res'] = data['dsum'] + t;

  return data;
}

function showSum(data){
  str = "";
  str += data['1l'] + "\n";
  str += data['ex'] + " = " + data['res'] + "\n";
  str += tab + "[" + data['list'] + "]" + "\n";
  str += tab + data['dsum'] + " + " + data['data'][2] + " = " + data['res'] + "\n";
  //document.getElementById("judge_result").value = str;
  document.getElementById("judge_res").innerHTML = str;
  addLog(str);
}


function dise(n, d){
  res = []
  for(i=0; i<n; i++){
    res.push(Math.floor( Math.random() * d + 1 ))
  }
  return res;
}

function clearRoll(){
  document.getElementById("roll").value = "";
  document.getElementById("cri_men").value = "";
  document.getElementById("add").value = "";
  document.getElementById("roll_text").value =  "";

}

function copy_roll(){
  var copyText = localStorage.getItem("slog")
  //var copyTarget = document.getElementById("judge_result");
  var ta = document.createElement("textarea")
	ta.value = copyText
  ta.style = "position:fixed;left:100vw";
	document.body.appendChild(ta)
	ta.select()
  //copyTarget.select();
  document.execCommand("Copy");
  document.body.removeChild(ta);
  alert("コピーしました。");
  var selection = document.getElementById("button_c");
  //selection.select();
}




//LOGページ
function logButton(){
  var b = document.getElementById("log-edit");
  var b_label = document.getElementById("log-label")
  var divp = document.getElementById("show-area");
  var tarea =  document.getElementById("edit-area");
  var p = document.getElementById("log-text");
  var str  = "";
  var unshowdiv = document.getElementById("log_unshow");
  if(b.checked){
    b_label.innerHTML = "保存"
    divp.style.display = "none";
    tarea.style.display = "inline-block";
    str = localStorage.getItem("log");
    tarea.value = str;
    unshowdiv.style.display = "none"
  }else{
    b_label.innerHTML = "編集"
    divp.style.display = "inline-block";
    tarea.style.display = "none";
    str = tarea.value;
    p.innerHTML = str;
    localStorage.setItem("log", str);
    unshowdiv.style.display = "flex"
  }
}

function logEditCancelButton(){
    b = document.getElementById("log-edit");
    b_label = document.getElementById("log-label")
    divp = document.getElementById("show-area");
    tarea =  document.getElementById("edit-area");
    p = document.getElementById("log-text");
    b.checked = !b.checked;
    b_label.innerHTML = "編集"
    divp.style.display = "inline-block";
    tarea.style.display = "none";
    str = localStorage.getItem("log");
    p.innerHTML = str;
}

function clearLog(){
  var result = window.confirm("削除しますか？");
  if(result){
    localStorage.setItem("log", "");
    localStorage.setItem("slog", '');
    localStorage.setItem("elotion", 0);
    var item = document.getElementById("edit-area");
    if(item){
      item.value = "";
    }
    item = document.getElementById("log-text");
    if(item){
      item.innerHTML = "";
    }
    //document.getElementById("edit-area").value = '';
    //document.getElementById("log-text").innerHTML = '';
  }
}

function copyLog(){
  var copyText = localStorage.getItem("log")
  //var copyTarget = document.getElementById("judge_result");
  var ta = document.createElement("textarea")
	ta.value = copyText
  ta.style = "position:fixed;left:100vw";
	document.body.appendChild(ta)
	ta.select()
  //copyTarget.select();
  document.execCommand("Copy");
  document.body.removeChild(ta);
  alert("コピーしました。");
  var selection = document.getElementById("log-delete");
  //selection.select();
}

function downloadLog(){

}

function viewLog(){
  var str = localStorage.getItem("log");
  var area = document.getElementById("log-text");
  if(str && area){
    area.innerHTML = str;
  }
}


//erotion
function viewErotion(){
  var ero = localStorage.getItem("erotion");
  var p = document.getElementById("erotion-p");
  if(!ero){
    ero = 0;
  }
  if(p){
    p.innerHTML = ero + "%";
  }
  bounus = document.getElementById("erotion-bonus")
  if(bounus){
    bounus.innerHTML = erotionBonus(ero);
  }
  var res_area = document.getElementById("erotion_res");
  var str = localStorage.getItem("slog")
  if(str && res_area){
    res_area.innerHTML = str;
  }
  //alert(res_area);
}

function erotionBonus(erotion){
  var str ;
  var dise = 0;
  var lv = 0;
  if(erotion >= 300){
    dise = 8;
    lv = 2;
  }else if(erotion >= 240){
    dise = 7;
    lv = 2;
  }else if(erotion >= 200){
    dise = 6;
    lv = 2;
  }else if(erotion >= 160){
    dise = 5;
    lv = 2;
  }else if(erotion >= 130){
    dise = 4;
    lv = 1;
  }else if(erotion >= 100){
    dise = 3;
    lv = 1;
  }else if(erotion >= 80){
    dise = 2;
    lv = 0;
  }else if(erotion >= 60){
    dise = 1;
    lv = 0;
  }
  str = "<li>ダイス：+" + dise + "個</li><li>エフェクト：+" + lv +"Lv</li>"
  return str;
}


function d10Button(){
  document.getElementById('sound').play();

  document.getElementById("erotion-value").value = Math.floor( Math.random() * 10 + 1 );
  document.getElementById("erotion-text").value = "1D10";

}

function eClearButton(){
  document.getElementById("erotion-value").value = null;
  document.getElementById("erotion-text").value = null;
}


function addButton(){
  now_e = Number(localStorage.getItem("erotion"));
  e = Number(document.getElementById("erotion-value").value);
  txt = document.getElementById("erotion-text").value;
  if(!e && e != 0){
    alert("数字を入力してください")
    return;
  }
  localStorage.setItem("erotion", now_e + e);
  if(txt){
    txt = "（" + txt + "）";
  }
  str = "侵蝕値" + txt + "：加算("+ e +")\n " + now_e + "% -> " + now_e + " + "+ e + " = "+ (now_e + e)+ "%\n";
  addLog(str);
  viewErotion();

}
function subButton(){
  now_e = localStorage.getItem("erotion");
  e = Number(document.getElementById("erotion-value").value);
  txt = document.getElementById("erotion-text").value;
  if(!e && e != 0){
    alert("数字を入力してください")
    return;
  }
  localStorage.setItem("erotion", now_e - e);
  if(txt){
    txt = "（" + txt + "）";
  }
  str = "侵蝕値" + txt + "：減算("+ e +")\n " + now_e + "% -> " + now_e + " + "+ e + " = " + (now_e - e)+ "%\n";
  addLog(str);
  viewErotion();
}

function setButton(){
  now_e = localStorage.getItem("erotion");
  e = Number(document.getElementById("erotion-value").value);
  txt = document.getElementById("erotion-text").value;
  if(!e && e != 0){
    alert("数字を入力してください")
    return;
  }
  localStorage.setItem("erotion", e);
  if(txt){
    txt = "（" + txt + "）";
  }
  str = "侵蝕値" + txt + "：セット\n " + now_e + "% -> " + e + "%\n";
  addLog(str);
  viewErotion();
}



document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
  //alert("テストだよ")
    // Now safe to use the PhoneGap API
}

function viewMenu(){
  var ero = localStorage.getItem("erotion");
  var p = document.getElementById("menu-erotion-p");
  if(!ero){
    ero = 0;
  }
  if(p){
    p.innerHTML = ero + "%";
  }
  bounus = document.getElementById("menu-erotion-bonus")
  if(bounus){
    bounus.innerHTML = erotionBonus(ero);
  }
}


//共通
window.onload = function(){
// ページ読み込み時に実行したい処理
  localStorage.setItem("slog", '');
  viewMenu();
  viewLog();
  viewErotion();
  var menucheck = document.getElementById("nav-input");
  //メニュー常に表示
  if(menucheck.checked){
    menucheck.checked = !menucheck.checked;
  }
  //localStorage.setItem("slog", "");
}



window.addEventListener("load", function(event) {
    var touchStartX;
    var touchStartY;
    var touchMoveX;
    var touchMoveY;

    // 開始時
    window.addEventListener("touchstart", function(event) {
    event.preventDefault();
    // 座標の取得
    touchStartX = event.touches[0].pageX;
    touchStartY = event.touches[0].pageY;
    }, false);

    // 移動時
    window.addEventListener("touchmove", function(event) {
    event.preventDefault();
    // 座標の取得
    touchMoveX = event.changedTouches[0].pageX;
    touchMoveY = event.changedTouches[0].pageY;
    }, false);

    // 終了時
    window.addEventListener("touchend", function(event) {
    var menucheck = document.getElementById("nav-input");
    // 移動量の判定
    if (touchStartX > touchMoveX) {
        if (touchStartX > (touchMoveX + 50)) {
        //右から左に指が移動した場合
          if(menucheck.checked){
            menucheck.checked = !menucheck.checked;
          }
        }
    } else if (touchStartX < touchMoveX) {
        if ((touchStartX + 50) < touchMoveX) {
          //左から右に指が移動した場合
          if(!menucheck.checked){
            menucheck.checked = !menucheck.checked;
          }

        }
    }
    }, false);
}, false);
