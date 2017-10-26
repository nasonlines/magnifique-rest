'use strict';

/* CONFIG AREA */
var _DEFAULT_UPLOAD_BANDWIDTH_LIMIT_ = 1000000000

const fs      = require('fs');
var Throttle  = require('throttle');
var request   = require('request');
var events    = require('events');
var bandwidth_limit = new Throttle(_DEFAULT_UPLOAD_BANDWIDTH_LIMIT_);

class Rest {
    constructor(bandwidth_limit = _DEFAULT_UPLOAD_BANDWIDTH_LIMIT_){
      this.bandwidth_limit = new Throttle(bandwidth_limit);
    }

    GET(options) {
      var self = this
      request(options, function (error, response, body) {
        let globalResponse = {
          error:error,
          response:response,
          body:body
        }
        self.emit('finish', globalResponse);
      })
    }

    POST(options, body){
      var self = this
      var strStream = require('string-to-stream')

      strStream(body).pipe(this.bandwidth_limit).pipe(
        request.post(options, function (error, response, body){
          let globalResponse = {
            error:error,
            response:response,
            body:body
          }
          self.emit('finish', globalResponse);
        })
      )
    }
}

Rest.prototype.__proto__ = events.EventEmitter.prototype;
module.exports = Rest;
