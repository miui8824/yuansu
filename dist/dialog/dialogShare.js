function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var queue = [];

var Dialog = function Dialog(options) {
  return new Promise(function (resolve, reject) {
    var pages = getCurrentPages();
    var ctx = pages[pages.length - 1];
    var dialog = ctx.selectComponent(options.selector);
    delete options.selector;

    if (dialog) {
      dialog.setData(_extends({
        onCancel: reject,
        onConfirm: resolve
      }, options));
      queue.push(dialog);
    }
  });
};

Dialog.defaultOptions = {
  show: true,
  title: '',
  message: '',
  zIndex: 100,
  overlay: true,
  asyncClose: false,
  selector: '#van-dialog-share',
  confirmButtonText: '去分享',
  cancelButtonText: '取消',
  showConfirmButton: true,
  showCancelButton: false,
  closeOnClickOverlay: false,
  confirmButtonOpenType: ''
};

Dialog.alert = function (options) {
  return Dialog(_extends({}, Dialog.currentOptions, options));
};

Dialog.confirm = function (options) {
  return Dialog(_extends({}, Dialog.currentOptions, {
    showCancelButton: true
  }, options));
};

Dialog.close = function () {
  queue.forEach(function (dialog) {
    dialog.close();
  });
  queue = [];
};

Dialog.stopLoading = function () {
  queue.forEach(function (dialog) {
    dialog.stopLoading();
  });
};

Dialog.setDefaultOptions = function (options) {
  Object.assign(Dialog.currentOptions, options);
};

Dialog.resetDefaultOptions = function () {
  Dialog.currentOptions = _extends({}, Dialog.defaultOptions);
};

Dialog.resetDefaultOptions();
export default Dialog;