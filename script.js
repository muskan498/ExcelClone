let defaultProperties = {
  "text": "",
  "font-weight": "",
  "font-style": "",
  "text-decoration": "",
  "text-align": "left",
  "background-color": "#ffffff",
  "color": "#000000",
  "font-family": "Noto Sans",
  "font-size": "14"
}
// console.log(defaultProperties);

let cellData = {
  "Sheet 1" : {}
}

let selectedSheet = "Sheet 1";
let totalSheets = 1;
let lastlyAddedSheet = 1;

$(document).ready(function () {
  let cellcontainer = $(".input-cell-container");

  for (i = 1; i < 100; i++) {
    let ans = "";

    let n = i;

    while (n > 0) {
      let rem = n % 26;

      if (rem == 0) {
        ans = "Z" + ans;
        n = Math.floor(n / 26) - 1;
      } else {
        ans = String.fromCharCode(rem - 1 + 65) + ans;
        n = Math.floor(n / 26);
      }
    }

    let column = $(`<div class="column-name colId-${i}" id="colCod-${ans}">${ans}</div>`);
    $(".column-name-container").append(column);
    let row = $(`<div class="row-name" id="rowId-${i}">${i}</div>`);
    $(".row-name-container").append(row);

  }

  for(i = 0; i < 100; i++){
    let row = $(`<div class="row-cell"></div>`);
    for(j = 0; j < 100; j++){
        let column = $(`<div class="input-cell" id="rowId-${i}-colId-${j}" contenteditable="false"></div>`);
        row.append(column);
    }
    $(".input-cell-container").append(row);
  }

    $(".align-icon").click(function(){
        $(".align-icon.selected").removeClass("selected");
        $(this).addClass("selected");
    });

    $(".style-icon").click(function(){
        $(this).toggleClass("selected");
    });

    $(".input-cell").click(function (e) {
      if(e.ctrlKey){
          let [rowId, colId] = getRowCol(this);
          if(rowId >= 1){
            let topCellSelected = $(`#rowId-${rowId-1}-colId-${colId}`);
            console.log($(topCellSelected).attr("class" ));
            if(topCellSelected.hasClass("selected")==true){
              console.log("i miss you")
              $(this).addClass("top-cell-selected");
              $(`#rowId-${rowId-1}-colId-${colId}`).addClass("bottom-cell-selected");
            }
          }

          if(rowId <= 100){
            let bottomCellSelected = $(`#rowId-${rowId+1}-colId-${colId}`).hasClass("selected");
            if(bottomCellSelected){
              $(this).addClass("bottom-cell-selected");
              $(`#rowId-${rowId+1}-colId-${colId}`).addClass("top-cell-selected");
            }
          }

          if(colId >= 1){
            let leftCellSelected = $(`#rowId-${rowId}-colId-${colId-1}`).hasClass("selected");
            if(leftCellSelected){
              $(this).addClass("left-cell-selected");
              $(`#rowId-${rowId}-colId-${colId-1}`).addClass("right-cell-selected");
              console.log(this.attr);
              // console.log($(`#rowId-${rowId}-colId-${colId-1}`).attr);
            }
          }
          if(colId <= 100){
            let rightCellSelected = $(`#rowId-${rowId}-colId-${colId+1}`).hasClass("selected");
            if(rightCellSelected){
              $(this).addClass("right-cell-selected");
              $(`#rowId-${rowId}-colId-${colId+1}`).addClass("left-cell-selected");
              console.log(this.attr);
              // console.log($(`#rowId-${rowId}-colId-${colId+1}`).attr);
            }
          }
        }
        else {
            $(".input-cell.selected").removeClass("selected top-cell-selected bottom-cell-selected right-cell-selected left-cell-selected");
        }  
        
        $(this).addClass("selected");
        changeHeader(this); 
    });

    function changeHeader(ele) {
      let [rowId,colId] = getRowCol(ele);
      let cellInfo = defaultProperties;
      if(cellData[selectedSheet][rowId] && cellData[selectedSheet][rowId][colId]) {
          cellInfo = cellData[selectedSheet][rowId][colId];
      }

      cellInfo["font-weight"] ? $(".icon-bold").addClass("selected") : $(".icon-bold").removeClass("selected");
      cellInfo["font-style"] ? $(".icon-italic").addClass("selected") : $(".icon-italic").removeClass("selected");
      cellInfo["text-decoration"] ? $(".icon-underline").addClass("selected") : $(".icon-underline").removeClass("selected");
      
      let alignment = cellInfo["text-align"];

      $(".align-icon.selected").removeClass("selected");
      $(".icon-align-" + alignment).addClass("selected");
      $(".background-color-picker").val(cellInfo["background-color"]);
      $(".text-color-picker").val(cellInfo["color"]);
      $(".Font-family-selector").val(cellInfo["font-family"]);
      $(".Font-family-selector").css("font-family", cellInfo["font-family"]);
      $(".Font-size-selector").val(cellInfo["font-size"]);
     
  }

    $(".input-cell").dblclick(function(){
      $(".input-cell.selected").removeClass("selected");
      $(this).addClass("selected");
      $(this).attr("contenteditable", "true");
      $(this).focus();
    });

    $(".input-cell").blur(function(){
      $(".input-cell.selected").attr("contenteditable", "false");
      updateCell("text", $(this).text());
    });

    $(".input-cell-container").scroll(function(){
      $(".column-name-container").scrollLeft(this.scrollLeft);
      $(".row-name-container").scrollTop(this.scrollTop);
    });
    
});

function getRowCol(ele) {
    let idArray = $(ele).attr("id").split("-");
    let rowId = parseInt(idArray[1]);
    let colId = parseInt(idArray[3]);
    return [rowId, colId];
}

function updateCell(property, value, defaultPossible){
  $(".input-cell.selected").each(function(){
    $(this).css(property,value);
    let rowId_colId = getRowCol(this);
    let rowId = rowId_colId[0];
    let colId = rowId_colId[1];
    if(cellData[selectedSheet][rowId]){
      if(cellData[selectedSheet][rowId][colId]){
        cellData[selectedSheet][rowId][colId][property] = value;
      } else {
        cellData[selectedSheet][rowId][colId] = {...defaultProperties};
        cellData[selectedSheet][rowId][colId][property] = value;
      }
    } else {
      cellData[selectedSheet][rowId] = {};
      cellData[selectedSheet][rowId][colId] = {...defaultProperties};

      cellData[selectedSheet][rowId][colId][property] = value;
    }

    if(defaultPossible && (JSON.stringify(cellData[selectedSheet][rowId][colId]) === JSON.stringify(defaultProperties))) {
      delete cellData[selectedSheet][rowId][colId];
      if(Object.keys(cellData[selectedSheet][rowId]).length == 0){
        delete cellData[selectedSheet][rowId];
      }
    }
  });
  console.log(cellData)
}

$(".icon-bold").click(function(){
  if($(this).hasClass("selected")){
    updateCell("font-weight", "", true);
  }
  else{
    updateCell("font-weight", "bold", false);
  }
});

$(".icon-underline").click(function(){
  if($(this).hasClass("selected")){
    updateCell("text-decoration", "", true);
  }
  else{
    updateCell("text-decoration", "underline", false);
  }
});

$(".icon-italic").click(function(){
  if($(this).hasClass("selected")){
    updateCell("font-style", "", true);
  }
  else{
    updateCell("font-style", "italic", false);
  }
});

$(".icon-align-left").click(function(){
  if(!$(this).hasClass("selected")){
    updateCell("text-align", "left", true);
  }
});

$(".icon-align-center").click(function(){
  if(!$(this).hasClass("selected")){
    updateCell("text-align", "center", false);
  }
});

$(".icon-align-right").click(function(){
  if(!$(this).hasClass("selected")){
    updateCell("text-align", "right", false);
  }
});

$(".color-fill-icon").click(function(){
  $(".background-color-picker").click();
});

$(".color-fill-text").click(function(){
  $(".text-color-picker").click();
});

$(".background-color-picker").change(function(){
  updateCell("background-color", $(this).val())
});

$(".text-color-picker").change(function(){
  updateCell("color", $(this).val())
});

$(".Font-family-selector").change(function() {
  updateCell("font-family", $(this).val());
  $(".Font-family-selector").css("font-family", $(this).val());
});

$(".Font-size-selector").change(function() {
  updateCell("font-size", $(this).val());
});

function emptySheet() {
  let sheetInfo = cellData[selectedSheet];
  for(let i of Object.keys(sheetInfo)) {
      for(let j of Object.keys(sheetInfo[i])) {
          $(`#rowId-${i}-colId-${j}`).text("");
          $(`#rowId-${i}-colId-${j}`).css("background-color", "#ffffff");
          $(`#rowId-${i}-colId-${j}`).css("color", "#000000");
          $(`#rowId-${i}-colId-${j}`).css("text-align", "left");
          $(`#rowId-${i}-colId-${j}`).css("font-weight", "");
          $(`#rowId-${i}-colId-${j}`).css("font-style", "");
          $(`#rowId-${i}-colId-${j}`).css("text-decoration", "");
          $(`#rowId-${i}-colId-${j}`).css("font-family", "Noto Sans");
          $(`#rowId-${i}-colId-${j}`).css("font-size", "14px");
      }
  }
}

function loadSheet() {
  let sheetInfo = cellData[selectedSheet];
  for(let i of Object.keys(sheetInfo)) {
      for(let j of Object.keys(sheetInfo[i])) {
          let cellInfo = cellData[selectedSheet][i][j];
          $(`#rowId-${i}-colId-${j}`).text(cellInfo["text"]);
          $(`#rowId-${i}-colId-${j}`).css("background-color", cellInfo["background-color"]);
          $(`#rowId-${i}-colId-${j}`).css("color", cellInfo["color"]);
          $(`#rowId-${i}-colId-${j}`).css("text-align", cellInfo["text-align"]);
          $(`#rowId-${i}-colId-${j}`).css("font-weight", cellInfo["font-weight"]);
          $(`#rowId-${i}-colId-${j}`).css("font-style", cellInfo["font-style"]);
          $(`#rowId-${i}-colId-${j}`).css("text-decoration", cellInfo["text-decoration"]);
          $(`#rowId-${i}-colId-${j}`).css("font-family", cellInfo["font-family"]);
          $(`#rowId-${i}-colId-${j}`).css("font-size", cellInfo["font-size"]);
      }
  }
}

$(".icon-add").click(function(){
  emptySheet();
  $(".sheet-tab.selected").removeClass("selected");
  let sheetName = "Sheet" + (lastlyAddedSheet + 1);
  cellData[sheetName] = {};
  totalSheets += 1;
  lastlyAddedSheet += 1;
  selectedSheet = sheetName;
  $(".sheet-tab-container").append(`<div class="sheet-tab selected">${sheetName}</div>`);
  $(".sheet-tab.selected").click(function(){
    if(!$(this).hasClass("selected")) {
        selectSheet(this);
    }
  });
});

$(".sheet-tab").click(function(){
  if(!$(this).hasClass("selected")) {
      selectSheet(this);
  }
});

function selectSheet(ele) {
  $(".sheet-tab.selected").removeClass("selected");
  $(ele).addClass("selected");
  emptySheet();
  selectedSheet = $(ele).text();
  loadSheet();
}



