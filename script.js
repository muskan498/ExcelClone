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
          $(this).addClass("selected");
      }

      else{
        $(".input-cell.selected").removeClass("selected top-cell-selected bottom-cell-selected right-cell-selected left-cell-selected");
        $(this).addClass("selected");
      }   
    });

    $(".input-cell").dblclick(function(){
      $(".input-cell.selected").removeClass("selected");
      $(this).addClass("selected");
      $(this).attr("contenteditable", "true");
      $(this).focus();
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
