// storage controller
const StorageCtrl = (function () {
	// public methods
	return {
		storeDate: function (date) {
			localStorage.setItem('date', date);
		},
		getDateFromStorage: function () {
			return localStorage.getItem('date');
		},
		storeItem: function (item) {
			let items = localStorage.getItem('items');
			// check if items in LS
			if (items === null) {
				items = [];
				items.push(item);
				// set LS
				localStorage.setItem('items', JSON.stringify(items));
			} else {
				items = JSON.parse(items);
				items.push(item);
				// set LS
				localStorage.setItem('items', JSON.stringify(items));
			}
		},
		getItemsFromStorage: function () {
			let items = JSON.parse(localStorage.getItem('items'));
			// check if items in LS
			if (items === null) {
				items = [];
			}

			return items;
		},
		updateItemStorage: function (updatedItem) {
			let items = JSON.parse(localStorage.getItem('items'));
			items.forEach(function (item, index) {
				if (updatedItem.id === item.id) {
					items.splice(index, 1, updatedItem);
				}
			});

			// set LS
			localStorage.setItem('items', JSON.stringify(items));
		},
		deleteItemFromStorage: function (id) {
			let items = JSON.parse(localStorage.getItem('items'));
			items.forEach(function (item, index) {
				if (id === item.id) {
					items.splice(index, 1);
				}
			});
			// set LS
			localStorage.setItem('items', JSON.stringify(items));
		},
		clearItemsFromStorage: function () {
			localStorage.removeItem('items');
		},
	};
})();

// item controller
const ItemCtrl = (function () {
	// item constructor
	const Item = function (id, name, calories) {
		this.id = id;
		this.name = name;
		this.calories = calories;
	};

	// data structure /state
	// items: [
	// 	// { id: 0, name: 'biryani', calories: 1000 },
	// 	// { id: 1, name: 'daal roti', calories: 800 },
	// 	// { id: 2, name: 'chips', calories: 200 },
	// ],
	const data = {
		items: StorageCtrl.getItemsFromStorage(),
		currentItem: null,
		totalCalories: 0,
		date: StorageCtrl.getDateFromStorage(),
	};

	// public methods
	return {
		getItems: function () {
			return data.items;
		},
		addItem: function (name, calories) {
			let id;
			// create id
			if (data.items.length > 0) {
				id = data.items[data.items.length - 1].id + 1;
			} else {
				id = 0;
			}

			// create item
			newItem = new Item(id, name, parseInt(calories));

			data.items.push(newItem);

			return newItem;
		},
		logData: function () {
			return data;
		},
		totalCalories: function () {
			let total = 0;
			for (item of data.items) {
				total += item.calories;
			}
			data.totalCalories = total;
			return data.totalCalories;
		},
		getItemById: function (id) {
			let found = null;

			// loop through items
			for (item of data.items) {
				if (item.id === id) {
					found = item;
					break;
				}
			}

			return found;
		},
		setCurrentItem: function (item) {
			data.currentItem = item;
		},
		getCurrentItem: function () {
			return data.currentItem;
		},
		getDate: function () {
			return data.date;
		},
		setDate: function (date) {
			data.date = date;
		},
		updateItem: function (name, calories) {
			// calories to num
			calories = parseInt(calories);

			let found = null;

			// loop through items
			for (item of data.items) {
				if (item.id === data.currentItem.id) {
					item.name = name;
					item.calories = calories;
					found = item;
					break;
				}
			}

			return found;
		},
		deleteItem: function (id) {
			// get ids
			const ids = data.items.map(function (item) {
				return item.id;
			});

			// get index
			const index = ids.indexOf(id);

			// remove
			data.items.splice(index, 1);
		},
		clearAllItems: function () {
			data.items = [];
		},
	};
})();

// ui controller
const UICtrl = (function () {
	const UISelectors = {
		itemList: '#item-list',
		addBtn: '.add-btn',
		updateBtn: '.update-btn',
		deleteBtn: '.delete-btn',
		backBtn: '.back-btn',
		clearBtn: '.clear-btn',
		itemNameInput: '#item-name',
		itemCaloriesInput: '#item-calories',
		brand: '.brand-logo',
		nav: '.nav-wrapper',
		alert: '.alert',
		totalCalories: '.total-calories',
		date: '.date',
		cardTitle: '.card-title',
		listItems: '.collection-item',
	};

	let editState = false;

	const clearAlert = function () {
		const currentAlert = document.querySelector(UISelectors.alert);

		if (currentAlert) {
			const cardTitle = document.querySelector(UISelectors.cardTitle);
			const nav = document.querySelector(UISelectors.nav);
			cardTitle.textContent = 'Add Meal';
			nav.className = 'nav-wrapper b-transition black';
		}
	};

	return {
		populateItemList: function (items) {
			let html = '';
			items.forEach(function (item) {
				html += `<li class="collection-item" id="item-${item.id}">
				<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
				<a href="#" class="secondary-content">
					<i class="edit-item tiny material-icons">edit</i>
				</a>
			</li>`;
			});

			// insert list items
			document.querySelector(UISelectors.itemList).innerHTML = html;
		},
		getSelectors: function () {
			return UISelectors;
		},
		getItemInput: function () {
			return {
				name: document.querySelector(UISelectors.itemNameInput).value,
				calories: document.querySelector(UISelectors.itemCaloriesInput).value,
			};
		},
		showAlert: function (message) {
			// // clear previous alert
			clearAlert();

			const cardTitle = document.querySelector(UISelectors.cardTitle);
			const nav = document.querySelector(UISelectors.nav);
			cardTitle.textContent = message;
			nav.className = 'nav-wrapper alert';

			// time out after 2 seconds
			setTimeout(() => {
				clearAlert();
			}, 2000);
		},
		addListItem: function (item) {
			// show list
			document.querySelector(UISelectors.itemList).style.display = 'block';
			// create li
			const li = document.createElement('li');
			li.className = 'collection-item';
			li.id = `item-${item.id}`;
			li.innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
			<a href="#" class="secondary-content">
				<i class="edit-item tiny material-icons">edit</i>
			</a>`;
			// inset item
			document
				.querySelector(UISelectors.itemList)
				.insertAdjacentElement('beforeend', li);
		},
		clearInput: function () {
			document.querySelector(UISelectors.itemNameInput).value = '';
			document.querySelector(UISelectors.itemCaloriesInput).value = '';
		},
		hideList: function () {
			document.querySelector(UISelectors.itemList).style.display = 'none';
		},
		showTotalCalories: function (totalCalories) {
			document.querySelector(
				UISelectors.totalCalories
			).textContent = totalCalories;
		},
		clearEditState: function () {
			editState = false;
			UICtrl.clearInput();
			document.querySelector(UISelectors.updateBtn).style.display = 'none';
			document.querySelector(UISelectors.deleteBtn).style.display = 'none';
			document.querySelector(UISelectors.backBtn).style.display = 'none';
			document.querySelector(UISelectors.addBtn).style.display = 'inline';
		},
		addItemToForm: function () {
			const currentItem = ItemCtrl.getCurrentItem();
			document.querySelector(UISelectors.itemNameInput).value =
				currentItem.name;
			document.querySelector(UISelectors.itemCaloriesInput).value =
				currentItem.calories;
			UICtrl.showEditState();
		},
		showEditState: function () {
			editState = true;
			document.querySelector(UISelectors.updateBtn).style.display = 'inline';
			document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
			document.querySelector(UISelectors.backBtn).style.display = 'inline';
			document.querySelector(UISelectors.addBtn).style.display = 'none';
		},
		showDate: function (date) {
			document.querySelector(UISelectors.date).textContent = date;
		},
		getEditState: function () {
			return editState;
		},
		updateListItem: function (item) {
			let listItems = document.querySelectorAll(UISelectors.listItems);

			// convert nodeList to array
			listItems = Array.from(listItems);

			for (x of listItems) {
				if (`item-${item.id}` === x.getAttribute('id')) {
					document.querySelector(
						`#item-${item.id}`
					).innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
					<a href="#" class="secondary-content">
						<i class="edit-item tiny material-icons">edit</i>
					</a>`;
					break;
				}
			}
		},
		deleteListItem: function (id) {
			console.log(`item-${id}`);
			document.querySelector(`#item-${id}`).remove();
		},
		removeItems: function () {
			let listItems = document.querySelector(UISelectors.itemList);

			// turn Node list to Arr
			listItems = Array.from(listItems);

			listItems.forEach(function (item) {
				item.remove();
			});
		},
	};
})();

// app controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
	// Load event listeners
	const loadEventListeners = function () {
		// get ui selectors
		const UISlectors = UICtrl.getSelectors();

		// add item event
		document
			.querySelector(UISlectors.addBtn)
			.addEventListener('click', itemAddSubmit);

		// disable submit on enter
		document.addEventListener('keypress', function (e) {
			if (e.keyCode === 13 || e.which === 13) {
				e.preventDefault();
				if (UICtrl.getEditState()) {
					document.querySelector(UISlectors.updateBtn).click();
				} else {
					document.querySelector(UISlectors.addBtn).click();
				}
			}
		});

		// edit icon click
		document
			.querySelector(UISlectors.itemList)
			.addEventListener('click', itemEditClick);

		// item update submit
		document
			.querySelector(UISlectors.updateBtn)
			.addEventListener('click', itemUpdateSubmit);

		// back button edit state event
		document
			.querySelector(UISlectors.backBtn)
			.addEventListener('click', function (e) {
				UICtrl.clearEditState();
				e.preventDefault();
			});

		// delete item event
		document
			.querySelector(UISlectors.deleteBtn)
			.addEventListener('click', itemDeleteSubmit);

		// clear all event
		document
			.querySelector(UISlectors.clearBtn)
			.addEventListener('click', clearAllItemsClick);
	};

	// add item submit
	const itemAddSubmit = function (e) {
		// get form input from ui controller
		const input = UICtrl.getItemInput();

		// input validation
		if (input.name === '' || input.calories === '') {
			UICtrl.showAlert('Please enter a Meal name and calories');
		} else if (isNaN(input.calories)) {
			UICtrl.showAlert('Please enter a number in calories');
		} else if (input.calories <= 0) {
			UICtrl.showAlert('Calories must be greater than 0');
		} else {
			const newItem = ItemCtrl.addItem(input.name, input.calories);

			// add item to ui list
			UICtrl.addListItem(newItem);

			// get total calories
			const totalCalories = ItemCtrl.totalCalories();
			// add total calories to ui
			UICtrl.showTotalCalories(totalCalories);

			// Store in LS
			StorageCtrl.storeItem(newItem);

			// clear fields
			UICtrl.clearInput();
		}
		e.preventDefault();
	};

	// edit click
	const itemEditClick = function (e) {
		if (e.target.classList.contains('edit-item')) {
			// ge list item id
			const listId = parseInt(e.target.parentNode.parentNode.id.split('-')[1]);

			// get item
			const itemToEdit = ItemCtrl.getItemById(listId);

			// set current item
			ItemCtrl.setCurrentItem(itemToEdit);

			// add Item to form
			UICtrl.addItemToForm();
		}
		e.preventDefault();
	};

	// item update submit
	const itemUpdateSubmit = function (e) {
		// get item input
		const input = UICtrl.getItemInput();

		// input validation
		if (input.name === '' || input.calories === '') {
			UICtrl.showAlert('Please enter a Meal name and calories');
		} else if (isNaN(input.calories)) {
			UICtrl.showAlert('Please enter a number in calories');
		} else if (input.calories <= 0) {
			UICtrl.showAlert('Calories must be greater than 0');
		} else {
			// update item
			const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

			// update ui
			UICtrl.updateListItem(updatedItem);

			// get total calories
			const totalCalories = ItemCtrl.totalCalories();
			// add total calories to ui
			UICtrl.showTotalCalories(totalCalories);

			// update in LS
			StorageCtrl.updateItemStorage(updatedItem);

			UICtrl.clearEditState();
		}
		e.preventDefault();
	};

	const itemDeleteSubmit = function (e) {
		// get current item
		const currentItem = ItemCtrl.getCurrentItem();

		// delete from Data struct
		ItemCtrl.deleteItem(currentItem.id);

		// delete from ui
		UICtrl.deleteListItem(currentItem.id);

		// get total calories
		const totalCalories = ItemCtrl.totalCalories();
		// add total calories to ui
		UICtrl.showTotalCalories(totalCalories);

		// delete from LS
		StorageCtrl.deleteItemFromStorage(currentItem.id);

		UICtrl.clearEditState();

		if (ItemCtrl.getItems().length === 0) {
			UICtrl.hideList();
		}

		e.preventDefault();
	};

	const clearAllItemsClick = function () {
		// delete from DS
		ItemCtrl.clearAllItems();

		// remove from ui
		UICtrl.removeItems();

		// get total calories
		const totalCalories = ItemCtrl.totalCalories();
		// add total calories to ui
		UICtrl.showTotalCalories(totalCalories);

		// remove from LS
		StorageCtrl.clearItemsFromStorage();

		UICtrl.hideList();
	};

	return {
		init: function () {
			// clear edit state
			UICtrl.clearEditState();

			// get and set date
			const storedDate = ItemCtrl.getDate();
			const date = new Date();
			const dd = String(date.getDate()).padStart(2, '0');
			const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
			const yyyy = date.getFullYear();

			const today = dd + '/' + mm + '/' + yyyy;

			if (storedDate !== today) {
				clearAllItemsClick();
				ItemCtrl.setDate(today);
				StorageCtrl.storeDate(today);
			}

			UICtrl.showDate(today);

			// fetch fro data struct
			const items = ItemCtrl.getItems();

			// check if any items
			if (items.length) {
				// populate list with items
				UICtrl.populateItemList(items);
				// get total calories
				const totalCalories = ItemCtrl.totalCalories();
				// add total calories to ui
				UICtrl.showTotalCalories(totalCalories);
			} else {
				UICtrl.hideList();
			}
			// load event listeners
			loadEventListeners();
		},
	};
})(ItemCtrl, StorageCtrl, UICtrl);

// initialize app
App.init();
