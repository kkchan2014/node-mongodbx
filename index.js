/*---------------------------------------------------------------------------------------------
 *  Copyright (c) kkChan(694643393@qq.com). All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict'

require('node-type-extensions');

const extend = require('extend');
const mongoose = require('mongoose');

class mongodbx {
    constructor(url) {
        this.schemas = {};
        this.ObjectId = mongoose.Types.ObjectId;

        mongoose.set('useNewUrlParser', true)
        mongoose.set('useFindAndModify', false)
        mongoose.set('useCreateIndex', true)
        mongoose.connect(url, {
            config: {
                autoIndex: false
            }
        });

        mongoose.connection.on('connected', function () {
            console.log('数据库连接成功');
        });
        mongoose.connection.on('error', function (err) {
            console.log('数据库连接失败');
            console.log(err.stack);
        });
        mongoose.connection.on('disconnected', function () {
            console.log('数据库连接已断开');
        });
    }

    disconnect() {
        mongoose.disconnect();
    }

    model(name, model) {
        var obj = null;

        if (typeof name === 'string' && model) {
            obj = {};
            obj[name] = model;
        } else if (Object.isObject(name)) {
            obj = name;
        }

        if (obj) {
            Object.extract(obj, (k, v) => {
                this.schemas[k] = new mongoose.Schema(v);
                this[k] = mongoose.model(k, this.schemas[k]);
            });
        }
    }

    func(name, n, fn) {
        if (typeof n === 'string' && typeof fn === 'function') {
            var newObj = {};
            newObj[n] = fn;
            n = newObj;
        }

        if (Object.isObject(n)) {
            switch (name) {
                case '$all':
                    Object.extract(this.schemas, (k, v) => extend(v.statics, n));
                    break;
                default:
                    this.schemas[name] && extend(this.schemas[name].statics, n);
                    break;
            }
        }
    }
}

mongodbx.Types = {
    ObjectId: {
        type: mongoose.Types.ObjectId
    },
    Number: {
        type: Number,
        default: 0
    },
    String: {
        type: String,
        default: ''
    },
    Date: {
        type: Date,
        default: null
    },
    DateAndDefault: {
        type: Date,
        default: new Date
    },
    Boolean: {
        type: Boolean,
        default: false
    }
};

module.exports = mongodbx;