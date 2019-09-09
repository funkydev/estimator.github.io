const UI = {
  lockInput: function () {
    document.querySelector('#usNumber').readonly = true;
    document.querySelector('#usNumber').disabled = true;
    document.querySelector('#submit').disabled = true;
  },
  unlockInput: function () {
    document.querySelector('#usNumber').readonly = false;
    document.querySelector('#usNumber').disabled = false;
    document.querySelector('#submit').disabled = false;
  },
  focusUSValueInput: function () {
    document.querySelector('#usNumber').focus();
  },
  getUSNumberValue: function () {
    return +document.querySelector('#usNumber').value
  },
  clearUSNumberValue: function () {
    return document.querySelector('#usNumber').value = '';
  },
  setInvalidUSNumberValue: function () {
    UI.unlockInput();
    document.querySelector('#usNumber').classList.add('is-invalid');
  },
  removeInvalidateInput: function () {
    document.querySelector('#usNumber').classList.remove('is-invalid');
  },
  showEstimatingLoader: function () {
    UI.setEstimatingPercentValue(0);
    document.querySelector('#estimating-box').style.display = 'block';
  },
  hideEstimatingLoader: function () {
    document.querySelector('#estimating-box').style.display = 'none';
  },
  setEstimatingPercentValue: function (value) {
    document.querySelector('#estimatingPercentValue').innerHTML = value.toString() + '%'
  },
  showEstimatedBox: function () {
    UI.setEstimatingPercentValue(0);
    document.querySelector('#estimation-box').style.display = 'block';
  },
  hideEstimatedBox: function () {
    document.querySelector('#estimation-box').style.display = 'none';
  },
  setEstimatedValue: function (value) {
    document.querySelector('#estimation').innerHTML = value.toString();
  },
  setRiskValue: function (value) {
    document.querySelector('#risk').innerHTML = value.toString();
  }
};
