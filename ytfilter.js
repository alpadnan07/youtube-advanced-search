/* Saved filter settings */
var minHours = 0
var minMinutes = 0
var minSeconds = 0

var maxHours = Infinity
var maxMinutes = Infinity;
var maxSeconds = Infinity;


/* DOM elements */


/* Options popup window */


var popup = document.createElement('div');
popup.id = 'myPopup';
popup.style.width = '50%'
popup.style.height = '60%'

popup.style.display = 'none';
popup.style.position = 'fixed'; // Use 'fixed' to position relative to the viewport
popup.style.left = '50%'; // Center horizontally
popup.style.top = '50%'; // Center vertically
popup.style.transform = 'translate(-50%, -50%)'; // Adjust for centering
popup.style.backgroundColor = 'white';
popup.style.border = '1px solid #ddd';
popup.style.padding = '13px';
popup.style.boxShadow = '0px 8px 16px 0px rgba(0,0,0,0.2)';
popup.style.fontSize = '15px';
popup.innerHTML = `
<div style="display: flex; justify-content: space-around;">
	<div style="flex: 1; padding: 10px;">
		<h3>Video Length Filter</h3>
		<div>
			<label>Minimum video length:</label><br>
			<input type="number" id="minHours" placeholder="Hours" min="0" style="width: 60px;">
			<input type="number" id="minMinutes" placeholder="Minutes" min="0" max="59" style="width: 60px;">
			<input type="number" id="minSeconds" placeholder="Seconds" min="0" max="59" style="width: 60px;">
		</div>
		<div>
			<label>Maximum video length:</label><br>
			<input type="number" id="maxHours" placeholder="Hours" min="0" style="width: 60px;">
			<input type="number" id="maxMinutes" placeholder="Minutes" min="0" max="59" style="width: 60px;">
			<input type="number" id="maxSeconds" placeholder="Seconds" min="0" max="59" style="width: 60px;">
		</div>
		<button id="button-filter-time-save" >Apply</button>
	</div>
	<div style="flex: 1; padding: 10px;">
		<h3>Title 2</h3>
		<ul>
			<li>Item 2.1</li>
			<li>Item 2.2</li>
			<li>Item 2.3</li>
		</ul>
	</div>
	<div style="flex: 1; padding: 10px;">
		<h3>Title 3</h3>
		<ul>
			<li>Item 3.1</li>
			<li>Item 3.2</li>
			<li>Item 3.3</li>
		</ul>
	</div>
</div>
`;
document.body.appendChild(popup);
/* Closes the popup bar if someone clicks outside it*/
function handleClickOutside(event) {
	if (popup.style.display !== 'none' && !popup.contains(event.target)) {
		popup.style.display = 'none';
	}
}
document.addEventListener('click', handleClickOutside, true)

function saveTimeSettings() {
	var minHoursEl = document.getElementById('minHours');
	var maxHoursEl = document.getElementById('maxHours');
	var minMinutesEl = document.getElementById('minMinutes');
	var maxMinutesEl = document.getElementById('maxMinutes');
	var minSecondsEl = document.getElementById('minSeconds');
	var maxSecondsEl = document.getElementById('maxSeconds');

	var minHours = minHoursEl ? parseInt(minHoursEl.value) : 0;
	var maxHours = maxHoursEl ? parseInt(maxHoursEl.value) : 0;
	var minMinutes = minMinutesEl ? parseInt(minMinutesEl.value) : 0;
	var maxMinutes = maxMinutesEl ? parseInt(maxMinutesEl.value) : 0;
	var minSeconds = minSecondsEl ? parseInt(minSecondsEl.value) : 0;
	var maxSeconds = maxSecondsEl ? parseInt(maxSecondsEl.value) : 0;

	console.log(`Saved filter time settings: Min - ${minHours}:${minMinutes}:${minSeconds}, Max - ${maxHours}:${maxMinutes}:${maxSeconds}`);
}

document.getElementById('button-filter-time-save').addEventListener('click',saveTimeSettings,true)


/* "Popup window open" button */
var extraFilterButton = document.createElement('button');
extraFilterButton.innerHTML = "Advanced Search Filters";
extraFilterButton.onclick = () => {
	if (popup.style.display === 'none') {
		popup.style.display = 'block';
	} else {
		popup.style.display = 'none';
	}
};


/* Query arguments */
const FILTER_POPUP_TAG = 'ytd-search-filter-options-dialog-renderer';
const FILTER_COLUMN_TAG = 'ytd-search-filter-group-renderer';
const FILTER_BUTTON_ID = 'filter-button';

/* Runs callback when an element with tag "tag" has been found */
function waitForElementsByTagName(tag, callback) {
	let x = setInterval(function () {
		if (document.getElementsByTagName(tag).length > 0) {
			callback();
			clearInterval(x);
		}
	}, 250)
}
/* Runs callback when an element with id "id" has been found */
function waitForElementById(selector, callback) {
	let x = setInterval(function () {
		if (document.getElementById(selector)) {
			callback();
			clearInterval(x);
		}
	}, 250)
}



console.log('loaded')

waitForElementById('filter-button', function () {
	var fbd = document.getElementById('filter-button');
	fbd.insertAdjacentElement('afterend', extraFilterButton)
	console.log('burada')
})

