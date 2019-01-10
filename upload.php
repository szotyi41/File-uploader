<?php
	
	// Destination folder
	$uploads = 'uploads/' . $_FILES['file']['name'];

	if (move_uploaded_file($_FILES['file']['tmp_name'], $uploads)) {
		echo json_encode(["status" => "uploaded", "file" => $_FILES['file']]);
	} else {
		echo json_encode(["status" => "error"]);
	}

?>
