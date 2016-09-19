import expressify from 'expressify';

module.exports = function statusController(
) {
  return expressify({
    get
  });

  // ---

  function get(req, res) {
    res.json({ status: 'up' });
  }
};
