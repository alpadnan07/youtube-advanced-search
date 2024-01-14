/* Saved filter settings */
var setting_min_time = 0
var setting_max_time = 0
var setting_show_shorts = true
var setting_show_channels = true


function convertTimeToSeconds(timeString) {
	var parts = timeString.split(':').map(part => parseInt(part, 10));
	var seconds = 0;

	if (parts.length === 3) {
		// Format is h:m:s
		seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
	} else if (parts.length === 2) {
		// Format is m:s
		seconds = parts[0] * 60 + parts[1];
	} else if (parts.length === 1) {
		// Format is s
		seconds = parts[0];
	} else {
		throw new Error('Invalid time format');
	}

	return seconds;
}

function get_video_length(video_element) {
	// this probably means time is not yet loaded
	if (video_element.querySelector('#time-status') === null) return true
	string_time = video_element.querySelector('#time-status').querySelector('#text').innerHTML
	// console.log(string_time)
	console.log('get_video_length', string_time, convertTimeToSeconds(string_time))
	return convertTimeToSeconds(string_time)

}
function video_filter(video_element) {
	video_length = get_video_length(video_element)
	console.log('video_filter',video_length,setting_min_time)
	/* video is a short */
	if (isNaN(video_length)) return setting_show_shorts

	if (setting_max_time > 0) {
		return (setting_max_time > video_length) && (setting_min_time < video_length)
	}
	console.log('burada',setting_min_time < video_length,video_length,setting_min_time)
	return setting_min_time < video_length
}

/* Returns true iff search result should be shown */
function search_filter(search_element) {
	if (search_element.tagName === "YTD-VIDEO-RENDERER") return video_filter(search_element)
	if (search_element.tagName === "YTD-REEL-SHELF-RENDERER") return setting_show_shorts
	if (search_element.tagName === "YTD-CHANNEL-RENDERER") return setting_show_channels
	console.log('trying to filter ', search_element.tagName)
	return false;
}



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
        <h3>Show Youtube Shorts</h3>
        <div>
            <input type="checkbox" checked="true" id="showYoutubeShorts" name="showYoutubeShorts">
            <label for="showYoutubeShorts">Show</label>
        </div>
    </div>
    <!-- New column for Show Channel Recommendations -->
    <div style="flex: 1; padding: 10px;">
        <h3>Show Channel Recommendations</h3>
        <div>
            <input type="checkbox" checked="true" id="showChannelRecommendations" name="showChannelRecommendations">
            <label for="showChannelRecommendations">Show</label>
        </div>
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

// function saveTimeSettings() {
// 	var minHoursEl = document.getElementById('minHours');
// 	var maxHoursEl = document.getElementById('maxHours');
// 	var minMinutesEl = document.getElementById('minMinutes');
// 	var maxMinutesEl = document.getElementById('maxMinutes');
// 	var minSecondsEl = document.getElementById('minSeconds');
// 	var maxSecondsEl = document.getElementById('maxSeconds');

// 	var minHours = minHoursEl && (!isNaN(minHoursEl)) ? parseInt(minHoursEl.value) : 0;
// 	var maxHours = maxHoursEl && (!isNaN(maxHoursEl)) ? parseInt(maxHoursEl.value) : 0;
// 	var minMinutes = minMinutesEl && (!isNaN(minMinutesEl)) ? parseInt(minMinutesEl.value) : 0;
// 	var maxMinutes = maxMinutesEl && (!isNaN(maxMinutesEl)) ? parseInt(maxMinutesEl.value) : 0;
// 	var minSeconds = minSecondsEl && (!isNaN(minSecondsEl)) ? parseInt(minSecondsEl.value) : 0;
// 	var maxSeconds = maxSecondsEl && (!isNaN(maxSecondsEl)) ? parseInt(maxSecondsEl.value) : 0;
// 	setting_min_time = minHours * 3600 + minMinutes * 60 + minSeconds
// 	setting_max_time = maxHours * 3600 + maxMinutes * 60 + maxSeconds
// 	console.log(`min time: ${setting_min_time}, max time: ${setting_max_time}`)
// }
function saveTimeSettings() {
	var minHoursEl = document.getElementById('minHours');
	var maxHoursEl = document.getElementById('maxHours');
	var minMinutesEl = document.getElementById('minMinutes');
	var maxMinutesEl = document.getElementById('maxMinutes');
	var minSecondsEl = document.getElementById('minSeconds');
	var maxSecondsEl = document.getElementById('maxSeconds');

	var minHours = minHoursEl && !isNaN(parseInt(minHoursEl.value)) ? parseInt(minHoursEl.value) : 0;
	var maxHours = maxHoursEl && !isNaN(parseInt(maxHoursEl.value)) ? parseInt(maxHoursEl.value) : 0;
	var minMinutes = minMinutesEl && !isNaN(parseInt(minMinutesEl.value)) ? parseInt(minMinutesEl.value) : 0;
	var maxMinutes = maxMinutesEl && !isNaN(parseInt(maxMinutesEl.value)) ? parseInt(maxMinutesEl.value) : 0;
	var minSeconds = minSecondsEl && !isNaN(parseInt(minSecondsEl.value)) ? parseInt(minSecondsEl.value) : 0;
	var maxSeconds = maxSecondsEl && !isNaN(parseInt(maxSecondsEl.value)) ? parseInt(maxSecondsEl.value) : 0;

	setting_min_time = minHours * 3600 + minMinutes * 60 + minSeconds;
	setting_max_time = maxHours * 3600 + maxMinutes * 60 + maxSeconds;
	console.log(`min time: ${setting_min_time}, max time: ${setting_max_time}`);
	enforce_filters()

}

function saveShortsSetting() {
	setting_show_shorts = !setting_show_shorts;
	console.log('changed setting_show_shorts', setting_show_shorts)
	enforce_filters()

}
function saveShowChannelsSetting() {
	setting_show_channels = !setting_show_channels
	console.log('changed setting_show_channels', setting_show_channels)
	enforce_filters()

}

document.getElementById('button-filter-time-save').addEventListener('click', saveTimeSettings, true)
document.getElementById('showYoutubeShorts').addEventListener('change', saveShortsSetting);
document.getElementById('showChannelRecommendations').addEventListener('change', saveShowChannelsSetting);


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


/* Global arrays used as queues */
var elements_to_filter = new Set()


function enforce_filters() {
	for (search_element of elements_to_filter) {
		if (!search_filter(search_element)) {
			search_element.style.display = 'none'
			console.log('hiding element', setting_max_time, setting_min_time, get_video_length(search_element), setting_show_channels, setting_show_shorts, search_element.tagName)
		}
		else { search_element.style.display = '' }
	}
}


console.log('loaded')

/* Insert advanced search button */
waitForElementById(FILTER_BUTTON_ID, function () {
	var fbd = document.getElementById(FILTER_BUTTON_ID);
	fbd.insertAdjacentElement('afterend', extraFilterButton)
})



/* Follow changes in the results, to filter out videos */
var num_videos = 0
var num_shorts = 0
var num_channels = 0
waitForElementById('contents', function () {
	var contents = document.querySelector('#contents')
	var observer = new MutationObserver(function (mutations) {
		videos = Array.from(contents.querySelectorAll('ytd-video-renderer'))
		shorts = Array.from(contents.querySelectorAll('ytd-reel-shelf-renderer'))
		channels = Array.from(contents.querySelectorAll('ytd-channel-renderer'))
		/* Return if no new content have been added to search results */
		if (videos.length <= num_videos && shorts.length <= shorts && channels.length <= num_channels) return
		for (const video of videos) {
			elements_to_filter.add(video)
		}
		for (const short of shorts) {
			elements_to_filter.add(short)
		}
		for (const channel of channels) {
			elements_to_filter.add(channel)
		}
		/* Enforce filters every time something has changed */
		enforce_filters()

	});
	var config = { childList: true, subtree: true }
	observer.observe(contents, config);
});

