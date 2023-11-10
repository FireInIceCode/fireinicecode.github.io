var canvas,ctx;
var arr;
const n=15,size=40,bd=20;
const BLACK=1,WHITE=2;
var img=[null,new Image(),new Image()]
img[BLACK].src='./black.jpg';
img[WHITE].src='./white.jpg';
function main(){
    canvas=document.querySelector('canvas');
    ctx=canvas.getContext('2d');
    arr=[];
    for(var i=0;i<15;i++){
        arr.push([])
        for(var j=0;j<15;j++){
            arr[arr.length-1].push(0)
        }
    }
    render();
    canvas.onclick=onclick;
}

function render(){
    ctx.clearRect(0,0,n*size+bd,n*size+bd)
    for(var i=0;i<15;i++){
        ctx.beginPath();
        ctx.moveTo(i*size+bd,bd);
        ctx.lineTo(i*size+bd,(n-1)*size+bd);
        ctx.stroke();
    }
    for(var i=0;i<15;i++){
        ctx.beginPath();
        ctx.moveTo(bd,i*size+bd);
        ctx.lineTo((n-1)*size+bd,i*size+bd);
        ctx.stroke();
    }
    for(var i=0;i<15;i++){
        for(var j=0;j<15;j++){
            if(arr[i][j]){
                ctx.beginPath();
                ctx.arc(bd+j*size,bd+i*size,size/3,0,Math.PI*2);
                ctx.stroke();
                ctx.save();
                ctx.clip();
                ctx.fillStyle=arr[i][j]==BLACK?"black":"white";
                ctx.fillRect(0,0,canvas.width,canvas.height);
                // ctx.drawImage(img[arr[i][j]],bd+j*size-size/3,bd+i*size-size/3,size/3*2,size/3*2);
                ctx.restore();
            }
        }
    }
}
var turn=BLACK,over=false;
function onclick(e){
    if(over)return;
    [gx,gy]=[parseInt((e.x-bd+size/2)/size),parseInt((e.y-bd+size/2)/size)]
    if(arr[gy][gx])return;
    arr[gy][gx]=turn;
    turn=3-turn;
    render();
    var e=checkWin();
    if(e){
        over=true;
        setTimeout(() => {
            alert([null,'LXT WIN!','ZYR WIN!'][e]);
        }, 0.1);
    }
}
function checkWin(){
    var dir=[
        [0,1],[1,0],[0,-1],[-1,0],[1,1],[-1,-1],[1,-1],[-1,1]
    ];
    for(var i=0;i<15;i++){
        for(var j=0;j<15;j++){
            var e=arr[i][j];
            if(!e)continue;
            for(var w=0;w<dir.length;w++){
                var flag=true;
                for(var k=0;k<5;k++){
                    if(arr[i+k*dir[w][0]][j+k*dir[w][1]]!=e){
                        flag=false;
                        break;
                    }
                }
                if(flag){
                    return e;
                }
            }
        }
    }
    return false;
}

window.onload=()=>{
    main();
}