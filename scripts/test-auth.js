const bcrypt = require('bcryptjs');

// This is the password you're trying to log in with
const plainPassword = 'your_actual_password';

// This is the hashed password from your database
// You can get this by running: db.users.findOne({email: 'user@example.com'})
const hashedPassword = 'your_hashed_password_from_db';

// Test the password comparison
bcrypt.compare(plainPassword, hashedPassword)
  .then(isMatch => {
    console.log('Password matches:', isMatch);
  })
  .catch(err => {
    console.error('Error comparing passwords:', err);
  });
