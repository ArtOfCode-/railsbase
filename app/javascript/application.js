const { onLoad } = require('./util');

onLoad(() => {
  $('[data-toggle=tooltip]').tooltip();

  $('.select2').select2({
    theme: 'bootstrap',
    allowClear: true
  });
});
