"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultilingualPipe = void 0;
var core_1 = require("@angular/core");
var MultilingualPipe = /** @class */ (function () {
    function MultilingualPipe() {
    }
    MultilingualPipe.prototype.transform = function (value, items) {
        if (!items || items.length < 1)
            return "";
        if (!value)
            return "";
        var filterredData = items.find(function (k) { return k.labelId == value; });
        return !filterredData ? '' : filterredData.translatedText;
    };
    MultilingualPipe = __decorate([
        core_1.Pipe({
            name: 'multilingualPipe',
        })
    ], MultilingualPipe);
    return MultilingualPipe;
}());
exports.MultilingualPipe = MultilingualPipe;
//# sourceMappingURL=multilingual.pipe.js.map