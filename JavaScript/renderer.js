//renderer-2

//新規作成
const newfile = document.getElementById("newfile");
newfile.addEventListener("click", async function(){
    var res = await window.api.newfile();

})
//ファイル読み込み
const form = document.getElementById("sendimg");
function createinput() {
    let newInput = document.createElement("input");
    newInput.type = "file";
    newInput.id = `get${count}`;
    newInput.name = `get${count}`;
    form.appendChild(newInput);
}

var filename = document.getElementById("name");
var filetype = document.getElementById("type");
const readfile = document.getElementById("readfile");
const getfile = document.getElementById("getfile");
const getfolder =document.getElementById("getfolder");

function readff(event) {
    let gotimg = event.target;

    for(let i=0; i<gotimg.files.length && i < 12; i++){
        let getfilelist = new DataTransfer();
        let reader = new FileReader();
    
        if (gotimg.files && gotimg.files[i]) {
            let currentFile = gotimg.files[i];

            reader.onload = function (e) {
                let mini = files[cells[count].toLowerCase()];
                mini.src = e.target.result;
//                paths[cells[count].toLowerCase()].textContent = e.target.result;
                let file = new File([currentFile], currentFile.name);

                getfilelist.items.add(file);
                var getimg = document.getElementById(`get${count}`);
                getimg.files = getfilelist.files;
                selectimg.src = mini.src;
                getfile.value = "";
                files[cells[count].toLowerCase()].style.border = "none";
                clearbtn[cells[count].toLowerCase()].style.display = "none";
                count++;
                getimg = document.getElementById(`get${count}`);
                files[cells[count].toLowerCase()].style.border = "3px dashed #ddd";
                clearbtn[cells[count].toLowerCase()].style.display = "block";
            }
        filename.readOnly = false;
        filename.value = gotimg.files[i].name;
        filename.readOnly = true;
        filetype.readOnly = false;
        filetype.value = gotimg.files[i].type;
        filetype.readOnly = true;
        };
        reader.readAsDataURL(gotimg.files[i]);
    }
}

readfile.addEventListener("click", function() { getfile.click(); });
getfile.addEventListener("change", function(event) { readff(event); });
getfolder.addEventListener("change",function(event){
    for(let i = 0; i < 12; i++){
        var files = event.target.files[i];
        readff({ target: { files }} );
    }
});


//サイズ変更
const setsize = document.getElementById("setsize");
const selectsize = document.getElementById("selectsize");
var selectopt = selectsize.selectedIndex;
var imgsize = selectsize.options[selectopt].value;
setsize.value = imgsize;
window.size = imgsize;
selectsize.addEventListener("change", async function () {
    var selectopt = selectsize.selectedIndex;
    var imgsize = selectsize.options[selectopt].value;
    setsize.value = imgsize;
    var res = await Gluon.ipc.send("getsize", {size: imgsize});
    console.log(imgsize);
    console.log(res);
});

//保存
const save = document.getElementById("save");
const sendimg = document.getElementById("sendimg");
const submit = document.getElementById("submit");
save.addEventListener("click", async function () {
    await Promise.all(Array.from({ length: 12 }, (_, n) => {
        return new Promise((res1, rej1) => {
            var get = document.getElementById(`get${n}`);
            var blob = new Blob([get.files[0]], {type: "image/png"}); 
            var reader = new FileReader();
            try{
                reader.onload = function(event){
                    var binary = event.target.result;
                    res1(binary);    
                }
            } catch(err) {
                console.error(`reader${err}`);
                rej1();
            };
            reader.readAsBinaryString(blob);
        });
    }))
    .then(async (data) => {
        var result = await Gluon.ipc.send("sendimg", {binary: data});
        result = result.data;
        console.log(result);
        try {
            const savebase64Data = result;
            const savebinarydata = atob(savebase64Data);
            const bytearray = new Uint8Array(savebinarydata.length);
            for (let i = 0; i < savebinarydata.length; i++) {
                bytearray[i] = savebinarydata.charCodeAt(i);
            }
            const blob = new Blob([bytearray], { type: "image/png" });
            const fh = await window.showSaveFilePicker({ suggestedName: "新しいキャラチップ.png"});
            const stream =  await fh.createWritable();
            console.log(blob);    
            await stream.write(blob);
            await stream.close();
        } catch (err){
            console.error(err)
        }
    }).catch(err => {
        console.error(err);    
    })
});
