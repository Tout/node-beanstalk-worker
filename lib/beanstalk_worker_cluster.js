var util = require('util'),
    async = require('async'),
    BeanstalkWorker = require('./beanstalk_worker').BeanstalkWorker;

var BeanstalkWorkerCluster = {

    workers: [],

    start: function(server, num_workers, handlers, tubes, ignore_default) {
        var i = 0,
            self = this;
        async.whilst(function () {
            return i < num_workers;
        }, function (asyncCallback) {
            var w = new BeanstalkWorker(i, server, handlers);
            self.workers.push(w);
            w.start(tubes, ignore_default);
            i++;
            asyncCallback();
        }, function (err) {
            if (err) {
                util.error(util.inspect(err));
            }
        });
    },

    stop: function() {
        async.forEach(this.workers, function (worker, asyncCallback) {
            worker.stop();
            asyncCallback();
        }, function (err) {
            if (err) {
                util.error(util.inspect(err));
            }
        });
    }

};

exports.BeanstalkWorkerCluster = BeanstalkWorkerCluster;


/* Todo

 - stagger the initialization so they don't all connect/timeout at the same time

*/
