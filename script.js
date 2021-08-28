dayjs.extend(window.dayjs_plugin_localizedFormat);
dayjs.extend(window.dayjs_plugin_relativeTime);

const FORMATTERS = {
	shortdatetime: {
		name: 'Short Date/Time',
		markdown: null,
		formatter: date => dayjs(date).format('LLL'),
	},
	longdatetime: {
		name: 'Long Date/Time',
		markdown: 'F',
		formatter: date => dayjs(date).format('LLLL'),
	},
	shorttime: {
		name: 'Short Time',
		markdown: 't',
		formatter: date => dayjs(date).format('LT'),
	},
	longtime: {
		name: 'Long Time',
		markdown: 'T',
		formatter: date => dayjs(date).format('LTS'),
	},
	shortdate: {
		name: 'Short Date',
		markdown: 'd',
		formatter: date => dayjs(date).format('L'),
	},
	longdate: {
		name: 'Long Date',
		markdown: 'D',
		formatter: date => dayjs(date).format('LL'),
	},
	relative: {
		name: 'Relative Time',
		markdown: 'R',
		formatter: date => dayjs(date).fromNow(),
	},
};

/**
 * @typedef {Object} Format
 * @property {string} name
 * @property {string} preview
 * @property {string} markdown
 */

/**
 * Get an object of format info from a date
 * @param {Date} date
 * @returns {Format[]}
 */
function getFormats(date) {
	const timestamp = Math.floor(date.getTime() / 1000);
	return Object.values(FORMATTERS).map(x => ({
		name: x.name,
		markdown: `<t:${timestamp}${x.markdown ? `:${x.markdown}` : ''}>`,
		preview: [x.formatter]
			.flat()
			.map(x => x(date))
			.join(' '),
	}));
}

const datepicker = document.getElementById('datepicker');
const output = document.getElementById('output');

function generate() {
	const date = getPickerDate();
	const formats = getFormats(date);

	output.innerHTML = '';
	formats.forEach((format, i) => {
		const row = document.createElement('tr');
		[format.name, format.preview, format.markdown].forEach(text => {
			const cell = document.createElement('td');
			cell.textContent = text;
			row.appendChild(cell);
		});
		const button = document.createElement('button');
		button.setAttribute('data-clipboard-text', format.markdown);
		button.innerText = 'Copy';
		new ClipboardJS(button);

		row.appendChild(button);

		output.appendChild(row);
	});
}

/**
 * Get date from datepicker
 * @returns {Date}
 */
function getPickerDate() {
	return new Date(datepicker.value || new Date());
}

/**
 * Set date in datepicker
 * @param {Date = now} date
 */
function setPickerDate(date = new Date()) {
	date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
	datepicker.value = date.toISOString().slice(0, 16);
}

datepicker.addEventListener('change', generate);
setPickerDate();
generate();
