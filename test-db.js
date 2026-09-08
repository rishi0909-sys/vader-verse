const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/vaderverse').then(async () => {
  const t = await mongoose.connection.collection('tournaments').find().toArray();
  console.log("Tournaments count:", t.length);
  for (let i=0; i<Math.min(3, t.length); i++) {
    console.log(`Tournament ${i}:`, t[i].title, t[i].game);
  }
  process.exit(0);
});
