import PDFDocument from "pdfkit";
import sharp from "sharp";
import fs from "fs";

export function createCertificateWithImage(name: string): void {
  sharp("static/images/certificate.png")
    .toBuffer()
    .then((buffer: Buffer) => {
      const doc = new PDFDocument();
      function removeSpaces(inputString: string) {
        return inputString.replace(/\s+/g, "");
      }
      let savename = removeSpaces(name);
      doc.pipe(
        fs.createWriteStream(`uploads/certificate/${savename}_certificate.pdf`)
      );

      doc.image(buffer, 0, 0, { width: 600, height: 400 });

      doc.fontSize(17).fillColor("black").text(`${name}`, 250, 195);

      doc.end();

      console.log(`${name}_certificate.pdf created successfully!`);
    })
    .catch((err: Error) => console.error("Error processing image:", err));
}

createCertificateWithImage("MUGISHA Pascal");
