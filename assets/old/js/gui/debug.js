const debug = (requestId, requestContent) => {
	// Debug function
	let requestFound = false;
	debugRequests.forEach(request => {
		if (request.id === requestId) {
			// The request is already registered, just change its content
			requestFound = true;
			request.content = requestContent;
		}
	});
	// This is a new debug request, add it to the request list
	if (!requestFound) {
		debugRequests.push({
			id: requestId,
			content: requestContent,
		})
	};

	// Print debug content on the debugger
	let debugContent = "";
	debugRequests.forEach(request => {
		debugContent += `<div><span>${request.content}</span></div>`;
	});
	debugElement.innerHTML = debugContent;
},
debugElement = document.querySelector("#debug"),
debugRequests = [];