const Nofitied = require('../model/notified');

exports.postNotified = async (req, res) => {
  try {
    const type = await req.query.type;
    await Nofitied.deleteMany({type: type});
    const nofitied = new Nofitied({
      type: type,
      email: req.body.email,
      time: req.body.time,
    });
    await nofitied.save();
    return res.json(nofitied);
  } catch (error) {
    console.log(error);
  }
};

exports.getNotified = async (req, res) => {
  try {
    const type = await req.query.type;
    const nofitied = await Nofitied.findOne({type: type});
    return res.json(nofitied);
  } catch (error) {}
};
