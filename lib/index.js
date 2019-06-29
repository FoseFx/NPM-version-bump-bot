"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var NAME = "version-bump-bot[bot]";
var PATH = "package.json";
module.exports = function (app) {
    app.on('push', function (context) { return __awaiter(_this, void 0, void 0, function () {
        var config, branch, bump, file_data, sha, content_base, content, version_match, version, major, minor, patch, new_version, new_content, new_content_base, obj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (context.payload.pusher.name === NAME) {
                        return [2 /*return*/];
                    }
                    ;
                    return [4 /*yield*/, context.config('config.yml', {
                            "version-bump-bot": {
                                branch: [{ "master": null, "bump": "patch" }]
                            }
                        })];
                case 1:
                    config = _a.sent();
                    branch = context.payload.ref.split("/")[2];
                    bump = "none";
                    config["version-bump-bot"].branch.forEach(function (obj) {
                        if (obj[branch] === null && typeof obj[branch] !== "undefined") {
                            bump = obj.bump;
                            return;
                        }
                    });
                    if (bump === "none" || (bump !== "major" && bump !== "minor" && bump !== "patch")) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, context.github.repos.getContents({
                            owner: context.repo().owner,
                            repo: context.repo().repo,
                            path: PATH,
                            ref: context.payload.ref
                        })];
                case 2:
                    file_data = _a.sent();
                    sha = file_data.data.sha;
                    content_base = file_data.data.content;
                    content = Buffer.from(content_base, 'base64').toString('utf-8');
                    version_match = content.match(/"version": "(\d+\.\d+\.\d+)",/);
                    if (version_match === null) {
                        return [2 /*return*/];
                    }
                    version = version_match[1].split(".");
                    major = +version[0];
                    minor = +version[1];
                    patch = +version[2];
                    if (bump === "major") {
                        major++;
                        minor = 0;
                        patch = 0;
                    }
                    else if (bump === "minor") {
                        minor++;
                        patch = 0;
                    }
                    else {
                        patch++;
                    }
                    new_version = major + "." + minor + "." + patch;
                    new_content = content.replace(/"version": "(\d+\.\d+\.\d+)",/, "\"version\": \"" + new_version + "\",");
                    new_content_base = Buffer.from(new_content).toString('base64');
                    obj = {
                        message: "[skip travis] Bumped Version to " + new_version,
                        committer: { name: 'Version Bumb Bot', email: 'vbb@fosefx.com' },
                        repo: context.repo().repo,
                        content: new_content_base,
                        path: PATH,
                        sha: sha,
                        owner: context.repo().owner
                    };
                    return [4 /*yield*/, context.github.repos.updateFile(obj)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    // For more information on building apps:
    // https://probot.github.io/docs/
    // To get your app running against GitHub, see:
    // https://probot.github.io/docs/development/
};
//# sourceMappingURL=index.js.map