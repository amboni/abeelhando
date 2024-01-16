var fs = require('fs');
var PDFParser = require('pdf2json');


function writeFile(fileDest, stringToSave) {
    fs.writeFile(fileDest, stringToSave, 'utf8', function (err) {
        //fs.writeFile(fileDest, sqlCmdsStr, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }

        console.log(`JSON file ${fileDest} has been saved.`);
    });
}


// var path = osHomedir();
// console.log("dir: " + path);
// var homepath = path.replace(new RegExp('\\' + path.sep, 'g'), '/');
// var pdfFilePath = homepath + '/Downloads/' + 'filename.pdf';
var pdfFilePath = './src/assets/pdf/Words_of_the_Champions_Printable_FINAL.pdf';

if (fs.existsSync(pdfFilePath)) {
  //Read the content of the pdf from the downloaded path
  //var pdfParser = new PDFParser(browser, 1);
  var pdfParser = new PDFParser();

  pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
  pdfParser.on("pdfParser_dataReady", pdfData => {
    //Need find actual words
    //pdfData.Pages[3].Texts[100].R[0].T
    let texts = pdfData.Pages.slice(3).map(p => p.Texts).flat();

    //'ONE%20BEE'
    //'school-level%20spelling%20bees.%20These%20words%20come%20from%20a%20list%20of%20books%20carefully%20selected%20by%20the%20Bee%E2%80%99s%20editorial%20team.%20That%20list%20of%20books%20is%20called%20'

    let filteredTexts = texts.filter(t => t.R && t.R.length);
    let words = filteredTexts.map( t => t.R[0].T).filter(str => {
        return str != 'OR' &&
               str.indexOf("%") == -1 &&
               isNaN(parseFloat(str));

        // return str.indexOf("%") == -1;
    });
    console.log("\n\n\n\nWords (" + words.length + ") .....");
    writeFile("./src/assets/pdf/Words_of_the_Champions_Printable_FINAL.txt", words.join('\n'));
    //fs.writeFile("./src/assets/pdf/Words_of_the_Champions_Printable_FINAL.json", JSON.stringify(pdfData));
    //fs.writeFile("./src/assets/pdf/Words_of_the_Champions_Printable_FINAL.txt", words.join('\n'));
  });

  pdfParser.loadPDF(pdfFilePath);
} else {
    console.error('Ops file not present in the downloaded folder');
    //Throw an error if the file is not found in the path mentioned
    //browser.assert.ok(fs.existsSync(pdfFilePath));
}