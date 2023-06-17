const Link = require("../model/link");

exports.postLink = async (req, res) => {
  try {
    const link = await new Link(req.body).save();
    res.send(link);
  } catch (error) {
    res.send(error);
  }
};

exports.getLink = async (req, res) => {
  try {
    const links = await Link.find();
    res.send(links);
  } catch (error) {
    res.send(error);
  }
};

exports.deleteLink = async (req, res) => {
  try {
    const link = await Link.findByIdAndDelete(req.params.id);
  } catch (error) {}
};
