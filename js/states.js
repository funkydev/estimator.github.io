function Application(UI) {
  this.ui = UI;
  this.currentState = null;
  this.cacheRepository = typeof localStorage === 'undefined'
    ? new MemoryCacheRepository()
    : new LocalStorageCacheRepository();

  this.goToState = function (StateClass) {
    if (this.currentState && typeof this.currentState.exit === 'function') {
      this.currentState.exit();
    }

    this.currentState = new StateClass(this, this.ui);

    if (typeof this.currentState.enter === 'function') {
      this.currentState.enter();
    }
  };

  this.getElapsedTimerInstance = function (time) {
    return new ElapsedTimer(time);
  };

}

Application.State = {};

Application.State.Initialize = function (stateManager) {
  this.app = stateManager;
  this.enter = function () {
    this.app.ui.clearUSNumberValue();
    this.app.ui.unlockInput();
    this.app.ui.removeInvalidateInput();
    this.app.ui.hideEstimatingLoader();
    this.app.ui.hideEstimatedBox();
    this.app.ui.focusUSValueInput();
  }
};

Application.State.Submit = function (stateManager) {
  this.app = stateManager;
  this.enter = function () {
    const usNumber = this.app.ui.getUSNumberValue();

    if (!usNumber || usNumber < 30000) {
      return this.app.goToState(Application.State.ValidationError);
    }

    this.app.ui.removeInvalidateInput();
    this.app.ui.lockInput();
    this.app.goToState(Application.State.Estimating)
  }
};

Application.State.ValidationError = function (stateManager) {
  this.app = stateManager;
  this.enter = function () {
    this.app.ui.setInvalidUSNumberValue();
  }
};

Application.State.Estimating = function (stateManager) {
  this.app = stateManager;
  this.enter = function () {
    const timeout = Math.floor(Math.random() * 3000) + 1000;

    this.app.ui.showEstimatingLoader();
    this.app.ui.hideEstimatedBox();

    this.setEstimatingTimer(timeout);
  };

  this.setEstimatingTimer = function (time) {
    const stateManager = this.app;
    const calculatingTimer = stateManager.getElapsedTimerInstance(time);

    const interval = setInterval(function interval() {
      calculatingTimer.addElapsedTime(200);
      stateManager.ui.setEstimatingPercentValue(calculatingTimer.getElapsedPercents())
    }, 200);

    setTimeout(function () {
      window.clearInterval(interval);
      stateManager.goToState(Application.State.Estimated);
    }, time)
  }
};

Application.State.Estimated = function (stateManager) {
  this.app = stateManager;
  this.enter = function () {
    const usNumber = this.app.ui.getUSNumberValue();
    const estimationCache = this.app.cacheRepository.getCache(usNumber);
    let estimatedHours;
    let estimatedRisk;

    if (estimationCache) {
      estimatedHours = estimationCache.estimatedHours;
      estimatedRisk = estimationCache.estimatedRisk;
    } else {
      estimatedHours = this.getHoursEstimation();
      estimatedRisk = this.getRiskEstimation();

      this.app.cacheRepository.setCache(usNumber, estimatedHours, estimatedRisk);
    }

    this.app.ui.hideEstimatingLoader();
    this.app.ui.setEstimatedValue(estimatedHours);
    this.app.ui.setRiskValue(estimatedRisk);
    this.app.ui.showEstimatedBox();
    this.app.ui.unlockInput();
  };
  this.getHoursEstimation = function () {
    const possibleHours = [
      4, 4, 4, 4, 4, 4,
      8, 8, 8, 8, 8,
      16, 16,
      32,
      64
    ];

    const index = Math.floor(Math.random() * possibleHours.length);
    return possibleHours[index];
  };

  this.getRiskEstimation = function () {
    return Math.floor(Math.random() * 9) * 10;
  }
};

Application.State.ReEstimate = function (stateManager) {
  this.app = stateManager;
  this.enter = function () {
    const usNumber = this.app.ui.getUSNumberValue();

    this.app.cacheRepository.clearCache(usNumber);
    this.app.goToState(Application.State.Estimating)
  };
};
