var matrix;
var numRes = 0;
var numVar = 0;

var VB = [];
var VL = [];

var columns;
var rows;

function removeClass(element, cls){
    element.classList.remove(cls);
}

// Generate the inputs for Maximization function and restrictions.
function generateInputs(){
    var divMain = document.getElementById("generated-content");
    numVar = parseInt(document.getElementById("numvar").value);
    numRes = parseInt(document.getElementById("numres").value);
    console.log("Num Var:" + numVar + "\n" + "Num Res:" + numRes);
    
    removeElementsByClass("row display-column");


    var template = "<div class='row display-column'><p>Função:</p>";

    for(var i = 0; i < numVar; i++){
        if(i > 0){
            template+= "<p>+</p>";
        }
        template+="<input type='number' id='fx"+i+"'/><p>X"+i+"</p>";
    }
    template+="</div><div class='row'><p>Restrições:</p></div>";


    for(var i = 0; i < numRes; i++){
        template+= "<div class='row display-column'>";
        for(var j = 0; j < numVar; j++){
            if(j > 0){
                template+= "<p>+</p>";
            }
            template+= "<input type='number' id='r"+i+"x"+j+"'><p>X"+j+"</p>";
        }
        template+="<p><=</p>" + "<input type='number' id='rr"+i+"'/>"
        template+= "</div>"
    }


    template+="<div class='row display-column'><p>";  
    for(var i = 0; i < numVar; i++){ 
        if(i == 0){
            template+= "x" + i ;
        }else {
            template+= ", x" + i;
        }
    } 
    template+= " >= 0</p>"
    template+="</div>";
   
    //Apply the HTML generated content to the div
    divMain.innerHTML+= template;

    removeClass(document.getElementById("calc"), "hidden");
}

function computeValues(){
    generateMatrix();
    do{
        //for(var i = 0; i < 2; i++){
        var pColumn = findPivotColumn();
        var pRow = findPivotRow(pColumn);
        showTable();
        console.log("Pivot Column: " + pColumn);
        console.log("Pivot Row: " + pRow);
        changeVectorPos(pRow,pColumn);
        normalizePivotRow(pRow, pColumn);
        showTable();
        transformRows(pRow, pColumn);
        showTable();
        //}
    }while(!evaluateMatrix());
    showValues();
}

function changeVectorPos(pRow,pColumn){
    VB[pRow] = VL[pColumn];
}

function evaluateMatrix(){
    for(var i = 0; i < columns; i++){
        if(math.larger(0, matrix[rows - 1][i])){
            return false;
        }
    }
    return true;
}




function transformRows(pRow, pColumn){
    var pMultiplier = 0;
    for(var i = 0; i < rows; i++){
        if(i != pRow){
            pMultiplier = math.multiply(matrix[i][pColumn],math.fraction(-1));
            //pMultiplier = new Decimal(matrix[i][pColumn]).times(-1);
            console.log("Multiplier: " + pMultiplier);
            for(var j = 0; j < columns; j++){
                
                //var sumValue = new Decimal(matrix[pRow][j]).times(pMultiplier);
                var sumValue = math.multiply(matrix[pRow][j],pMultiplier);
                //console.log(matrix[pRow][j] + " * " + pMultiplier + " = " + (matrix[pRow][j]*pMultiplier));
                //console.log(matrix[i][j] + " + " + sumValue +" = " + matrix[i][j]+sumValue);
                //matrix[i][j] = new Decimal(sumValue).plus(matrix[i][j]);
                matrix[i][j] = math.add(sumValue,matrix[i][j]); 
            }
        }
    }
    //console.table(matrix);
}

function showValues(){
    var divMain = document.getElementById("generated-content");
    var template = "";
    for(var i = 0; i < VB.length; i++){
        console.log(VB[i] + " = " + matrix[i][columns - 1]);
        template+="<div class='row'><p>"+ VB[i] + " = " + matrix[i][columns - 1] +"</p></div>";
    }

    divMain.innerHTML+= template;



}

function showTable(){
    var s;
    for(var i = 0; i < rows; i++){
        s = "";
        for(var j = 0; j < columns; j++){
            s+=matrix[i][j] + " "
        }
        s+= "\n";
        console.log(s);
    }
    
}

function generateMatrix(){
    rows = numRes + 1;
    columns = numVar + numRes + 1;

    //Create the matriz lines
    matrix = new Array(rows);

    //Create the matriz columns
    for(var i = 0; i < rows; i++){
        matrix[i] = new Array(columns);
    }
    
    for(var i = 0; i < rows; i++){
        for(var j = 0; j < columns; j ++){
            //matrix[i][j] = new Decimal(0);
            matrix[i][j] = math.fraction(0,1);
        } 
    }

    //Generate vectors
    for(var i = numVar + 1; i <= (numRes + numVar); i++){
        VB.push("x"+i);
    }

    VB.push("Z");
    for(var i = 1; i <= (numRes + numVar); i++){
        VL.push("x"+i);
    }

    console.table(VB);
    console.table(VL);

    //Reading input values
    for(var i = 0; i < numRes; i++){
        for(var j = 0; j < numVar; j ++){
            matrix[i][j] = math.fraction(parseFloat(document.getElementById("r" + i + "x" + j).value), 1);
            //matrix[i][j] = new Decimal(document.getElementById("r" + i + "x" + j).value);
        } 
        console.log("FX" + i);
        //matrix[i][columns - 1] = new Decimal(document.getElementById("rr" + i).value);
        matrix[i][columns - 1] = math.fraction(parseFloat(document.getElementById("rr" + i).value));
        if(i <= (numVar - 1)){
            matrix[rows - 1][i] = math.fraction(parseFloat(document.getElementById("fx" + i).value * -1));
            //matrix[rows - 1][i] = new Decimal(document.getElementById("fx" + i).value * -1);
        }
        matrix[i][(numVar - 1) + (i + 1)] = 1; 
    }

    //console.table(matrix);
    


}

 /*function (num){
   var resultUp;
    var resultDown;
    if(num > 0){
        resultUp = parseFloat((Math.ceil(num) - num).toFixed(3));
        resultDown = parseFloat((num - Math.floor(num)).toFixed(3));
        return (resultUp > resultDown) ? resultDown : resultUp;
    }else {
        resultUp = parseFloat(((Math.floor(num) * 1) - num).toFixed(3));
        resultDown = parseFloat(((num * -1) - Math.ceil(num)).toFixed(3));
        return (resultUp > resultDown) ? resultDown : resultUp;
    }
    return parseFloat(num.toFixed(4));
}*/

function findPivotColumn(){
    var least;
    var col;
    for(var i = 0; i < rows; i++){
        for(var j = 0; j < columns; j++){
            if(i == 0 && j == i){
                least = matrix[i][j];
                col = j;
            }else {
                if(math.larger(least,matrix[i][j])){
                    least = matrix[i][j];
                    col = j;
                }
            }
        }
    }
    return col;
}

function findPivotRow(pColumn){
    var row = 0;
    var firstPostv = false;
    var leastValue;
    for(var i = 0; i < rows - 1; i++){
        var div = matrix[i][pColumn];
        var curNum = matrix[i][columns - 1];
        
 /*       if(!firstPostv){
            if(math.larger(curNum,0) && math.larger(div,0)){
                console.log(curNum + "/" + div + " = " + math.divide(curNum,div));
                //leastValue = new Decimal(curNum).dividedBy(div);
                leastValue = math.divide(curNum,div);
                //console.log("Least Value: " + leastValue);
                firstPostv = true;
                row = i;
            }
        }else {
            if(math.larger(leastValue, math.divide(curNum,div))){
                //leastValue = new Decimal(curNum).dividedBy(div);
                leastValue = math.divide(curNum,div);
                //console.log("Least Value: " + leastValue);
                row = i;
            }
        }*/
        if(math.larger(curNum,0) && math.larger(div,0)){
            if(firstPostv == false){
                console.log(curNum + "/" + div + " = " + math.divide(curNum,div));
                //leastValue = new Decimal(curNum).dividedBy(div);
                leastValue = math.divide(curNum,div);
                //console.log("Least Value: " + leastValue);
                firstPostv = true;
                console.log("First is positive!");
                row = i;
            }else {
                if(math.larger(leastValue, math.divide(curNum,div))){
                    //leastValue = new Decimal(curNum).dividedBy(div);
                    leastValue = math.divide(curNum,div);
                    //console.log("Least Value: " + leastValue);
                    row = i;
                    console.log(curNum + "/" + div + " = " + math.divide(curNum,div));
                    console.log("Entering on else of positive");
                }
            }
        }
    }

    return row;
}

function normalizePivotRow(pRow, pColumn){
    var value = matrix[pRow][pColumn];
    console.log("Pivot Value: " + value);
    var inverseValue = (math.pow(value, -1));
    for(var i = 0; i < columns; i++){
        //matrix[pRow][i] = new Decimal(matrix[pRow][i]).times(inverseValue); 
        matrix[pRow][i] = math.multiply(matrix[pRow][i],inverseValue);
    }
   // console.table(matrix);
}

/*function parseFloat(num){
    return parseFloat(Number(num).toFixed(15));
}*/

function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}