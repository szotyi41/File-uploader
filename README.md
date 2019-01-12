# File-uploader
jQuery file uploader with dragndrop, and uploading status callback

Require jQuery

```javascript
$(".upload-container").initUpload({
	url: "upload.php",
	mimetypes: [
		"video/*",
		"image/jpeg"
	],
	sizeMax: 99999999999,
	sizeMin: 0,
	multiple: true,
	button: function() {
		return $(".upload-button");
	},
	postdata: function() {
		// Set sendable post data in this return, it will put into a json and you can get from json_decode($_POST['postdata'])
		return {
			user_token: "N342JK5B4J"
		}
	},
	upload: function(data) {
		// Template of uploading boxes (filedata, status, progressbar, remove button)
		$(".upload-files").append(
			"<div class='file' id='file-" + data.index + "'>" + 
			"Index: " + data.index + "<br>" +
			"Filename: " + data.file.name + "<br>" +
			"Filesize: " + bytesToSize(data.file.size) + "<br>" +
			"Filetype: " + data.file.type + "<br>" +
			"<span class='status'></span><br>" +
			"</div>"
		);
	}, 
	uploading: function(data) {
		// Update percent of uploading status
		$(".upload-files #file-" + data.index + " .status").html(data.percent + "%");
	}, 
	success: function(data) {
		// The file is uploaded
		$(".upload-files #file-" + data.index + " .status").html("Uploaded");
	}, 
	error: function(data) {
		// When you get error from the server, or validation error (wrong mimetype or wrong size)
		$(".upload-files #file-" + data.index + " .status").html("Error: " + data.response.responseText);
	},
	complete: function(data) {

	}
});
```
