function MemoryCacheRepository() {
  this._storage = new Map();

  this.getCache = function (usNumber) {
    const cache = this._storage.get(usNumber);

    if (!cache) {
      return null;
    }

    const estimatedHours = +cache.estimatedHoursValue;
    const estimatedRisk = +cache.estimatedRiskValue;

    return {estimatedHours, estimatedRisk}
  };

  this.setCache = function (usNumber, hours, risk) {
    this._storage.set(usNumber, {estimatedHoursValue: hours, estimatedRiskValue: risk});
  };

  this.clearCache = function (usNumber) {
    this._storage.delete(usNumber);
  };
}

function LocalStorageCacheRepository() {
  this.getCache = function (usNumber) {
    const cache = localStorage.getItem(usNumber);

    if (!cache) {
      return null;
    }

    try {
      const {estimatedHoursValue, estimatedRiskValue} = JSON.parse(cache);
      const estimatedHours = +estimatedHoursValue;
      const estimatedRisk = +estimatedRiskValue;

      return {estimatedHours, estimatedRisk}
    } catch {
      return null;
    }
  };

  this.setCache = function (usNumber, hours, risk) {
    localStorage.setItem(usNumber, JSON.stringify({estimatedHoursValue: +hours, estimatedRiskValue: +risk}))
  };

  this.clearCache = function (usNumber) {
    localStorage.removeItem(usNumber);
  };
}
