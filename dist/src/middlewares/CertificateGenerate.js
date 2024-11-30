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
        .toBuffer()
        .then((buffer) => {
        const doc = new pdfkit_1.default();
        function removeSpaces(inputString) {
            return inputString.replace(/\s+/g, "");
        }
        let savename = removeSpaces(name);
        doc.pipe(fs_1.default.createWriteStream(`uploads/certificate/${savename}_certificate.pdf`));
        doc.image(buffer, 0, 0, { width: 600, height: 400 });
        doc.fontSize(17).fillColor("black").text(`${name}`, 250, 195);
        doc.end();
        console.log(`${name}_certificate.pdf created successfully!`);
    })
        .catch((err) => console.error("Error processing image:", err));
}
createCertificateWithImage("MUGISHA Pascal");
