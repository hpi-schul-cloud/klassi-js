'use strict';

const loginData = require('../shared-objects/loginData'),
  imageCompare = require('../runtime/imageCompare'),
  shared = ({loginData});

let log = global.log;
let image;

module.exports = {

    loginResult: async function() {
        expect(await helpers.getElementText(shared.loginData.elem.failedLoginNotification)).to.equal('Login fehlgeschlagen.');
    },
    compareScreenshots: async function(filename) {
      await imageCompare.saveScreenshot(`${filename}.png`);
      
      await helpers.compareImage(`${filename}.png`);
    
    }
    

  };