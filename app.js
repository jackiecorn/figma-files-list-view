let listView = JSON.parse(localStorage.getItem('files-list-view'));
let foundSortButton = false;
const style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
.file_tile__REFRESH--image--2LN1i {
	display: none;
}

.file_tile__REFRESH--container--3sv1J {
	height: 44px;
	width: 100%;
	margin-bottom: 2px;
	flex-basis: unset;
}

.file_tiles_view__REFRESH--fileTiles--2s79s {
	flex-flow: column;
	padding-right: 22px;
}

.file_tile__REFRESH--lowerPart--3oefg {
	height: 40px;
}

.file_tile__REFRESH--lowerPartTitles--1BN4q {
	flex-direction: row;
	align-items: center;
	height: 40px;
	flex-grow: 7;
	flex-basis: 0;
}

.file_tile__REFRESH--title--3_Joz {
	margin-top: 0px;
	flex-grow: 1;
	flex-basis: 0;
}

.file_tile__REFRESH--subtitle--2Ddvq {
	margin-top: 0px;
	margin-bottom: 0px;
	flex-grow: 1;
	flex-basis: 0;
}

.face_pile--facePile--p96xt  {
	flex-grow: 1;
	flex-basis: 0;
}
`;
document.head.appendChild(style);
style.disabled = !listView;

const injectViewToggle = () => {
	const sortButton = document.querySelector('div[class*="file_sort_filter__REFRESH--dropdownContainer--"]');
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
	figmaPlus.addTooltip(listViewButton, 'Show as List', true);
	figmaPlus.addTooltip(gridViewButton, 'Show as Grid', true);
	sortButton.parentElement.appendChild(listViewButton);
	sortButton.parentElement.appendChild(gridViewButton);
};

const listViewOn = () => {
	listView = localStorage.setItem('files-list-view', 'true');
	style.disabled = false;
	document.getElementById('grid-view-button').style.display = '';
	document.getElementById('list-view-button').style.display = 'none';
};

const listViewOff = () => {
	listView = localStorage.setItem('files-list-view', 'false');
	style.disabled = true;
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
				if (document.querySelector('div[class*="file_sort_filter__REFRESH--dropdownContainer--"]')) {
					foundSortButton = true;
					if (!document.getElementById('list-view-button')) injectViewToggle();
				}
			}
		}
	}
});
