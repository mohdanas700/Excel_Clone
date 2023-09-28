$(document).ready(function(){
    // this block of code executes,after borwser loads.

    let cellContainer = $(".input-cell-container")

    for (let i =1;i<=100;i++) {
        let ans = "" ;

        let n = i;
    
        while (n>0) {
            rem = n % 26
            if(rem == 0){
                ans = "Z" + ans
                n = Math.floor(n / 26) - 1 
            }
            else {
                ans = String.fromCharCode(rem-1+65)+ ans;
                n = Math.floor(n/26)
            }
        }

        let column = $(`<div class="column-name colId-${i}" id="colCod-${ans}">${ans}</div>`);
        $(".column-name-container").append(column);
        // let row = $('<div class="row-name" id="rowId-${i}">${i}</div>')
        // $(".row-name-container").append(row)
        let row = $(`<div class="row-name" id="rowId-${i}">${i}</div>`);
        $(".row-name-container").append(row);
    }

    // Here 2 loops are created for making cells. In actual it is like a matrix having row-col.
    // So during 1st loop we are creating row.
    // In second loop we are creating cell.
    // After creating cell appending it to row,then appending it to input-cell-container. 
    for (let i = 1;i <= 100; i++){
        let row = $('<div class="cell-row"></div>')
        for (let j = 1; j <= 100; j++){
            let colCode = $(`.colId-${j}`).attr("id").split("-")[1];
            let column = $(`<div class="input-cell" contenteditable="true" id = "row-${i}-col-${j}" data="code-${colCode}"></div>`);
            row.append(column);
        }
        $('.input-cell-container').append(row);
    }

    // This function is used to add or remove the bgcolor when user click on align-items
    $('.align-icon').click(function() {
        $('.align-icon.selected').removeClass('selected');
        $(this).addClass('selected')
    });

    //This function is used to  add or remove the bgcolor when user click on font-format
    $('.style-icon').click(function() {
        $(this).toggleClass('selected');
    });

//This function is used to  select the cell
    $(".input-cell").click(function (e) {
        if(e.ctrlKey) {
            let [rowId, colId] = getRowCol(this);
            if(rowId > 1) { 
                let topCellSelected = $(`#row-${rowId-1}-col-${colId}`).hasClass("selected");
                if(topCellSelected) {
                    $(this).addClass("top-cell-selected");
                    $(`#row-${rowId-1}-col-${colId}`).addClass("bottom-cell-selected");
                }
            }
            if(rowId < 100) {
                let bottomCellSelected = $(`#row-${rowId+1}-col-${colId}`).hasClass("selected");
                if(bottomCellSelected) {
                    $(this).addClass("bottom-cell-selected");
                    $(`#row-${rowId+1}-col-${colId}`).addClass("top-cell-selected");
                }
            }
            if(colId > 1) {
                let leftCellSelected = $(`#row-${rowId}-col-${colId-1}`).hasClass("selected");
                if(leftCellSelected) {
                    $(this).addClass("left-cell-selected");
                    $(`#row-${rowId}-col-${colId-1}`).addClass("right-cell-selected");
                }
            }
            if(colId < 100) {
                let rightCellSelected = $(`#row-${rowId}-col-${colId+1}`).hasClass("selected");
                if(rightCellSelected) {
                    $(this).addClass("right-cell-selected");
                    $(`#row-${rowId}-col-${colId+1}`).addClass("left-cell-selected");
                }
            }
            $(this).addClass("selected");
        }
        else {
            $(".input-cell.selected").removeClass("selected");
            $(this).addClass("selected");
        }
    });

    $(".input-cell").dblclick(function () {
        $(".input-cell.selected").removeClass("selected");
        $(this).addClass("selected");
        $(this).attr("contenteditable", "false");
        $(this).focus();
    });

    $(".input-cell-container").scroll(function () {
        $(".column-name-container").scrollLeft(this.scrollLeft);
        $(".row-name-container").scrollTop(this.scrollTop);
    })


});

function getRowCol(elem) {
    // this function will return the selected row id and column id by the help of "elem"
    let idArray = $(elem).attr("id").split("-");
    let rowId = parseInt(idArray[1]);
    let colId = parseInt(idArray[3]);
    return (rowId, colId)
};

