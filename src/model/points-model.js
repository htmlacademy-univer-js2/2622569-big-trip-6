import Observable from '../framework/observable.js';
import PointsApiService from '../api-service.js';
import {
  FilterType,
  UpdateType
} from '../const.js';

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];

  constructor() {
    super();

    this.#pointsApiService = new PointsApiService(
      'https://21.objects.pages.academy/big-trip',
      'Basic a1b2c3d4e5f6'
    );
  }

  async init() {
    console.log('INIT START');
    try {
      const points = await this.#pointsApiService.points;

      console.log('POINTS:', points);
      console.log('FIRST POINT:', points[0]);

      this.#points = points.map((point) => ({
        ...point,
        basePrice: point.base_price,
        dateFrom: new Date(point.date_from),
        dateTo: new Date(point.date_to),
        isFavorite: point.is_favorite
      }));

      this._notify(UpdateType.INIT);
    } catch (err) {
      console.error('API ERROR:', err);

      this.#points = [];
      this._notify(UpdateType.INIT);
}
  }

  getPoints() {
    return this.#points;
  }

  getPointsCount() {
    return this.#points.length;
  }

  getPointsByFilter(filterType) {
    const now = new Date();

    switch (filterType) {
      case FilterType.FUTURE:
        return this.#points.filter(
          (point) => point.dateFrom > now
        );

      case FilterType.PAST:
        return this.#points.filter(
          (point) => point.dateTo < now
        );

      case FilterType.PRESENT:
        return this.#points.filter(
          (point) =>
            point.dateFrom <= now &&
            point.dateTo >= now
        );

      default:
        return this.#points;
    }
  }

  async updatePoint(updatedPoint) {
    const response =
      await this.#pointsApiService.updatePoint(updatedPoint);

    this.#points = this.#points.map(
      (point) =>
        point.id === response.id
          ? response
          : point
    );

    this._notify(UpdateType.PATCH, response);

    return response;
  }

  async addPoint(point) {
    const response =
      await this.#pointsApiService.addPoint(point);

    this.#points.push(response);

    this._notify(UpdateType.MINOR, response);

    return response;
  }

  async deletePoint(point) {
    await this.#pointsApiService.deletePoint(point);

    this.#points = this.#points.filter(
      (item) => item.id !== point.id
    );

    this._notify(UpdateType.MINOR);
  }
}
