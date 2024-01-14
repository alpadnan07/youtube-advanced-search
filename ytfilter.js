/* Additional constants */
const FILTER_BUTTON_ID = 'filter-button';

/* Global Variables */
var observer;
var elements_to_filter = new Set();
var setting_min_time = 0;
var setting_max_time = 0;
var setting_show_shorts = true;
var setting_show_channels = true;
var setting_show_playlists = true;
/* Main Function */
function main() {
	if (observer) {
		observer.disconnect();
	}
	elements_to_filter.clear();
	if (!window.location.toString().includes('results')) return
	console.log('begin injection')
	// Insert advanced search button
	waitForElementById(FILTER_BUTTON_ID, function () {
		var fbd = document.getElementById(FILTER_BUTTON_ID);
		fbd.insertAdjacentElement('afterend', extraFilterButton);
	});

	// Follow changes in the results, to filter out videos
	waitForElementsByQuerySelector('ytd-search', function () {
		ytd_search = document.querySelector('ytd-search')
		contents = ytd_search.querySelector('#contents')

		observer = new MutationObserver(function (mutations) {
			var videos = Array.from(contents.querySelectorAll('ytd-video-renderer'));
			var shorts = Array.from(contents.querySelectorAll('ytd-reel-shelf-renderer'));
			var channels = Array.from(contents.querySelectorAll('ytd-channel-renderer'));
			var playlists = Array.from(contents.querySelectorAll('ytd-playlist-renderer'));
			// if (videos.length <= num_videos && shorts.length <= num_shorts && channels.length <= num_channels) return;
			for (const video of videos) {
				elements_to_filter.add(video);
			}
			for (const short of shorts) {
				elements_to_filter.add(short);
			}
			for (const channel of channels) {
				elements_to_filter.add(channel);
			}
			for (const playlist of playlists) {
				elements_to_filter.add(playlist)
			}
			enforce_filters();
		});
		var config = { childList: true, subtree: true };
		observer.observe(contents, config);
	});
}

/* Event Listener for YouTube's dynamic navigation */
document.addEventListener('yt-navigate-start', function () {
	main();
});

/* Initial run for the first page load */
main();

/* Function to convert time to seconds */
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

/* Function to get video length */
function get_video_length(video_element) {
	if (video_element.querySelector('#time-status') === null) return true;
	var string_time = video_element.querySelector('#time-status').querySelector('#text').innerHTML;
	return convertTimeToSeconds(string_time);
}

/* Video filter function */
function video_filter(video_element) {
	var video_length = get_video_length(video_element);
	if (isNaN(video_length)) return setting_show_shorts;

	if (setting_max_time > 0) {
		return (setting_max_time > video_length) && (setting_min_time < video_length);
	}
	return setting_min_time < video_length;
}

/* Search filter function */
function search_filter(search_element) {
	if (search_element.tagName === "YTD-VIDEO-RENDERER") return video_filter(search_element);
	if (search_element.tagName === "YTD-REEL-SHELF-RENDERER") return setting_show_shorts;
	if (search_element.tagName === "YTD-CHANNEL-RENDERER") return setting_show_channels;
	if(search_element.tagName === "YTD-PLAYLIST-RENDERER") return setting_show_playlists;
}

/* Function to save time settings */
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
	enforce_filters();
}

/* Function to save shorts setting */
function saveShortsSetting() {
	setting_show_shorts = document.getElementById('showYoutubeShorts').checked;
	enforce_filters();
}

/* Function to save channels setting */
function saveShowChannelsSetting() {
	setting_show_channels = document.getElementById('showChannelRecommendations').checked;
	enforce_filters();
}
/* Function to save playlist setting */
function saveShowPlaylistsSetting() {
	setting_show_playlists = document.getElementById('showPlaylists').checked;
	enforce_filters();
}


function waitForElementById(selector, callback) {
	let previousUrl = window.location.href;
	let intervalId = setInterval(function () {
		if (document.getElementById(selector)) {
			clearInterval(intervalId);
			callback();
		} else if (window.location.href !== previousUrl) {
			// Clear interval if the URL changes
			clearInterval(intervalId);
		}
	}, 250);
}
function waitForElementsByQuerySelector(selector, callback) {
	let previousUrl = window.location.href;
	let intervalId = setInterval(function () {
		if (document.querySelector(selector)) {
			clearInterval(intervalId);
			callback();
		} else if (window.location.href !== previousUrl) {
			// Clear interval if the URL changes
			clearInterval(intervalId);
		}
	}, 250);
}


/* Function to enforce filters */
function enforce_filters() {
	for (let search_element of elements_to_filter) {
		if (!search_filter(search_element)) {
			search_element.style.display = 'none';
		}
		else {
			search_element.style.display = '';
		}
	}
}

/* Popup window setup */
var popup = document.createElement('div');
popup.id = 'myPopup';
popup.style.width = '50%';
popup.style.height = '60%';
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
    <div style="flex: 1; padding: 10px;">
        <h3>Show Channel Recommendations</h3>
        <div>
            <input type="checkbox" checked="true" id="showChannelRecommendations" name="showChannelRecommendations">
            <label for="showChannelRecommendations">Show</label>
        </div>
    </div>
    <div style="flex: 1; padding: 10px;">
        <h3>Show Playlists</h3>
        <div>
            <input type="checkbox" checked="true" id="showPlaylists" name="showPlaylists">
            <label for="showPlaylists">Show</label>
        </div>
    </div>

</div>
`;

document.body.appendChild(popup);

/* Click outside popup to close */
document.addEventListener('click', function handleClickOutside(event) {
	if (popup.style.display !== 'none' && !popup.contains(event.target)) {
		popup.style.display = 'none';
	}
}, true);

/* Event listeners for filter settings */
document.getElementById('button-filter-time-save').addEventListener('click', saveTimeSettings, true);
document.getElementById('showYoutubeShorts').addEventListener('change', saveShortsSetting);
document.getElementById('showChannelRecommendations').addEventListener('change', saveShowChannelsSetting);
document.getElementById('showPlaylists').addEventListener('change', saveShowPlaylistsSetting);

/* Advanced search filter button setup */
var extraFilterButton = document.createElement('button');
extraFilterButton.style.border = 'none';
extraFilterButton.style.padding = '6px 15px'; // Smaller padding
extraFilterButton.style.borderRadius = '15px'; // Adjusted for smaller size
extraFilterButton.style.fontFamily = 'Roboto, Arial, sans-serif';
extraFilterButton.style.fontSize = '12px'; // Smaller font size
extraFilterButton.style.cursor = 'pointer';
extraFilterButton.style.boxShadow = '0 2px 2px 0 rgba(0,0,0,0.24)';
extraFilterButton.style.margin = '5px 0';
extraFilterButton.style.display = 'inline-block';
extraFilterButton.style.lineHeight = 'normal';
extraFilterButton.style.transition = 'background-color 0.3s';

extraFilterButton.innerHTML = "Advanced Search Filters";
extraFilterButton.onclick = () => {
	popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
};



