const canvas = document.querySelector('canvas');
const lineWidth = document.getElementById('line-width');
const colorPad = document.getElementById('color-pad');
const colorOptions = Array.from(document.getElementsByClassName('color-option'));
const fillBtn = document.getElementById('fill-btn');
const drawBtn = document.getElementById('draw-btn');
const initBtn = document.getElementById('init-btn');
const eraseBtn = document.getElementById('erase-btn');
const fileInput = document.getElementById('file');
const text = document.getElementById('text');
const saveBtn = document.getElementById('save');
canvas.height = 500;
canvas.width = 800;


if(canvas.getContext){
    const ctx = canvas.getContext('2d');
    let isPainting = false;
    let isFilling = false;
    let isWriting = false;
    ctx.lineWidth = lineWidth.value;
    ctx.lineCap = "round";

    function onMove(evt){
        if(isPainting){
            ctx.lineTo(evt.offsetX, evt.offsetY);
            ctx.stroke();
            return;
        }
        ctx.beginPath();
        ctx.moveTo(evt.offsetX, evt.offsetY);
    }       
    
    function onMousedown(evt){
        isPainting = true;
    }

    function cancelPainting(evt){
        isPainting = false;
    }

    function onCanvasClick(evt){
        if(isFilling){
            ctx.fillRect(0,0,canvas.width, canvas.height);
            // ctx.fill();
        }
    }

    function onLineWidthChange(evt){
        ctx.lineWidth = evt.target.value;
    }

    function onColorChange(evt){
        const color = evt.target.value;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
    }

    function onColorClick(evt){
        const color = evt.target.dataset.color;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        colorPad.value = color;
    }

    function onFillBtnClick(evt){
        isFilling = true;
        fillBtn.classList.toggle('gray');
        drawBtn.classList.remove('gray');
        changeClickedBtn('fill');
    }

    function onDrawBtnClick(evt){
        isFilling = false;
        ctx.fillStyle = colorPad.value;
        ctx.strokeStyle = colorPad.value;
        drawBtn.classList.toggle('gray');
        fillBtn.classList.remove('gray');
        changeClickedBtn('draw');
    }

    function onInitBtnClick(evt){
        ctx.save()
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }

    function onEraseBtnClick(evt){
        ctx.strokeStyle = 'white';
        isFilling = false;
        fillBtn.classList.remove('gray');
        drawBtn.classList.remove('gray');
        changeClickedBtn('erase');
    }

    function onFileChange(evt){
        const file = evt.target.files[0];
        const url = URL.createObjectURL(file);
        const img = new Image(); //document.createElement('img');
        img.src = url;
        img.onload = function(){
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            fileInput.value = null;
        }
    }

    function onDoubleClick(evt){
        isFilling = false;
        isPainting = false;

        const textInput = text.value;
        if(textInput !== ''){
            ctx.save();
            ctx.lineWidth = 1;
            ctx.font = '40px serif';
            ctx.fillText(textInput,evt.offsetX, evt.offsetY);
            ctx.restore();    
        }
    }

    function onSaveBtnClick(evt){
        const url = canvas.toDataURL();

        const a = document.createElement('a');
        a.href = url;
        a.download = 'myDrawing.png';
        a.click();
    }

    function onTextBtnClick(evt){ //toggle
        if(isWriting){
            isWriting = false;
        } else {
            isWriting = true;
        }
    }

    function changeClickedBtn(mode){
        const btns = document.getElementsByClassName('btns');
        Array.from(btns).forEach(btn => btn.classList.remove('gray'));
        let clickEl;
        switch(mode){
            case 'fill' : 
                clickEl = fillBtn; break;
            case 'draw' :
                clickEl = drawBtn; break;
            case 'erase' :
                clickEl = eraseBtn; break;

            }
            clickEl.classList.add('gray');
    }

    canvas.addEventListener('mousemove', onMove); //이방식은 같은 이벤트에 여러개의 listener를 붙일 수 있다. 삭제도 가능
    canvas.addEventListener('mousedown', onMousedown);
    canvas.addEventListener('mouseup', cancelPainting);
    canvas.addEventListener('mouseleave', cancelPainting);
    canvas.addEventListener('click', onCanvasClick);
    lineWidth.addEventListener('change', onLineWidthChange);
    colorPad.addEventListener('change', onColorChange);
    colorOptions.forEach(i => i.addEventListener('click', onColorClick));
    fillBtn.addEventListener('click', onFillBtnClick);
    drawBtn.addEventListener('click', onDrawBtnClick);
    initBtn.addEventListener('click', onInitBtnClick);
    eraseBtn.addEventListener('click', onEraseBtnClick);
    fileInput.addEventListener('change', onFileChange);
    canvas.addEventListener('dblclick', onDoubleClick);
    saveBtn.addEventListener('click', onSaveBtnClick);
} else {

}
