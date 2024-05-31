//renderer-1
var Gluon;

addEventListener("load", async (event) => {
    imgs = {};
    imgs = await Gluon.ipc.send("imgcount", {folder:""});
    const imgarray = imgs.data;
    imgurl = {};
    Object.keys(imgarray).forEach(x => {
        // Canvas要素を作成
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        // PNG形式のバイナリデータ
        const binaryData = imgarray[x];
        // PNGバイナリデータを画像として描画
        const img = new Image();
        img.onload = function() {
            // Canvasに画像を描画
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);  
        };
        // バイナリデータをBase64に変換してimg要素にセット
        img.src = 'data:image/png;base64,' + btoa(binaryData); 
        imgurl[x] = img.src;
    });
    const readfilepic = document.querySelector(`img[alt="readfile"`);
    readfilepic.src = imgurl["NAE"];
    const readpsdpic = document.querySelector(`img[alt="readpsd"]`);
    readpsdpic.src = imgurl["未実装"];
    const mae = document.querySelector(`img[alt="前"]`);
    mae.src = imgurl["前"];
    const hidari = document.querySelector(`img[alt="左"]`);
    hidari.src = imgurl["左"];
    const migi = document.querySelector(`img[alt="右"]`);
    migi.src = imgurl["右"];
    const usiro = document.querySelector(`img[alt="後"]`);
    usiro.src = imgurl["後"];
    const clear = new File([imgurl["clear"]], "clear.png");
    const list = new DataTransfer();
    list.items.add(clear);
    for(let n=0; n<12; n++){
        var get = document.getElementById(`get${n}`);
        get.files = list.files;
    };
//    const ichi = new File([imgurl["a"]], "a.png");
//    list.items.clear();
//    list.items.add(ichi);
//    var get = document.getElementById(`get0`);
//    get.files = list.files;
});
var count = 0;

const menubar = ["file","edit","config"];
const menus = {};
const menuchildren = {};

menubar.forEach(x => {
    menus[x] = document.getElementById(x);
    menuchildren[x] = document.getElementById(`child${x}`);
    
    if (menus[x] && menuchildren[x]) {
        menus[x].addEventListener("click", function(){
            menubar.forEach(y => {
                if (menus[y]) {
                    menus[y].style.backgroundColor = "#eee";
                }
                if (menuchildren[y]) {
                    menuchildren[y].style.display = "none";
                }
            });
            if (menus[x]) {
                menus[x].style.backgroundColor = "#def";
            }
            if (menuchildren[x]) {
                menuchildren[x].style.display = "block";
            }
        });
    }
});

const selectimg = document.getElementById("select");
const cells = ["FR","FC","FL","RR","RC","RL","LR","LC","LL","BR","BC","BL"];
const files = {};
const clearbtn = {};

cells.forEach(x => {
    clearbtn[x.toLowerCase()] = document.getElementById(`x${x.toLowerCase()}`);

    files[x.toLowerCase()] = document.getElementById(x);
    files[x.toLowerCase()].addEventListener("click", function(){
        cells.forEach(y => {
            files[y.toLowerCase()].style.border = "none";
            clearbtn[y.toLowerCase()].style.display = "none";
        });
        count = cells.indexOf(x,0);

        files[x.toLowerCase()].style.border = "3px dashed #ddd";
        clearbtn[x.toLowerCase()].style.display = "block";
        var file = document.getElementById(`get${count}`).files[0];
        var mini = files[cells[count].toLowerCase()];
        selectimg.src = mini.src;
        filename.readOnly = false;
        filename.value = file.name;
        filename.readOnly = true;
        filetype.readOnly = false;
        filetype.value = file.type;
        filetype.readOnly = true; 
        console.log(count);
    });
    clearbtn[x.toLowerCase()].addEventListener("click", function(){
        var getimg = document.getElementById(`get${count}`).files[0];
        let mini = files[cells[count].toLowerCase()];
    
        if(getimg){
        getimg.value = "";
        selectimg.src = "";
        mini.src = "";
    
        filename.readOnly = false;
        filename.value = "";
        filename.readOnly = true;
        filetype.readOnly = false;
        filetype.value = "";
        filetype.readOnly = true; 
        }
    });

});

const number = [0,1,2,3,4,5,6,7,8,9,10,11];
const input = {};
number.forEach(x => {
    input[x] = document.getElementById(`get${x}`);
});

