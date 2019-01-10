
var fupl_fileIndex = 0;

$.fn.initUpload = function(params) {

    this.each(function() {
        $(this).on('dragenter', function(e) {
            e.stopPropagation();
            e.preventDefault();
            $(this).addClass('focus');
        });

        $(this).on('dragover', function(e) {
            e.stopPropagation();
            e.preventDefault();
        });

        $(this).on('dragleave', function(e) {
            e.stopPropagation();
            e.preventDefault();
            $(this).removeClass('focus');
        });

        $(this).on('drop', function(e) {
            e.stopPropagation();
            e.preventDefault();
            $(this).removeClass('focus');
            var files = e.originalEvent.target.files || e.originalEvent.dataTransfer.files;
            fupl_addFiles(files, params);
        });
    });

    $(document).on('change', params.button, function(e) {
        var files = params.button()[0].files;
        fupl_addFiles(files, params);
    });
};

function fupl_addFiles(files, params) {
    for(var index = 0, file; file = files[index]; index++) {
        params.index = fupl_fileIndex;
        params.file = file;
        fupl_startUpload(params);
        fupl_fileIndex++;
    }    
};

function fupl_checkMime(params) {
    if(params.mimetypes) {
        for(var i = 0; i < params.mimetypes.length; i++) {
            let mime = params.mimetypes[i].split("/");

            if(mime[1] === "*") {
                if(mime[0] === params.file.type.split("/")[0]) {
                    return true;
                }
            } else {
                if(params.mimetypes[i] === params.file.type) {
                    return true;
                }
            }
        }
        return false;
    } else {
        console.log("nincsmegadva");
        return true;
    }
};

function fupl_checkSize(params) {
    if((params.sizeMin) && (params.file.size < params.sizeMin)) return false;
    if((params.sizeMax) && (params.file.size > params.sizeMax)) return false;
    return true;
};

function fupl_startUpload(params) {

    var data = new FormData();
    data.append('file', params.file);
    data.append('index', params.index);

    if(params.postdata) {
        data.append('postdata', JSON.stringify(params.postdata()));
    }

    if(params.upload) {
        params.upload({
            index: params.index, 
            file: params.file
        });
    }

    if(!fupl_checkMime(params)) {
        if(params.error) {
            params.error({
                index: params.index, 
                response: {
                    responseText: "wrongmimetype"
                },
                status: status, 
                file: params.file
            });
        }
        return;
    }
        
    if(!fupl_checkSize(params)) {
        if(params.error) {
            params.error({
                index: params.index, 
                response: {
                    responseText: "wrongfilesize"
                },
                status: status, 
                file: params.file
            });
        }
        return;
    }

    var index = params.index;

    $.ajax({
        url: params.url,
        type: 'post',
        contentType: false,
        processData: false,
        dataType: 'json',
        data: data,
        xhr: function() {
            var xhrobj = $.ajaxSettings.xhr();
            if (xhrobj.upload) {
                xhrobj.upload.addEventListener('progress', function(e) {

                    var percent = 0;
                    var position = e.loaded || e.position;
                    var total = e.total;

                    if (e.lengthComputable) {
                        percent = Math.ceil(position / total * 100);
                    } 

                    if(params.uploading) {
                        params.uploading({
                            index: index, 
                            percent: percent, 
                            file: params.file
                        });
                    }

                }, false);
            }
            return xhrobj;
        },
        success: function(response, status) {
            if(params.success) {
                params.success({
                    index: index, 
                    response: response, 
                    status: status, 
                    file: params.file
                });
            }
        },
        error: function(response, status) {
            if(params.complete) {
                params.error({
                    index: index, 
                    response: response, 
                    status: status, 
                    file: params.file
                });
            }
        },
        complete: function(response, status) {
            if(params.complete) {
                params.complete({
                    index: index, 
                    response: response, 
                    status: status, 
                    file: params.file
                });
            }
        }
    });
};