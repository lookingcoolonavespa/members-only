const Message = require('../models/Message');

function generateSampleMessages() {
  for (let i = 0; i <= 40; i++) {
    const msg = new Message({
      user: '6206fc785727d71d855de14d',
      date: new Date(),
      title: `sample message ${i}`,
      content: 'Lorem ipsum dolor sit amet.',
    });

    msg.save();
  }
}

generateSampleMessages();
