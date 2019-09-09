function ElapsedTimer(totalTime) {
  this.totalTime = totalTime;
  this.elapsedTime = 0;

  this.addElapsedTime = function (interval) {
    this.elapsedTime += interval;
  };

  this.getElapsedPercents = function () {
    return Math.ceil(this.elapsedTime / this.totalTime * 1000) / 10
  };
}
