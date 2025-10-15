class ChangeTheme {
  selectors = {
    body: document.querySelector("body"),
    lightThemeButton: document.querySelector("[data-js-light-theme-button]"),
    darkThemeButton: document.querySelector("[data-js-dark-theme-button]"),
  };

  constructor() {
    this.bindEvents();
    this.loadTheme();
  }

  darkThemeInit = () => {
    this.selectors.body.classList.add("dark-theme");
    localStorage.setItem("theme", "dark");
  };

  lightThemeInit = () => {
    this.selectors.body.classList.remove("dark-theme");
    localStorage.setItem("theme", "light");
  };

  loadTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (!savedTheme) return;

    if (savedTheme === "dark") {
      this.darkThemeInit();
    } else {
      this.lightThemeInit();
    }
  }

  bindEvents() {
    this.selectors.darkThemeButton.addEventListener(
      "click",
      this.darkThemeInit
    );
    this.selectors.lightThemeButton.addEventListener(
      "click",
      this.lightThemeInit
    );
  }
}

class Todo {
  selectors = {
    root: "[data-js-todo]",
    newTaskForm: "[data-js-todo-new-task-form]",
    newTaskInput: "[data-js-todo-new-task-input]",
    searchTaskForm: "[data-js-todo-search-task-form]",
    searchTaskInput: "[data-js-todo-search-task-input]",
    totalTasks: "[data-js-todo-total-tasks]",
    deleteAllButton: "[data-js-todo-delete-all-button]",
    list: "[data-js-todo-list]",
    item: "[data-js-todo-item]",
    itemCheckbox: "[data-js-todo-item-checkbox]",
    itemLabel: "[data-js-todo-item-label]",
    itemDeleteButton: "[data-js-todo-item-delete-button]",
    emptyMessage: "[data-js-todo-empty-message]",
  };

  stateClasses = {
    isVisible: "is-visible",
    isDisappearing: "is-disappearing",
  };

  localStorageKey = "todo-items";

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);
    this.newTaskFormElement = this.rootElement.querySelector(
      this.selectors.newTaskForm
    );
    this.newTaskInputElement = this.rootElement.querySelector(
      this.selectors.newTaskInput
    );
    this.searchTaskFormElement = this.rootElement.querySelector(
      this.selectors.searchTaskForm
    );
    this.searchTaskInputElement = this.rootElement.querySelector(
      this.selectors.searchTaskInput
    );
    this.totalTasksElement = this.rootElement.querySelector(
      this.selectors.totalTasks
    );
    this.deleteAllButtonElement = this.rootElement.querySelector(
      this.selectors.deleteAllButton
    );
    this.listElement = this.rootElement.querySelector(this.selectors.list);
    this.emptyMessage = this.rootElement.querySelector(
      this.selectors.emptyMessage
    );
    this.state = {
      items: this.getItemsFromLocalStorage(),
      filteredItems: null,
      searchQuery: "",
    };

    this.render();
    this.bindEvents();
  }

  getItemsFromLocalStorage() {
    const data = localStorage.getItem(this.localStorageKey);

    if (!data) return [];

    try {
      const parsedData = JSON.parse(data);
      return Array.isArray(parsedData) ? parsedData : [];
    } catch (error) {
      console.error("Todo items parse error", error);
      return [];
    }
  }

  saveItemsToLocalStorage() {
    try {
      localStorage.setItem(
        this.localStorageKey,
        JSON.stringify(this.state.items)
      );
    } catch (error) {
      console.error("Todo items save error", error);
    }
  }

  render() {
    this.totalTasksElement.textContent = this.state.items.length;

    this.deleteAllButtonElement.classList.toggle(
      this.stateClasses.isVisible,
      this.state.items.length > 0
    );

    const items = this.state.filteredItems ?? this.state.items;

    this.listElement.innerHTML = items
      .map(
        ({ id, title, isChecked }) =>
          `<li class="todo__item todo-item" data-js-todo-item>
          <input
            class="todo-item__checkbox"
            type="checkbox"
            ${isChecked ? "checked" : ""}
            id="${id}"
            data-js-todo-item-checkbox
          />
          <label
            for="${id}"
            class="todo-item__label"
            data-js-todo-item-label
          >
            ${title}
          </label>
          <button
            class="todo-item__delete-button"
            aria-label="Delete"
            title="Delete Task"
            data-js-todo-item-delete-button
          >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="#757575"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          </button>
        </li>`
      )
      .join("");

    if (this.state.items.length === 0) {
      this.emptyMessage.textContent = "There are no tasks yet";
    } else if (this.state.filteredItems?.length === 0) {
      this.emptyMessage.textContent = "Tasks not found";
    } else {
      this.emptyMessage.textContent = "";
    }
  }

  addTask(title) {
    this.state.items.push({
      id: Date.now().toString(),
      title,
      isChecked: false,
    });
    this.saveItemsToLocalStorage();
    this.render();
  }

  deleteTask(id) {
    this.state.items = this.state.items.filter((item) => item.id !== id);
    this.saveItemsToLocalStorage();
    this.render();
  }

  toggleCheckedState(id) {
    this.state.items = this.state.items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          isChecked: !item.isChecked,
        };
      }

      return item;
    });
    this.saveItemsToLocalStorage();
    this.render();
  }

  filter() {
    const queryFormatted = this.state.searchQuery.toLowerCase();

    this.state.filteredItems = this.state.items.filter(({ title }) => {
      const titleFormatted = title.toLowerCase();

      return titleFormatted.includes(queryFormatted);
    });

    this.render();
  }

  filterReset() {
    this.state.filteredItems = null;
    this.state.searchQuery = "";
    this.render();
  }

  onNewTaskFormSubmit = (event) => {
    event.preventDefault();

    const newTodoItemTitle = this.newTaskInputElement.value;

    if (newTodoItemTitle.trim().length > 0) {
      this.addTask(newTodoItemTitle);
      this.filterReset();
      this.newTaskInputElement.value = "";
      this.newTaskInputElement.focus();
    }
  };

  onSearchTaskFormSubmit = (event) => {
    event.preventDefault();
  };

  onSearchTaskInputChange = ({ target }) => {
    const value = target.value.trim();

    if (value.length > 0) {
      this.state.searchQuery = value;
      this.filter();
    } else {
      this.filterReset();
    }
  };

  onDeleteAllButtonClick = () => {
    const deleteAll = confirm("Are you sure that you want delete all tasks?");

    if (deleteAll) {
      this.state.items = [];
      this.saveItemsToLocalStorage();
      this.render();
    }
  };

  onClick = ({ target }) => {
    if (target.matches(this.selectors.itemDeleteButton)) {
      const itemElement = target.closest(this.selectors.item);

      if (!itemElement) return;

      const itemCheckboxElement = itemElement.querySelector(
        this.selectors.itemCheckbox
      );

      if (!itemCheckboxElement) return;

      itemElement.classList.add(this.stateClasses.isDisappearing);

      setTimeout(() => {
        this.deleteTask(itemCheckboxElement.id);
      }, 400);
    }
  };

  onChange = ({ target }) => {
    if (target.matches(this.selectors.itemCheckbox)) {
      this.toggleCheckedState(target.id);
    }
  };

  bindEvents() {
    this.newTaskFormElement.addEventListener(
      "submit",
      this.onNewTaskFormSubmit
    );
    this.searchTaskFormElement.addEventListener(
      "submit",
      this.onSearchTaskFormSubmit
    );
    this.searchTaskInputElement.addEventListener(
      "input",
      this.onSearchTaskInputChange
    );
    this.deleteAllButtonElement.addEventListener(
      "click",
      this.onDeleteAllButtonClick
    );
    this.listElement.addEventListener("click", this.onClick);
    this.listElement.addEventListener("change", this.onChange);
  }
}

new ChangeTheme();
new Todo();
