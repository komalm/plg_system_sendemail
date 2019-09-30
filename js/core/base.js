'use strict';
/** global: com_jgive */
var sendEmailCount = 0;
var failEmailCount = 0;
tjSendEmail.Services.Base = Class.extend({
    /**
     * @param   string  url       API Request URL
     * @param   config  object    Configuration object
     * @param   cb      function  Callback function
     */
    get: function (url, config, cb) {
        config = config || {};
        config.headers = config.headers || {};
        if (typeof cb !== 'function') {
            throw "base expects callback to be function";
        }

        return jQuery.ajax({
            type: "GET",
            url: url,
            headers: config.headers,
            beforeSend: function () {
            },
            success: function (res) {
                cb(null, res);
            },
            error: function (err) {
                cb(err, null);
            }
        });
    },
    /**
     * @param   string  url       API Request URL
     * @param   data    object    Data to post
     * @param   config  object    Configuration object which have headers
     * @param   cb      function  Callback function
     */
    post: function (url, data, config, cb) {
        data = data || {};
        config = config || {};
        config.headers = config.headers || {};

        if (typeof cb !== 'function') {
            throw "base expects callback to be function";
        }

        return jQuery.ajax({
            type: "POST",
            url: url,
            data: data,
            dataType: 'json',
            headers: config.headers,
            beforeSend: function () {
            },
            success: function (res) {

				sendEmailCount = res.data.send + sendEmailCount;
				failEmailCount = res.data.fail + failEmailCount;

				res.data.send = sendEmailCount;
				res.data.fail = failEmailCount;

                cb(null, res);
            },
            error: function (err) {
                cb(err, null);
            }
        });
    },
    /**
     * @param   string  url       API Request URL
     * @param   config  object    Configuration object which have headers
     * @param   cb      function  Callback function
     */
    patch: function (url, data, config, cb) {
        data = data || {};
        config = config || {};
        config.headers = config.headers || {};

        if (typeof cb !== 'function') {
            throw "base expects callback to be function";
        }

        if (typeof data === 'object') {
            data = JSON.stringify(data);
        }
        return jQuery.ajax({
            type: "PATCH",
            url: url,
            data: data,
            headers: config.headers,
            beforeSend: function () {
            },
            success: function (res) {
                cb(null, res);
            },
            error: function (xhr) {
                cb(xhr, null);
            }
        });
    }
});
