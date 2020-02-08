var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import React, { createContext, useContext, useState, useMemo } from 'react';
function isGenerator(obj) {
    return obj && typeof obj.next === 'function' && typeof obj.throw === 'function' && typeof obj.return === 'function';
}
var extract = function (obj, ignores) {
    if (ignores === void 0) { ignores = IGNORES; }
    var t = obj;
    var set = new Set();
    while (t) {
        Object.getOwnPropertyNames(t)
            .filter(function (n) { return !ignores.includes(n); })
            .forEach(function (n) { return set.add(n); });
        t = Object.getPrototypeOf(t);
    }
    return Array.from(set);
};
var IGNORES = extract({}, []);
var useRerender = function () {
    var _a = useState(0), _ = _a[0], set = _a[1];
    return { rerender: function () { return set(function (c) { return c + 1; }); } };
};
var Queue = /** @class */ (function () {
    function Queue() {
        this.q = [];
    }
    Queue.prototype.push = function (task) {
        var free = !this.q.length;
        this.q.push(task);
        if (free)
            this.awake();
    };
    Queue.prototype.awake = function () {
        var _this = this;
        var next = this.q[0];
        if (next) {
            next().finally(function () {
                _this.q.shift();
                _this.awake();
            });
        }
    };
    return Queue;
}());
export function createStore(value, onStateChanged, actions) {
    var _this = this;
    var state = value;
    var queue = new Queue();
    var feed = function (newState) {
        if (newState !== null && newState !== undefined) {
            state = __assign({}, newState);
            onStateChanged(state);
        }
    };
    var convertAction = function (action) { return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var task = function () { return __awaiter(_this, void 0, void 0, function () {
            var actionResult, result, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, action.bind(actions).apply(void 0, __spreadArrays([state], args))];
                    case 1:
                        actionResult = _b.sent();
                        if (!isGenerator(actionResult)) {
                            feed(actionResult);
                            return [2 /*return*/];
                        }
                        _b.label = 2;
                    case 2:
                        if (!true) return [3 /*break*/, 5];
                        return [4 /*yield*/, actionResult.next(state)];
                    case 3:
                        result = _b.sent();
                        _a = feed;
                        return [4 /*yield*/, result.value];
                    case 4:
                        _a.apply(void 0, [_b.sent()]);
                        if (result.done)
                            return [3 /*break*/, 5];
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        return new Promise(function (resolve, reject) {
            queue.push(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, task()
                                .then(resolve)
                                .catch(reject)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    }; };
    var convert = function () {
        var external = {};
        extract(actions).forEach(function (name) { return (external[name] = convertAction(actions[name])); });
        return external;
    };
    var externalActions = convert();
    return function () { return ({ state: state, actions: externalActions }); };
}
export function createTinyContext(internalActions) {
    var Context = createContext({});
    var Provider = function (_a) {
        var value = _a.value, children = _a.children;
        var rerender = useRerender().rerender;
        var _b = useMemo(function () { return createStore(value, rerender, internalActions); }, [])(), state = _b.state, actions = _b.actions;
        return useMemo(function () {
            return React.createElement(Context.Provider, { value: { state: state, actions: actions } }, children);
        }, [state]);
    };
    return { Provider: Provider, useContext: function () { return useContext(Context); } };
}
