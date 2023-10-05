let defaultProperties = {
    text: "",
    "font-weight": "",
    "font-style": "",
    "text-decoration": "",
    "text-align": "left",
    "background-color": "#ffffff",
    "color": "#000000",
    "font-family": "Noto Sans",
    "font-size": "14px"
}

let cellData = {
    "Sheet1": {}
}

let selectedSheet = "Sheet1";
let totalSheets = 1;


$(document).ready(function(){
    // this block of code executes,after borwser loads.

    // Select the cell container for easier manipulation.
    let cellContainer = $(".input-cell-container");

    // Loop to generate column names (A, B, C, ..., Z, AA, AB, ...).
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

        // Create and append column names to the column-name-container.
        let column = $(`<div class="column-name colId-${i}" id="colCod-${ans}">${ans}</div>`);
        $(".column-name-container").append(column);
        
        // Create and append row names to the row-name-container.
        let row = $(`<div class="row-name" id="rowId-${i}">${i}</div>`);
        $(".row-name-container").append(row);
    }

    // Here 2 loops are created for making cells. In actual it is like a matrix having row-col.
    // So during 1st loop we are creating row.
    // In second loop we are creating cell.
    // After creating cell appending it to row,then appending it to input-cell-container. 
    // Create cells in a grid (100x100) and append them to the cell container.
    for (let i = 1;i <= 100; i++){
        let row = $('<div class="cell-row"></div>')
        for (let j = 1; j <= 100; j++){
            let colCode = $(`.colId-${j}`).attr("id").split("-")[1];
            let column = $(`<div class="input-cell" contenteditable="true" id = "row-${i}-col-${j}" data="code-${colCode}"></div>`);
            row.append(column);
        }
        $('.input-cell-container').append(row);
    }

    // This function is used to add or remove the bgcolor when user click on align-items,
    // This function handles the alignment icon click event.
    $('.align-icon').click(function() {
        // Remove the 'selected' class from any previously selected alignment icons.
        $('.align-icon.selected').removeClass('selected');

        // Add the 'selected' class to the clicked alignment icon to indicate the new selection.
        $(this).addClass('selected')
    });

    //This function is used to  add or remove the bgcolor when user click on font-format
    $('.style-icon').click(function() {

        // This function toggles the 'selected' class when a style icon is clicked,
        // allowing the user to easily toggle the style on or off.
        $(this).toggleClass("selected");
    });

    //This function is used to  select the cell
    // This function handles cell selection based on user interactions.
    $(".input-cell").click(function (e) {
        // This function handles cell selection based on user interactions.
        if(e.ctrlKey) {
            let [rowId, colId] = getRowCol(this);

            // Check for cell selection in the row above.
            if(rowId > 1) { 
                let topCellSelected = $(`#row-${rowId-1}-col-${colId}`).hasClass("selected");
                if(topCellSelected) {
                    $(this).addClass("top-cell-selected");
                    $(`#row-${rowId-1}-col-${colId}`).addClass("bottom-cell-selected");
                }
            }

            // Check for cell selection in the row below.
            if(rowId < 100) {
                let bottomCellSelected = $(`#row-${rowId+1}-col-${colId}`).hasClass("selected");
                if(bottomCellSelected) {
                    $(this).addClass("bottom-cell-selected");
                    $(`#row-${rowId+1}-col-${colId}`).addClass("top-cell-selected");
                }
            }

            // Check for cell selection in the column to the left.
            if(colId > 1) {
                let leftCellSelected = $(`#row-${rowId}-col-${colId-1}`).hasClass("selected");
                if(leftCellSelected) {
                    $(this).addClass("left-cell-selected");
                    $(`#row-${rowId}-col-${colId-1}`).addClass("right-cell-selected");
                }
            }

            // Check for cell selection in the column to the right.
            if(colId < 100) {
                let rightCellSelected = $(`#row-${rowId}-col-${colId+1}`).hasClass("selected");
                if(rightCellSelected) {
                    $(this).addClass("right-cell-selected");
                    $(`#row-${rowId}-col-${colId+1}`).addClass("left-cell-selected");
                }
            }
        }
        else {
            // If Ctrl key is not pressed, remove 'selected' class from all other selected cells.
            $(".input-cell.selected").removeClass("selected");
        }
        
        // Add the 'selected' class to the current cell.
        $(this).addClass("selected");
        changeHeader(this);
    });


    function changeHeader(ele) {
        let [rowId, colId] = getRowCol(ele);
        let cellInfo = defaultProperties;
        if (cellData[selectedSheet][rowId] && cellData[selectedSheet][rowId][colId]) {
            cellInfo = cellData[selectedSheet][rowId][colId]
        }
        cellInfo["font-weight"] ? $(".icon-bold").addClass("selected") : $(".icon-bold").removeClass("selected");
        cellInfo["font-style"] ? $(".icon-italic").addClass("selected") : $(".icon-italic").removeClass("selected");
        cellInfo["font-decoration"] ? $(".icon-underline").addClass("selected") : $(".icon-underline").removeClass("selected");
        let alignment = cellInfo["text-align"];
        $(".align-icon.selected").removeClass("selected");
        $(".icon-align-" + alignment).addClass("selected");
        $(".background-color-picker").val(cellInfo["background-color"]);
        $(".text-color-picker").val(cellInfo["color"]);
        $(".font-family-selector").val(cellInfo["font-family"]);
        $(".font-family-selector").css("font-family", cellInfo["font-family"]);
        $(".font-size-selector").val(cellInfo["font-size"]);
    
    }

    $(".input-cell").dblclick(function () {
        // This event handler is triggered when an input cell is double-clicked.

        // Remove the 'selected' class from any previously selected cell.
        $(".input-cell.selected").removeClass("selected");

        // Add the 'selected' class to the current input cell, making it the new selection.
        $(this).addClass("selected");

        // Enable content editing for the selected input cell.
        $(this).attr("contenteditable", "true");

        // Set focus to the selected input cell, allowing immediate editing.
        $(this).focus();
    });

    
    $(".input-cell").blur(function(){
        // This event handler is triggered when an input cell loses focus.

        // Disable content editing for the currently selected input cell.
        $(".input-cell.selected").attr("contenteditable","false");

        // Update the cell content with the text entered by the user.
        updateCell("text", $(this).text());
    })

    $(".input-cell-container").scroll(function () {
        // This event handler is triggered when the input cell container is scrolled.
        
        // Synchronize the horizontal scroll position of the column-name-container
        // with the scroll position of the input-cell-container.
        $(".column-name-container").scrollLeft(this.scrollLeft);

        // Synchronize the vertical scroll position of the row-name-container
        // with the scroll position of the input-cell-container.
        $(".row-name-container").scrollTop(this.scrollTop);
    })


});

function getRowCol(ele) {
    // This function extracts the selected row id and column id based on the provided element.
    let idArray = $(ele).attr("id").split("-");
    let rowId = parseInt(idArray[1]);
    let colId = parseInt(idArray[3]);
    return [rowId, colId]
};

function updateCell(property,value,defaultPossible) {
    // This function updates the specified CSS property with the given value for all selected cells.
    $(".input-cell.selected").each(function(){
        $(this).css(property,value);
        let [rowId,colId] = getRowCol(this);
        if(cellData[selectedSheet][rowId]) {
            if(cellData[selectedSheet][rowId][colId]) {
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
            if(Object.keys(cellData[selectedSheet][rowId]).length == 0) {
                delete cellData[selectedSheet][rowId];
            }
        }
    });
    console.log(cellData);
};

$(".icon-bold").click(function() {
   // This event handler toggles the "font-weight" property for selected cells when the bold icon is clicked. 
    if($(this).hasClass("selected")) {
        updateCell("font-weight","",true);
    }
    else {
        updateCell("font-weight","bold",false);
    }
});

$(".icon-italic").click(function() {
    if($(this).hasClass("selected")) {
        updateCell("font-style","",true);
    } else {
        updateCell("font-style","italic",false);
    }
});

$(".icon-underline").click(function() {
    if($(this).hasClass("selected")) {
        updateCell("text-decoration","",true);
    } else {
        updateCell("text-decoration","underline",false);
    }
});

$(".icon-align-left").click(function() {
    if(!$(this).hasClass("selected")) {
        updateCell("text-align","left",true);
    }
});

$(".icon-align-center").click(function() {
    if(!$(this).hasClass("selected")) {
        updateCell("text-align","center",true);
    }
});

$(".icon-align-right").click(function() {
    if(!$(this).hasClass("selected")) {
        updateCell("text-align","right",true);
    }
});

