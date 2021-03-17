let IT = require('../models/it')
const {google} = require('googleapis');
const keys = require('../keys.json');
const _ = require("lodash");
const { MongoClient, ObjectId } = require("mongodb");
// const csv = require('csv-parser');
const csv=require('csvtojson');
const csvtojson = require('csvtojson');

// Replace the uri string with your MongoDB deployment's connection string.
const uri =
"mongodb://localhost:27017/ddroonSpreadsheet";
const googleSheetID = '1xKUKTyPtIQhwTOuZSSCJVcNm7cnEv2ZwVghA7qa1aWk'



const client = new google.auth.JWT(
    keys.client_email, 
    null, keys.private_key, ['https://www.googleapis.com/auth/spreadsheets']
);



exports.get = (req,res) => {
    IT.find({}).exec((err, userSave) => {
        if (err) {
            res.status(400).json({
                message: "Error found!"
            })
            return
        }
        res.status(200).json({
            // user: userSave,
            message: "Hi from Droon 2!"
        })
    })
}



exports.post = (req, res) => {
    let body = req.body;
    let user = new IT();
    user['category'] = body['category'],
    user['usingPurpose'] = body['usingPurpose'], 
    user['userName'] = body['userName'],
    user['password'] = body['password']

    user.save((err, userSave) => {
        if (err) {
            res.status(400).json({
                message: "No User Found!"
            })
            return
        }
        res.status(200).json({
            user: userSave,
            message: "IT saved successfully!"
        })
    })
}
exports.put = (req, res) => {
    let reqBody = req.body;
        IT.updateOne({userName: reqBody['userName'] }, {
        $set: {
            category: reqBody['category'],
            usingPurpose: reqBody['usingPurpose'], 
            userName: reqBody['userName'],
            password: reqBody['password']

        }
    }).then((updateResult) => {
        res.status(200).json(updateResult)
    })
}

exports.delete = (req, res) => {
    IT.findByIdAndRemove(req.params.id).then(deleteResults => {
        res.status(200).json(deleteResults)
    });
}


exports.getSkuData = async (req,res) => {

    
    client.authorize((err, userSave) => {
        if (err) {
            res.status(400).json({
                message: "Error found!"
            })
            return
        }
////////////////////////////////

        dbToSheet(client)


async function  dbToSheet (cl) {
    let db, client;
    const query3 = {};
    const gsapi = google.sheets({version: 'v4', auth: cl});

     
        client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        db = client.db("contentSourcing");
        var result =  await db.collection("AOCP_newfiles").find(query3).toArray()
        // console.log(result)

        result2 = await aooToaoa(result)


        const updateOption = {
            spreadsheetId : googleSheetID,
            range : 'A1', 
            valueInputOption : 'USER_ENTERED', 
            resource : { values : result2}
    
        };
        console.log('DB to Sheet data transfer processing')

    
    await gsapi.spreadsheets.values.update(updateOption);
    console.log('DB to Sheet completed')
    res.status(200).json({
        // user: userSave,
        message: "DB to Sheet completed"
    })
    }

////////////////////////////////





      
    })
}

async function aooToaoa(input){


    var keys = await Object.keys(input[0]);  
       var values = await input.map(obj => Object.values(obj))
     
     await values.unshift(keys)
 
 return values
  
     }


     exports.SaveSkuData = async (req,res) => {
     
        client.authorize((err, userSave) => {
            if (err) {
                res.status(400).json({
                    message: "Error found!"
                })
                return
            }
    ////////////////////////////////
    
          sheetToDB(client)
    
    
            async function sheetToDB(cl){
                const gsapi = google.sheets({version: 'v4', auth: cl});
                const opt ={
                    spreadsheetId : googleSheetID,
                    range : 'A1:FW10672'
                };
            
                let data = await gsapi.spreadsheets.values.get(opt)
                dataArray = data.data.values;
                dataArray = dataArray.map(function(r){
                    while(r.length < 177){
                        r.push(null);
                    }
                    return r;
                })
            
                result1 = await convertToArrayOfObjects(dataArray)
                
                await insertData (result1)

                res.status(200).json({
                    // user: userSave,
                    message: "Sheet to DB completed"
                })
            }
            
    
    ////////////////////////////////
    
    
    
    
    
        
        })
    }
    
    async function convertToArrayOfObjects(data) {
        var keys = data.shift(),
            i = 0, k = 0,
            obj = null,
            output = [];
    
        for (i = 0; i < data.length; i++) {
            obj = {};
    
            for (k = 0; k < keys.length; k++) {
                obj[keys[k]] = data[i][k];
            }
    
            output.push(obj);
        }
    
        return output;
    }

    async function  insertData (spreadsheetData){
        let db, client;
        const query3 = {};       
          client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    
    let inputHeaders= ['_id', 'Item Id', 'Taxonomy', 'Node Type', 'ABC POS SKU Number', 
    'ABC Vendor Name', 'ABC POS SKU Short Description', 'ABC SKU Long Description', 
    'ABC Manufacturer Part Number', 'ABC Size Description', 'ABC Size Profile Description',
     'ABC Spec Warranty Description', 'ABC Special Attribute Description', 'ABC Special Order Item', 'ABC Unit of Measure Description', 'Batch Flag']
    let contentWithHeader= ['Item Id', 'Taxonomy', 'Node Type', 'ABC POS SKU Number', 'ABC Vendor Name', 'ABC POS SKU Short Description', 'ABC SKU Long Description', 'ABC Manufacturer Part Number', 'ABC Size Description', 'ABC Size Profile Description', 'ABC Spec Warranty Description', 'ABC Special Attribute Description', 'ABC Special Order Item', 'ABC Unit of Measure Description', 'Batch Flag']
    
    
    //filter input Headers only
    function removeHeader(sourceObject, removeKeys = []) {
        const sourceKeys = Object.keys(sourceObject);
        const returnKeys = sourceKeys.filter(k => !removeKeys.includes(k));
        let returnObject = {};
        returnKeys.forEach(k => {
          returnObject[k] = sourceObject[k];
        });
        return returnObject;
      }
    
    
      
    //Remove all input HeadersfilterHeader
    function filterHeader(sourceObject, removeKeys = []) {
        const sourceKeys = Object.keys(sourceObject);
        const returnKeys = sourceKeys.filter(k => removeKeys.includes(k));
        let returnObject = {};
        returnKeys.forEach(k => {
          returnObject[k] = sourceObject[k];
        });
        return returnObject;
      }
      db = client.db("contentSourcing");
    
      var getHeaderFromDB =  await db.collection("AOCP_newfiles").find(query3).toArray()

    
      const projectContent = await spreadsheetData.map(obj => removeHeader(obj, contentWithHeader));
      const projectHeader = await getHeaderFromDB.map(obj => filterHeader(obj, inputHeaders));
    

      var merge = (obj1, obj2) => ({...obj1, ...obj2});

      combined_Header_Content = await _.zipWith(projectHeader, projectContent, merge)
   
            //   await db.collection("abc_wave4_sourcing").drop()

//////////////////////////////////////////////////////

for (let data of combined_Header_Content){


    _id = data._id
    
    delete data._id;


    await db.collection("AOCP_newfiles").updateOne({"_id":ObjectId(_id)}, {$set: data})




}
        //   await db.collection("abc_wave4_sourcing").insertMany(combined_Header_Content)

          console.log('Sheet to DB completed');



//////////////////////////////////////////////////////







          
        
    
     
    }
    

