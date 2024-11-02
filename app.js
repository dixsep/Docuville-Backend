import express from 'express'
import cors from 'cors'
import { createWorker } from 'tesseract.js'
import multer from 'multer'

const app = express();
const upload = multer({dest : 'uploads/'});

app.use(cors());
app.use(express.json());

app.post('/upload', upload.single('file'), async (req,res) => {


    const worker = await createWorker(['eng']);

    try{
        if(!req.file){
          return res.status(400).json({Error : 'No Document Uploaded'});
        }

        const imageBuffer = req.file.path;
        const {data: {text}} = await worker.recognize(imageBuffer);
        const data = {
            Name : extractName(text),
            LicenseNo : extractLicenseNo(text),
            ExpiryDate : extractExpiryDate(text)
        };

        res.json(data);

        console.log(data);
    } catch (error){
        console.error('Document extraction error:', error);
        res.status(500).json({ error: 'Document extraction failed' });
    }
})

const PORT = 8800;
app.listen(PORT , () => {
    console.log(`Server running on PORT : ${PORT}`);
})

{/* Extract Functions*/}


const checkForDate = (date) => {

    // [0-9][0-9]/[0-9][0-9]/[0-9][0-9][0-9][0-9] : dd/mm/yyyy

    for(let i = 0; i < 10; i++){

        if(i == 2 || i == 5){
            if(date[i] != '/'){
                return false;
            }
        }
        else{
            if(date[i] >= '0' && date[i] <= '9'){
                // do ntg
            } else{
                return false;
            }
        }
    }
    
    return true;
}

const extractName = (text) => {

    const match = text.match(/Name:\s*([^\n]+)/i);
    console.log(match);
    const res = match[0];
    console.log(res);
    const idx = res.indexOf("Holders");


    let Name = "";

    console.log(idx);

    for(let i = 6 ; i < idx - 3; i++){
        Name += res[i];
    }

    return Name;
}

const extractLicenseNo = (text) => {

    //State : Telangana , 16-digit

    const match = text.match(/TS\d{14}/);

    console.log(match);

    return match ? match[0] : " ";
}

const extractExpiryDate = (text) => {

    const dates = [];

    for (let i = 0; i < text.length - 10; i++){
        let ans = "";
        for(let j = i; j < i + 10; j ++){
            ans += text[j];
        }

        if(checkForDate(ans)){
            dates.push(ans);
        }
    }

    {/* dates : 4
        0  : Issue
        1  : Validity (NT)
        2  : Validity (TR)
        3  : Date of Birth
   */}

    return dates[1];
}

const extractDOB = (text) => {

    const dates = [];

    for (let i = 0; i < text.length - 10; i++){
        let ans = "";
        for(let j = i; j < i + 10; j ++){
            ans += text[j];
        }

        if(checkForDate(ans)){
            dates.push(ans);
        }
    }

    {/*
        0 : Date of Issue
        1 : Validity (NT)
        2 : Validity (NR)
        3 : Date of Birth (DOB)
    */}

    return dates[3];
}

