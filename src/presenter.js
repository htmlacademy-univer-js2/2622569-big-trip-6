import FiltersView from './view/filters-view.js';
import SortView from './view/sort-view.js';
import PointListView from './view/point-list-view.js';
import PointView from './view/point-view.js';
import EditFormView from './view/edit-form-view.js';
import EmptyPointsView from './view/empty-points-view.js';
import { render } from './framework/render.js';
import { FilterType } from './const.js';

export default class Presenter {
  #container = null;
  #pointsModel = null;
  #pointListComponent = null;
  #filtersComponent = null;
  #sortComponent = null;
  #emptyPointsComponent = null;
  #currentFilter = FilterType.EVERYTHING;

  constructor(container, pointsModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#container.innerHTML = '';

    this.#filtersComponent = new FiltersView({
      currentFilter: this.#currentFilter,
      onFilterChange: this.#handleFilterChange
    });
    this.#sortComponent = new SortView();
    this.#pointListComponent = new PointListView();

    render(this.#filtersComponent, this.#container);
    render(this.#sortComponent, this.#container);
    render(this.#pointListComponent, this.#container);

    this.#renderPoints();
  }

  #handleFilterChange = (filterType) => {
    this.#currentFilter = filterType;
    this.#clearPointsList();
    this.#renderPoints();
  };

  #clearPointsList() {
    this.#pointListComponent.element.innerHTML = '';
  }

  #renderPoints() {
    const points = this.#pointsModel.getPointsByFilter(this.#currentFilter);
    const pointsCount = points.length;

    if (pointsCount === 0) {
      this.#renderEmptyPoints();
      return;
    }

    for (const point of points) {
      this.#renderPoint(point);
    }
  }

  #renderEmptyPoints() {
    this.#emptyPointsComponent = new EmptyPointsView(this.#currentFilter);
    render(this.#emptyPointsComponent, this.#pointListComponent.element);
  }

  #renderPoint(point) {
    const pointComponent = new PointView({
      point: point,
      onEditClick: () => this.#replacePointToEditForm(point)
    });

    render(pointComponent, this.#pointListComponent.element);
  }

  #replacePointToEditForm(point) {
    const currentItem = this.#pointListComponent.element.querySelector('.trip-events__item');

    const editFormComponent = new EditFormView({
      point: point,
      onFormSubmit: () => this.#replaceEditFormToPoint(point),
      onCancelClick: () => this.#replaceEditFormToPoint(point)
    });

    this.#pointListComponent.element.replaceChild(editFormComponent.element, currentItem);
  }

  #replaceEditFormToPoint(point) {
    const currentItem = this.#pointListComponent.element.querySelector('.trip-events__item');

    const pointComponent = new PointView({
      point: point,
      onEditClick: () => this.#replacePointToEditForm(point)
    });

    this.#pointListComponent.element.replaceChild(pointComponent.element, currentItem);
  }
}
