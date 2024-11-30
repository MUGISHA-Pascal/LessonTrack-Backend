"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCertificateWithImage = createCertificateWithImage;
const pdfkit_1 = __importDefault(require("pdfkit"));
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
function createCertificateWithImage(name) {
    (0, sharp_1.default)("static/images/certificate.png")
        // .resize(600, 400)
        .toBuffer()
        .then((buffer) => {
        const doc = new pdfkit_1.default();
        doc.pipe(fs_1.default.createWriteStream(`${name}_certificate.pdf`));
        doc.image(buffer, 0, 0, { width: 600, height: 400 });
        doc.fontSize(17).fillColor("black").text(`${name}`, 250, 195);
        //   doc.fontSize(18).text("For completing the course successfully", 150, 280);
        //   doc.fontSize(16).text("Signed by: The Organization", 150, 310);
        doc.end();
        console.log(`${name}_certificate.pdf created successfully!`);
    })
        .catch((err) => console.error("Error processing image:", err));
}
createCertificateWithImage("pascal");
