import {App, Modal} from 'obsidian';

export class DatePickerModal extends Modal {
	private onSubmit: (date: Date) => void;

	constructor(app: App, onSubmit: (date: Date) => void) {
		super(app);
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const {contentEl} = this;

		contentEl.createEl("h2", {text: "Select date"});
		contentEl.createEl("p", {text: "Choose a month and day to see what happened on that date throughout history."});

		// Container for dropdowns
		const selectContainer = contentEl.createDiv();
		selectContainer.style.display = "flex";
		selectContainer.style.gap = "0.5em";
		selectContainer.style.marginBottom = "1em";

		// Month dropdown
		const monthSelect = selectContainer.createEl("select");
		monthSelect.style.flex = "2";
		const months = [
			"January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"
		];
		months.forEach((month, index) => {
			const option = monthSelect.createEl("option", {text: month});
			option.value = String(index);
		});

		// Set to current month
		const now = new Date();
		monthSelect.value = String(now.getMonth());

		// Day dropdown
		const daySelect = selectContainer.createEl("select");
		daySelect.style.flex = "1";

		// Helper to get days in month
		const getDaysInMonth = (month: number): number => {
			// Use 2024 (leap year) to get max days for February
			return new Date(2024, month + 1, 0).getDate();
		};

		// Helper to populate day dropdown
		const populateDays = (month: number) => {
			const daysInMonth = getDaysInMonth(month);
			const currentDay = parseInt(daySelect.value) || now.getDate();

			daySelect.empty();
			for (let day = 1; day <= daysInMonth; day++) {
				const option = daySelect.createEl("option", {text: String(day)});
				option.value = String(day);
			}

			// Set to current day or max day if current exceeds month's days
			daySelect.value = String(Math.min(currentDay, daysInMonth));
		};

		// Initialize days and update on month change
		populateDays(parseInt(monthSelect.value));
		monthSelect.addEventListener("change", () => {
			populateDays(parseInt(monthSelect.value));
		});

		// Buttons
		const buttonContainer = contentEl.createDiv();
		buttonContainer.style.display = "flex";
		buttonContainer.style.gap = "0.5em";
		buttonContainer.style.justifyContent = "flex-end";

		const insertBtn = buttonContainer.createEl("button", {text: "Insert"});
		insertBtn.addClass("mod-cta");

		const cancelBtn = buttonContainer.createEl("button", {text: "Cancel"});

		insertBtn.addEventListener("click", () => {
			// Create a date object with selected month/day (year doesn't matter)
			const month = parseInt(monthSelect.value);
			const day = parseInt(daySelect.value);
			const date = new Date(2024, month, day); // Use any year as placeholder
			this.close();
			this.onSubmit(date);
		});

		cancelBtn.addEventListener("click", () => this.close());

		// Enter key submits
		daySelect.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				insertBtn.click();
			}
		});

		// Auto-focus the month select
		monthSelect.focus();
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}
