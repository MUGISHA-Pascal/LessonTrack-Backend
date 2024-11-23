"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs = __importStar(require("fs"));
const doc = new pdfkit_1.default({
    layout: "landscape",
    size: "A4",
});
doc.pipe(fs.createWriteStream("src/uploads/certificate/output.pdf"));
doc.rect(0, 0, doc.page.width, doc.page.height).fill("#fff");
const distanceMargin = 18;
doc
    .fillAndStroke("#0e8cc3")
    .lineWidth(20)
    .lineJoin("round")
    .rect(distanceMargin, distanceMargin, doc.page.width - distanceMargin * 2, doc.page.height - distanceMargin * 2)
    .stroke();
function jumpLine(doc, lines) {
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
