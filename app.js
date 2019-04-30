const toggleStyle = document.createElement('style');
toggleStyle.type = 'text/css';
toggleStyle.innerHTML = `.view-toggle {
	width: 32px;
	height: 32px;
	margin-right: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 3px;
}
.view-toggle:hover {
	background-color: rgba(0,0,0,.06);
}
.view-toggle:active {
	border-color: #18a0fb;
	box-shadow: inset 0 0 0 2px #18a0fb;
	border-radius: 2px;
}
`;
document.head.appendChild(toggleStyle);

let listView = JSON.parse(localStorage.getItem('files-list-view'));
let foundSortButton = false;
let foundTileImage = false;

const injectViewToggle = () => {
	const sortButton = document.querySelector('div[class*="file_sort_filter--dropdownContainer--"]');
	sortButton.parentElement.style.alignItems = 'center';
	sortButton.style.marginRight = '12px';
	const listViewButton = document.createElement('div');
	listViewButton.id = 'list-view-button';
	listViewButton.className = 'view-toggle';
	listViewButton.innerHTML =
		'<svg class="svg" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M6 6h2v1H6V6zm0 10h2v1H6v-1zm0-5h2v1H6v-1zm4-5h8v1h-8V6zm0 10h8v1h-8v-1zm0-5h8v1h-8v-1z"></path></svg>';
	listViewButton.onclick = listViewOn;
	const gridViewButton = document.createElement('div');
	gridViewButton.id = 'grid-view-button';
	gridViewButton.className = 'view-toggle';
	gridViewButton.innerHTML =
		'<svg class="svg" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M10 7H7v3h3V7zM6 6v5h5V6H6zm11 1h-3v3h3V7zm-4-1v5h5V6h-5zm-3 8H7v3h3v-3zm-4-1v5h5v-5H6zm11 1h-3v3h3v-3zm-4-1v5h5v-5h-5z" fill-rule="evenodd" fill-opacity=".7"></path></svg>';
	gridViewButton.onclick = listViewOff;
	listView = JSON.parse(localStorage.getItem('files-list-view'));
	if (listView) listViewButton.style.display = 'none';
	else gridViewButton.style.display = 'none';
	figmaPlus.addTooltip({ element: listViewButton, text: 'Show as List' });
	figmaPlus.addTooltip({ element: gridViewButton, text: 'Show as Grid' });
	sortButton.parentElement.appendChild(listViewButton);
	sortButton.parentElement.appendChild(gridViewButton);
};

const listViewOn = () => {
	listView = localStorage.setItem('files-list-view', 'true');
	document.getElementById('file-list-view').disabled = false;
	document.getElementById('grid-view-button').style.display = '';
	document.getElementById('list-view-button').style.display = 'none';
};

const listViewOff = () => {
	listView = localStorage.setItem('files-list-view', 'false');
	document.getElementById('file-list-view').disabled = true;
	document.getElementById('list-view-button').style.display = '';
	document.getElementById('grid-view-button').style.display = 'none';
};

figmaPlus.onFileUnloaded(() => {
	foundSortButton = false;
});

figmaPlus.onFileBrowserChanged(() => {
	if (!document.getElementById('list-view-button')) injectViewToggle();
});

figmaPlus.onDomChanged(mutations => {
	if (!foundSortButton) {
		for (mutation of mutations) {
			if (!foundSortButton) {
				if (document.querySelector('div[class*="file_sort_filter--dropdownContainer--"]')) {
					foundSortButton = true;
					if (!document.getElementById('list-view-button')) injectViewToggle();
				}
			}
		}
	}
});

figmaPlus.onDomChanged(mutations => {
	for (mutation of mutations) {
		if (!foundTileImage) {
			if (
				document.querySelector('div[class*="file_tile--image"]') &&
				document.querySelector('div[class*="file_tile--container"]') &&
				document.querySelector('div[class*="file_tiles_view--fileTiles"]') &&
				document.querySelector('div[class*="face_pile--facePile"]')
			) {
				foundTileImage = true;
				const image = document.querySelector('div[class*="file_tile--image"]').className;
				const container = [...document.querySelector('div[class*="file_tile--container"]').classList].find(className =>
					className.includes('container')
				);
				const fileTiles = document.querySelector('div[class*="file_tiles_view--fileTiles"]').className;
				const lowerPart = [...document.querySelector('div[class*="file_tile--lowerPart--"]').classList].find(
					className => className.includes('lowerPart')
				);
				const lowerPartTitles = [...document.querySelector('div[class*="file_tile--lowerPartTitles"]').classList].find(
					className => className.includes('lowerPartTitles')
				);
				const title = [...document.querySelector('div[class*="file_tile--title"]').classList].find(className =>
					className.includes('--title--')
				);
				const subtitle = [...document.querySelector('div[class*="file_tile--subtitle"]').classList].find(className =>
					className.includes('--subtitle--')
				);
				const facePile = document.querySelector('div[class*="face_pile--facePile"]').className;
				const style = document.createElement('style');
				style.id = 'file-list-view';
				style.type = 'text/css';
				style.innerHTML = `
					.${image} {
						display: none;
					}
					.${container} {
						height: 44px;
						width: 100%;
						margin-bottom: 2px;
						flex-basis: unset;
					}
					.${fileTiles} {
						flex-flow: column;
						padding-right: 22px;
					}
					.${lowerPart} {
						height: 40px;
					}
					.${lowerPartTitles} {
						flex-direction: row;
						align-items: center;
						height: 40px;
						flex-grow: 7;
						flex-basis: 0;
					}
					.${title} {
						margin-top: 0px;
						flex-grow: 1;
						flex-basis: 0;
					}
					.${subtitle} {
						margin-top: 0px;
						margin-bottom: 0px;
						flex-grow: 1;
						flex-basis: 0;
					}
					.${facePile} {
						flex-grow: 1;
						flex-basis: 0;
					}
					`;
				document.head.appendChild(style);
				style.disabled = !listView;

				if (document.getElementById('f-ui')) {
					toggleStyle.innerHTML = `.view-toggle {
						width: 32px;
						height: 32px;
						margin-right: 16px;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 3px;
					}
					.view-toggle svg {
						fill: rgb(193, 197, 201);
					}
					.view-toggle:hover {
						background-color: rgba(255, 255, 255, 0.06);
					}
					.view-toggle:active {
						border-color: #18a0fb;
						box-shadow: inset 0 0 0 2px #18a0fb;
						border-radius: 2px;
					}
					`;
				}
			}
		}
	}
});
