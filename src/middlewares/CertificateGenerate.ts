import PDFDocument from "pdfkit";
import sharp from "sharp";
import fs from "fs";

export function createCertificateWithImage(name: string): void {
  sharp("static/images/certificate.png")
    // .resize(600, 400)
    .toBuffer()
    .then((buffer: Buffer) => {
      const doc = new PDFDocument();

      doc.pipe(fs.createWriteStream(`${name}_certificate.pdf`));

      doc.image(buffer, 0, 0, { width: 600, height: 400 });

      doc.fontSize(17).fillColor("black").text(`${name}`, 250, 195);

      //   doc.fontSize(18).text("For completing the course successfully", 150, 280);
      //   doc.fontSize(16).text("Signed by: The Organization", 150, 310);

      doc.end();

      console.log(`${name}_certificate.pdf created successfully!`);
    })
    .catch((err: Error) => console.error("Error processing image:", err));
}

createCertificateWithImage("pascal");
