import PointsApiService from '../api-service.js';
import { FilterType } from '../const.js';

export default class PointsModel {
  #pointsApiService = null;
  #points = [];

  constructor() {
    this.#pointsApiService = new PointsApiService(
      'https://21.objects.pages.academy/big-trip',
      'Basic a1b2c3d4e5f6'
    );
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;

      this.#points = points.map((point) => ({
        ...point,
        basePrice: point.base_price,
        dateFrom: new Date(point.date_from),
        dateTo: new Date(point.date_to),
        isFavorite: point.is_favorite
      }));
    } catch (err) {
      this.#points = [];
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

  updatePoint(updatedPoint) {
    this.#points = this.#points.map(
      (point) =>
        point.id === updatedPoint.id
          ? updatedPoint
          : point
    );
  }
}
