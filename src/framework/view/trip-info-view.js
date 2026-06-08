import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';

function createTripInfoTemplate(points) {
  if (!points.length) {
    return '';
  }

  const sortedPoints = [...points].sort(
    (a, b) => a.dateFrom - b.dateFrom
  );

  const cities = sortedPoints.map(
    (point) => point.destination?.name
  );

  let routeTitle = '';

  if (cities.length <= 3) {
    routeTitle = cities.join(' — ');
  } else {
    routeTitle =
      `${cities[0]} — ... — ${cities[cities.length - 1]}`;
  }

  const startDate = dayjs(
    sortedPoints[0].dateFrom
  ).format('MMM D');

  const endDate = dayjs(
    sortedPoints[sortedPoints.length - 1].dateTo
  ).format('MMM D');

  const totalCost = sortedPoints.reduce(
    (sum, point) => sum + point.basePrice,
    0
  );

  return `
    <section class="trip-main__trip-info trip-info">

      <div class="trip-info__main">
        <h1 class="trip-info__title">
          ${routeTitle}
        </h1>

        <p class="trip-info__dates">
          ${startDate}&nbsp;&mdash;&nbsp;${endDate}
        </p>
      </div>

      <p class="trip-info__cost">
        Total:
        &euro;&nbsp;
        <span class="trip-info__cost-value">
          ${totalCost}
        </span>
      </p>

    </section>
  `;
}

export default class TripInfoView extends AbstractView {
  #points = null;

  constructor(points) {
    super();
    this.#points = points;
  }

  get template() {
    return createTripInfoTemplate(
      this.#points
    );
  }
}
