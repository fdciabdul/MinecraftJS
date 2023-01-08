const
	stats = new Stats(),
	loopStats = () => {
		stats.begin();
		stats.end();
		requestAnimationFrame(loopStats);
	};

// Show stats panel
// 0 - fps
// 1 - ms
// 2 - mb
// 3+ - custom
stats.showPanel(0);

document.body.appendChild(stats.dom);

// Loop function
requestAnimationFrame(loopStats);