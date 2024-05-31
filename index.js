// main.js-1

// このモジュールはアプリケーションの生き死にを制御し、ネイティブブラウザウインドウを作成します
import * as Gluon from "@gluon-framework/gluon";
import fs from "fs";
//import createimage from "./getimg.js";
var Window;


(async () => {
  const browsers = process.argv.slice(2).filter(x => !x.startsWith("-"));

  if(browsers.length > 0) {
    for (const forceBrowser of browsers){
      Window = await Gluon.open('index.html', {
        windowSize: [800, 600],
        forceBrowser
      });
    }

    return;
  }
  
  Window = await Gluon.open('index.html', {
    windowSize: [800, 600]
  });

      //main-2
  const temp = "temp/"
  const sets = [];
  const Params = [];
  const buffers = [];

  var resizeOUTERpromise;

  function setimage(resize, size) {
      console.log("start  func6-setimage");
      for(let i = 0; i < 12; i++){
          if(fs.existsSync(resize[i])){
              var y = size * Math.floor(i / 3);
              if(i % 3 === 1){
                  var x = size;
              }else if(i % 3 === 2){
                  x = size * 2;
              }else if(i % 3 === 0){
                  x = 0;
              }
              var Param = {
                  input: resize[i],
                  left: x,
                  top: y
              };
              Params.push(Param); 
          };
      };
      const blanc = `${temp}blanc.png`;
      sharp(blanc)
      .composite(Params)
      .toFile(`${temp}newcharachip.png`, (err) => {
          if(err){
              console.error("error on concfile",err);
          };
      });
      console.log("finish func6-setimage");
  };

  function binary2buffer(input,size,i){
      console.log(`start  funcEX`);
          try{
              if (input.slice(0,5) === "data:"){
                  var imageDataWithoutScheme = input.replace(/^data:image\/\w+;base64,/, '');
                  var buf = Buffer.from(imageDataWithoutScheme, "base64");
                  buffers[i] = buf;    
              } else {
                  var base64 = Buffer.from(input, 'binary').toString('base64');
                  var imageDataWithoutScheme = base64.replace(/^data:image\/\w+;base64,/, '');
                  var buf = Buffer.from(imageDataWithoutScheme, "base64");
                  buffers[i] = buf;    
              }
          } catch (err) {
              console.error(`funcEX${err}`);
              return null;
          }
          return buf;    
  }

  async function resizeimg(input, size) {
      resizeOUTERpromise = new Promise((res1, rej1) => {
          console.log("start  func5-resizeimg"); 
          Promise.all(Array.from({ length: 12 }, (_, i) => { 
              return new Promise((res2, rej2) => {  
                  var inputpath = binary2buffer(input[i],size,i);
                  var outputpath = sets[i];
                  sharp(inputpath)
                  .resize(size,size)
                  .toFile(outputpath, (err) => {
                      if(err){
                          console.error(`tofile sharp error:${err}`);
                          rej2(err);
                      }
                      res2();
                  })
              })
          }))
          .then(() => {
              console.log("finish func5 resizeimage");
              res1();
          })
          .catch((err) => {
              console.error(`func5${err}`);
              rej1();
          })
      });
      return sets;
  };

  async function makesetfiles(data,size){
      new Promise((res1, rej2) => {
          console.log("start  func3-makesetfiles");
          for (let i = 0; i < 12; i++){
              var name;
              if (i == 0 || 9 < i){
                  name = `${temp}set_${i}.png`;
                  sets[i] = name;
              }else if(0< i && i < 10){
                  name = `${temp}set_0${i}.png`;
                  sets[i] = name;
              };
          };  
          console.log("finish func3-makesetfiles");  
          res1();    
      })
      .catch((err) => {
          console.error(`func3${err}`);
          rej1();
      })
      return size;
  };

  async function makeblanc(data,size){
      new Promise((res1, rej1) => {
          console.log("start  func2-makeblanc");
          const outwidth = size * 3;
          const outheight = size * 4;
          const blanc = `${temp}blanc.png`;
          try {
              sharp({
                  create:{
                      width:outwidth, height:outheight, channels:4,
                      background: {r:0,g:0,b:0,alpha:0}
                  }
              })
              .toFile(blanc, (err) => {
                  if(err){
                      console.error(`makeblanc error:${err}`);
                  }
              });
              console.log("finish func2-makeblanc");
              res1();        
          } catch (err) {
              console.error(`func2${err}`);
              rej1();
          }
      })
      return size;
  };

  async function makedir(data){
      new Promise((res1, rej1) => {
          console.log("start  func1-makedir");
          if(!fs.existsSync(temp)){
              fs.mkdir(temp, { recursive: true }, (err) => {
                  if (err) {
                      console.error("failed mkdir:", err);
                      rej1();
                      return;
                  } else {
                      console.log("finish func1-makedir");
                      res1();            
                  }
              });
          } else {
              console.log("finish func1-makedir");
              res1();            
          }
      })
      return data;
  };

  var process1;
  var process2;
  var concimg = async function(formdata, imagesize) {
      var formdata = formdata.binary;
      console.log(formdata);
      try {
          console.log(`start p1`);
          process1 = await Promise.all([
              makedir(formdata, imagesize),
              makesetfiles(formdata, imagesize)
          ])
          .then((value) => {
              console.log("fin p1");
              console.log(`start p2`);
              var data = value[0];
              var size = value[1];
              process2 = Promise.all([
                  resizeimg(data, size),
                  makeblanc(data, size),
                  resizeOUTERpromise   
              ])
              .then((value) => {
                  console.log("fin p2");
                  console.dir(value[0]);
                  console.log("start p3");
                  var resize = value[0];
                  var size = value[1];
                  setimage(resize, size);
              })
              .catch((err) => {
                  console.error(`process3${err}`)
              });   
          })
          .catch((err) => {
              console.error(`process2${err}`)
          })
      } catch (err) {
          console.error(`process1${err}`);
      }
  };

  async function createimage(form, size){
      try {
          await concimg(form, size)
          .then(() => {
              return fs.readFileSync(`temp/newcharachip.png`, "binary");
          });// concimg関数の実行を待つ
      } catch (err) {
        console.error('CI Error:', err);
      }
  };

  //ipc
  var imgsize = 32;
  Window.ipc.on("Window", open => {
    console.log(open);
    return { origin: open, give:"back"}})
    Window.ipc.on("getsize", size => {
      imgsize = size;
      return { give:"back", size: setsize };
    });
      
    Window.ipc.on("sendimg", async binary => {
      await createimage(binary, imgsize)
      var newchip = fs.readFileSync(`temp/newcharachip.png`, "base64");
      return { give:"back", data: newchip };
  });

  Window.ipc.on("imgcount", folder => {
    try{
      const imgfolder = fs.readdirSync("img/");
      const imgfiles = {};
      imgfolder.forEach(x => {
          imgfiles[x.slice(0,-4)] = fs.readFileSync(`Image/${x}`, "binary");
      });
      return {data: imgfiles};
    }catch(err){
      console.log(`img${err}`);
    }
  });


})();

