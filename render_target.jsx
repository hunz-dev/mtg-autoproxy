#include "scripts/jsx/render.jsx";
#include "settings.jsx";

file = app.openDialog();

// Render the selected image
if (file[0]) {
	
	// Are templates an array
	if ( specified_template === null ) render(file[0],specified_template);
	else if ( (specified_template[1] !== undefined) && specified_template[1] !== null ) {
		
		// Run through each template
		for (var z = 0; z < specified_template.length; z++) {
			render(file[0],specified_template[z]);
		}
	
	} else render(file[0],specified_template);

}
