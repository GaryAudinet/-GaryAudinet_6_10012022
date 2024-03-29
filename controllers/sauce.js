// Import des packages requis, et le model Sauce

const Sauce = require('../models/sauce');
const fs = require('fs');

// Exports des logiques pour chaques requetes POST, GET, PUT, et DELETE

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Create sauce.' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.readSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.updateSauce = (req, res, next) => {
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        const fileName = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${fileName}`, () => {
          const sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${
              req.file.filename
            }`,
          };
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() =>
              res.status(200).json({ message: 'Update sauce.' })
            )
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    const sauceObject = { ...req.body };
    Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    )
      .then(() =>
        res.status(200).json({ message: 'Update sauce.' })
      )
      .catch((error) => res.status(400).json({ error }));
  }
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() =>
            res.status(200).json({ message: 'Delete sauce.' })
          )
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.readAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// Exports des logiques pour les fonctions "like" et "dislike"

exports.likeDislike = (req, res, next) => {
    const like = req.body.like;
    switch (like) {
      case 1:
        Sauce.updateOne(
          { _id: req.params.id },
          { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } }
        )
          .then(() =>
            res.status(200).json({ message: 'Like add.' })
          )
          .catch((error) => res.status(400).json({ error }));
        break;
      case 0:
        Sauce.findOne({ _id: req.params.id })
          .then((sauce) => {
            if (sauce.usersLiked.includes(req.body.userId)) {
              Sauce.updateOne(
                { _id: req.params.id },
                { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
              )
                .then(() =>
                  res.status(200).json({ message: 'Like delete.' })
                )
                .catch((error) => res.status(400).json({ error }));
            }
            if (sauce.usersDisliked.includes(req.body.userId)) {
              Sauce.updateOne(
                { _id: req.params.id },
                {
                  $pull: { usersDisliked: req.body.userId },
                  $inc: { dislikes: -1 },
                }
              )
                .then(() =>
                  res
                    .status(200)
                    .json({ message: 'Dislike delete.' })
                )
                .catch((error) => res.status(400).json({ error }));
            }
          })
          .catch((error) => res.status(404).json({ error }));
        break;
      case -1:
        Sauce.updateOne(
          { _id: req.params.id },
          { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } }
        )
          .then(() => {
            res.status(200).json({ message: 'Dislike add.' });
          })
          .catch((error) => res.status(400).json({ error }));
        break;
    }
  };