"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BridgeDeviceStatus = exports.BridgeDeviceType = exports.WeighingMediaType = exports.WeighingSource = void 0;
var WeighingSource;
(function (WeighingSource) {
    WeighingSource["AUTOMATIC"] = "AUTOMATIC";
    WeighingSource["MANUAL"] = "MANUAL";
})(WeighingSource || (exports.WeighingSource = WeighingSource = {}));
var WeighingMediaType;
(function (WeighingMediaType) {
    WeighingMediaType["ENTRY_PHOTO"] = "ENTRY_PHOTO";
    WeighingMediaType["EXIT_PHOTO"] = "EXIT_PHOTO";
    WeighingMediaType["VIDEO_CLIP"] = "VIDEO_CLIP";
    WeighingMediaType["MANUAL_UPLOAD"] = "MANUAL_UPLOAD";
})(WeighingMediaType || (exports.WeighingMediaType = WeighingMediaType = {}));
var BridgeDeviceType;
(function (BridgeDeviceType) {
    BridgeDeviceType["BRIDGE"] = "BRIDGE";
    BridgeDeviceType["SCALE"] = "SCALE";
    BridgeDeviceType["RFID_READER"] = "RFID_READER";
    BridgeDeviceType["CAMERA"] = "CAMERA";
})(BridgeDeviceType || (exports.BridgeDeviceType = BridgeDeviceType = {}));
var BridgeDeviceStatus;
(function (BridgeDeviceStatus) {
    BridgeDeviceStatus["ONLINE"] = "ONLINE";
    BridgeDeviceStatus["OFFLINE"] = "OFFLINE";
    BridgeDeviceStatus["ERROR"] = "ERROR";
})(BridgeDeviceStatus || (exports.BridgeDeviceStatus = BridgeDeviceStatus = {}));
//# sourceMappingURL=weighing-source.enum.js.map