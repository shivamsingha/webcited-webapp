const { GoogleSpreadsheet } = require("google-spreadsheet");
const path = require("path");
const fs = require("fs");
const creds = require("../credentials.json");

const spreadsheetId = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../spreadsheetId.json"))
);

const doc = new GoogleSpreadsheet(spreadsheetId);
let firstSheet;
(async function () {
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  firstSheet = doc.sheetsByIndex[0];
})();

module.exports = async (req) => {
  const { name, EMAIL, SiteUrlToExport, Status } = req.body;

  await firstSheet.addRow({
    Name: name,
    Email: `=HYPERLINK("mailto:${EMAIL}","${EMAIL}")`,
    Website: SiteUrlToExport,
    ExportedAt: "=NOW()",
    Status: Status,
  });
};