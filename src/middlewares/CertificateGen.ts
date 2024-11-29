import PDFDocument from "pdfkit";
import * as fs from "fs";

const doc = new PDFDocument({
  layout: "landscape",
  size: "A4",
});

doc.pipe(fs.createWriteStream("uploads/certificate/certificate.pdf"));

doc.rect(0, 0, doc.page.width, doc.page.height).fill("#fff");

const distanceMargin = 18;

doc
  .fillAndStroke("#0e8cc3")
  .lineWidth(20)
  .lineJoin("round")
  .rect(
    distanceMargin,
    distanceMargin,
    doc.page.width - distanceMargin * 2,
    doc.page.height - distanceMargin * 2
  )
  .stroke();

function jumpLine(doc: any, lines: number) {
  for (let index = 0; index < lines; index++) {
    doc.moveDown();
  }
}

doc
  .font("static/NotoSansJP-Light.ttf")
  .fontSize(10)
  .fill("#021c27")
  .text("Super Course for Awesomes", {
    align: "center",
  });

const lineSize = 174;
const signatureHeight = 390;
doc.lineWidth(1).fillAndStroke("#021c27").strokeOpacity(0.2);

const startLine1 = 128;
const endLine1 = startLine1 + lineSize;

doc
  .moveTo(startLine1, signatureHeight)
  .lineTo(endLine1, signatureHeight)
  .stroke();

doc
  .font("static/NotoSansJP-Bold.ttf")
  .fontSize(10)
  .fill("#021c27")
  .text("John Doe", startLine1, signatureHeight + 10, {
    columns: 1,
    columnGap: 0,
    height: 40,
    width: lineSize,
    align: "center",
  });

doc
  .font("static/NotoSansJP-Light.ttf")
  .fontSize(10)
  .fill("#021c27")
  .text("Associate Professor", startLine1, signatureHeight + 25, {
    columns: 1,
    columnGap: 0,
    height: 40,
    width: lineSize,
    align: "center",
  });

const link = "http://www.validate-your-certificate.hello/validation-code-here";
doc.fontSize(10);

const linkWidth = doc.widthOfString(link);
const linkHeight = doc.currentLineHeight();

doc
  .underline(doc.page.width / 2 - linkWidth / 2, 450, linkWidth, linkHeight)
  .link(doc.page.width / 2 - linkWidth / 2, 450, linkWidth, linkHeight, link);

doc
  .fontSize(10)
  .fill("#021c27")
  .text(link, doc.page.width / 2 - linkWidth / 2, 448, {
    width: linkWidth,
    height: linkHeight,
    align: "center",
  });

doc.end();
