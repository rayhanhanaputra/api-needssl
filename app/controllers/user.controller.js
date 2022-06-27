const db = require("../models");
const Ssl = db.ssl;

// exports.allAccess = (req, res) => {
//   res.status(200).send("Public Content.");
// };
// exports.userBoard = (req, res) => {
//   res.status(200).send("User Content.");
// };
// exports.adminBoard = (req, res) => {
//   res.status(200).send("Admin Content.");
// };

exports.createSSL = (req, res) => {
  Ssl.findOne({
    where: {
      domain: req.body.domain
    }
  })
    .then(ssl => {
      if (!ssl) {
        Ssl.create({
          domain: req.body.domain,
          userId: req.userId
        }).then(user => {
          res.send({ message: "Domain was registered successfully!" });
        })
          .catch(err => {
            res.status(500).send({ message: err.message });
          });
      } else {
        return res.status(404).send({ message: "Domain has already registered." });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.getMySSL = (req, res) => {
  Ssl.findAll({
    where: {
      userId: req.body.userId
    }
  })
    .then(ssl => {
      if (!ssl) {
        return res.status(404).send({ message: "This person has no domain registered." });
      } else {
        res.send(ssl);
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.revokeSSL = (req, res) => {
  Ssl.findOne({
    where: {
      domain: req.body.domain
    }
  })
    .then(ssl => {
      if (ssl) {
        Ssl.destroy({
          where: {
            domain: req.body.domain
          }
        })
          .then(ssl => {
            res.send({ message: "Domain has been deleted" });
          })
          .catch(err => {
            res.status(500).send({ message: err.message });
          });
      } else {
        return res.status(404).send({ message: "Domain is not registered." });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};