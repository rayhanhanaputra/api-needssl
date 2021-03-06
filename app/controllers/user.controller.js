const db = require("../models");
const { spawn } = require('node:child_process');
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
          const ls = spawn('sh', ['/home/api-needssl/assets/generate.sh', req.body.domain, req.body.c, req.body.st, req.body.l, req.body.o, req.body.ou, req.body.domain]);

          ls.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
          });

          ls.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
          });

          ls.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
          });
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

exports.downloadCRL = (req,res) =>{
  const file = `/home/api-needssl/assets/crl.txt`;
  res.download(file); // Set disposition and send it.
}