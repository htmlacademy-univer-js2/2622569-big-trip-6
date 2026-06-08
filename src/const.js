const TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

const CITIES = [
  'Amsterdam',
  'Geneva',
  'Chamonix',
  'Saint Petersburg',
  'Moscow'
];

const OFFERS = [
  {
    id: 1,
    title: 'Add luggage',
    price: 30
  },
  {
    id: 2,
    title: 'Switch to comfort',
    price: 100
  },
  {
    id: 3,
    title: 'Add meal',
    price: 15
  }
];

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

export {
  TYPES,
  CITIES,
  OFFERS,
  FilterType,
  SortType,
  UserAction,
  UpdateType
};
