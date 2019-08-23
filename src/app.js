const express = require('express');
const morgan = require('morgan');
const mustache_express = require('mustache-express');
const path = require('path');
const fs = require('fs');
const filesize = require('filesize');
const { exec } = require('child_process');

const port = process.env.PORT;
const static_files_path = process.env.STATIC_FILES;
const ps4_ip = process.env.PS4IP;
const local_ip = process.env.LOCALIP;

const app = express();

app.use(morgan('combined'));
app.use(express.urlencoded());

app.engine('html', mustache_express());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.get('/', function (req, res) {
  res.render('index', {"pkgs": get_pkgs()});
});
app.post('/install', function(req, res) {
  const filepath = req.body.filepath;

  const dirname = path.dirname(filepath);
  app.use(express.static(dirname));
  const filename = path.basename(filepath);
  ps4_install(filename, res);
});

app.listen(port, function () {
  console.log(`PS4 PKG sender listening on port ${port} serving files from ${static_files_path}`);
});

function get_dirs_with_pkgs() {
  const pkgs = get_pkgs();
  const dirs = {};
  for(var i = 0, l = pkgs.length; i < l; ++i){
    dirs[pkgs[i].dir] = true;
  }
  return Object.keys(dirs);
}

function get_pkgs() {
  const walkSync = function(dir, filelist) {
    const files = fs.readdirSync(dir);
    files.forEach(function(file) {
      filepath = dir + '/' + file;
      const stat = fs.statSync(filepath);
      if (stat.isDirectory()) {
        filelist = walkSync(filepath, filelist);
      } else if (path.extname(file).toLowerCase() === '.pkg') {
        filelist.push({
          filepath: filepath,
          dir: path.dirname(filepath),
          name: path.basename(filepath),
          size: filesize(stat.size)
        });
      }
    });
    return filelist;
  };
  return walkSync(static_files_path, []);
}

function ps4_install(filename, res) {
  const pkg_uri = `http://${local_ip}:${port}/${encodeURI(filename)}`;
  const ps4_api_uri = `http://${ps4_ip}:12800/api/install`;
  const curl_command = `curl -v "${ps4_api_uri}" --data '{"type":"direct","packages":["${pkg_uri}"]}'`;
  res.write(curl_command);
  console.log(curl_command);
  exec(curl_command, (err, stdout, stderr) => {
    if (err) {
      res.write(err);
      res.end();
      console.error(err);
      return;
    }
    res.write(`stdout: ${stdout}`);
    console.log(`stdout: ${stdout}`);
    res.write(`stderr: ${stderr}`);
    console.log(`stderr: ${stderr}`);
    res.end();
  });
}
