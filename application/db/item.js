let item = require('./db');
let multer = require('multer');
let sharp = require('sharp');
let crypto = require('crypto');

function getItemByID(id) {
  return new Promise((resolve, reject) => {
    let getItemQuery = `SELECT * FROM item
                        WHERE id = ?`
    item.query(getItemQuery, [id])
      .then((rows) => {
        if(rows.length == 0) {
          reject(`(x) ERROR --> Database did not return any items`)
        }
        else {
          resolve(rows[0])
        }
      })
      .catch((err) => {
        reject(`(${err}) ERROR --> DB call failed`)
      })
  });
}

function newMessage(sender_id, item_id, message){
  return new Promise((resolve, reject) => {
      let getItem = `SELECT * FROM item WHERE id=?;`
      item.query(getItem, [item_id])
          .then((items) => {
              // console.log(items[0])
              let getReceiverUser = `SELECT * FROM user WHERE id=?;`
              item.query(getReceiverUser, [items[0].user_id])
                  .then((receiver_users) => {
                      console.log(receiver_users[0])
                      let insertMessage = `INSERT INTO message  
                                    (item_id, user_id_sender, user_id_reciever, subject, message)
                                    VALUES
                                    (?, ?, ?, ?, ?);`
                      item.query(insertMessage, [item_id, sender_id, receiver_users[0].id, items[0].name, message])
                          .then((result) => {
                              console.log('OK')
                              console.log(result)
                              resolve('OK')
                          })
                  })
                  .catch((err) => {
                      reject(err.errno)
                  })
          });
  });
}

function insertItem(name, description, price, category, fileName, userID){
    return new Promise(((resolve, reject) => {
      let baseSQL = `INSERT INTO item (name, description, price, category_name, image, user_id) 
                      VALUES (?, ?, ?, ?, ?, ?)`
      item.query(baseSQL, [name, description, price, category, fileName, userID])
        .then(() =>{
          resolve('ok')
        })
        .catch((err) =>{
          console.log('Failed at DB insert')
          reject(err.errno)
        })
    }))
}

let storage = multer.diskStorage({
  destination: function(req, file, callback) {
      callback(null, "public/images/items");
  },
  filename: function(req, file, callback) {
      let fileExtension = file.mimetype.split("/")[1];
      let randomName = crypto.randomBytes(16).toString("hex");
      callback(null, `${randomName}.${fileExtension}`)
  }
});

function newItem(req, res) {
    return new Promise(((resolve, reject) => {
        let uploader = multer({storage: storage}).single('uploadImage');
        uploader(req, res, ()=>{
            let filePath = req.file.path;
            console.log("testing" + req.file.path);
            let fileName = req.file.filename;
            let thumbnailName = `thumbnail-${fileName}`;
            let thumbnailPath = req.file.destination + "/" + thumbnailName;
            let userID = req.user.id;
            let name = req.body.itemname;
            let description = req.body.description;
            let price = req.body.price;
            let category = req.body.category;

            sharp(filePath).resize(400).toFile(thumbnailPath);

            insertItem(name, description, price, category, fileName, userID)
              .then((result) => { 
                resolve('ok')
              })
              .catch((err) => {
                reject(err)
              })
        });
    }))

};

module.exports = {
  getItemByID,
  newMessage,
  newItem
}