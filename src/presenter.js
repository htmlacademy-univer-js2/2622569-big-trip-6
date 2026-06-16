import FiltersView from './view/filters-view.js';
import SortView from './view/sort-view.js';
import PointListView from './view/point-list-view.js';
import EmptyPointsView from './view/empty-points-view.js';


import PointPresenter from './presenter/point-presenter.js';

import { render } from './framework/render.js';

import UiBlocker from './framework/ui-blocker/ui-blocker.js';

import {
  FilterType,
  SortType
} from './const.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

export default class Presenter {
  #container = null;
  #pointsModel = null;

  #pointListComponent = new PointListView();

  #filtersComponent = null;
  #sortComponent = null;
  #emptyPointsComponent = null;


  #currentFilter = FilterType.EVERYTHING;
  #currentSortType = SortType.DAY;

  #pointPresenters = new Map();

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

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

    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#filtersComponent, this.#container);
    render(this.#sortComponent, this.#container);
    render(this.#pointListComponent, this.#container);

    this.#renderPoints();
  }

  #getSortedPoints() {
    const points = this.#pointsModel
      .getPointsByFilter(this.#currentFilter);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...points].sort((pointA, pointB) => {
          const durationA =
            pointA.dateTo - pointA.dateFrom;

          const durationB =
            pointB.dateTo - pointB.dateFrom;

          return durationB - durationA;
        });

      case SortType.PRICE:
        return [...points].sort(
          (pointA, pointB) =>
            pointB.basePrice - pointA.basePrice
        );

      default:
        return [...points].sort(
          (pointA, pointB) =>
            pointA.dateFrom - pointB.dateFrom
        );
    }
  }

  #handleFilterChange = (filterType) => {
    this.#currentFilter = filterType;

    this.#clearPointsList();
    this.#renderPoints();
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearPointsList();
    this.#renderPoints();
  };

  #handlePointChange = async (updatedPoint) => {
    const pointPresenter =
      this.#pointPresenters.get(updatedPoint.id);

    this.#uiBlocker.block();

    if (pointPresenter) {
      pointPresenter.setSaving();
    }

    try {
      const response =
        await this.#pointsModel.updatePoint(updatedPoint);

      if (pointPresenter) {
        pointPresenter.init(response);
      }
    } catch {
      if (pointPresenter) {
        pointPresenter.setAborting();
      }
    }

    this.#uiBlocker.unblock();
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach(
      (presenter) => presenter.resetView()
    );
  };

  #clearPointsList() {
    this.#pointListComponent.element.innerHTML = '';
    this.#pointPresenters.clear();
  }

  #renderPoints() {
    const points = this.#getSortedPoints();

    if (points.length === 0) {
      this.#renderEmptyPoints();
      return;
    }

    points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderEmptyPoints() {
    this.#emptyPointsComponent =
      new EmptyPointsView(this.#currentFilter);

    render(
      this.#emptyPointsComponent,
      this.#pointListComponent.element
    );
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer:
        this.#pointListComponent.element,

      onDataChange: this.#handlePointChange,

      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);

    this.#pointPresenters.set(
      point.id,
      pointPresenter
    );
  }


}
