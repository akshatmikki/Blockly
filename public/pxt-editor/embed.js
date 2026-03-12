(function() {
    if (window.ksRunnerInit) return;

    // This line gets patched up by the cloud
    var pxtConfig = {
    "relprefix": "/pxt-editor/",
    "verprefix": "",
    "workerjs": "/pxt-editor/worker.js",
    "monacoworkerjs": "/pxt-editor/monacoworker.js",
    "gifworkerjs": "/pxt-editor/gifjs/gif.worker.js",
    "serviceworkerjs": "/pxt-editor/serviceworker.js",
    "typeScriptWorkerJs": "/pxt-editor/tsworker.js",
    "pxtVersion": "12.2.8",
    "pxtRelId": "localDirRelId",
    "pxtCdnUrl": "/pxt-editor/",
    "commitCdnUrl": "/pxt-editor/",
    "blobCdnUrl": "/pxt-editor/",
    "cdnUrl": "/pxt-editor/",
    "targetVersion": "0.0.0",
    "targetRelId": "",
    "targetUrl": "",
    "targetId": "microbit",
    "simUrl": "/pxt-editor/simulator.html",
    "simserviceworkerUrl": "/pxt-editor/simulatorserviceworker.js",
    "simworkerconfigUrl": "/pxt-editor/workerConfig.js",
    "partsUrl": "/pxt-editor/siminstructions.html",
    "runUrl": "/pxt-editor/run.html",
    "docsUrl": "/pxt-editor/docs.html",
    "multiUrl": "/pxt-editor/multi.html",
    "asseteditorUrl": "/pxt-editor/asseteditor.html",
    "isStatic": true,
    "kioskUrl": "/pxt-editor/kiosk.html",
    "teachertoolUrl": "/pxt-editor/teachertool.html",
    "tutorialtoolUrl": "/pxt-editor/tutorialtool.html",
    "skillmapUrl": "/pxt-editor/skillmap.html",
    "multiplayerUrl": "/pxt-editor/multiplayer.html",
    "authcodeUrl": "/pxt-editor/authcode.html"
};

    var scripts = [
        "/pxt-editor/highlight.js/highlight.pack.js",
        "/pxt-editor/marked/marked.min.js",
    ]

    if (typeof jQuery == "undefined")
        scripts.unshift("/pxt-editor/jquery.js")
    if (typeof jQuery == "undefined" || !jQuery.prototype.sidebar)
        scripts.push("/pxt-editor/semantic.js")
    if (!window.pxtTargetBundle)
        scripts.push("/pxt-editor/target.js");
    scripts.push("/pxt-editor/pxtembed.js");

    var pxtCallbacks = []

    window.ksRunnerReady = function(f) {
        if (pxtCallbacks == null) f()
        else pxtCallbacks.push(f)
    }

    window.ksRunnerWhenLoaded = function() {
        pxt.docs.requireHighlightJs = function() { return hljs; }
        pxt.setupWebConfig(pxtConfig || window.pxtWebConfig)
        pxt.runner.setInitCallbacks(pxtCallbacks)
        pxtCallbacks.push(function() {
            pxtCallbacks = null
        })
        pxt.runner.init();
    }

    scripts.forEach(function(src) {
        var script = document.createElement('script');
        script.src = src;
        script.async = false;
        document.head.appendChild(script);
    })

} ())
