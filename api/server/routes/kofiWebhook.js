const express = require('express');
const router = express.Router();
const { User } = require('~/db/models'); // This path works since you're in /server/routes

const VERIFICATION_TOKEN = process.env.KOFI_VERIFICATION_TOKEN;

router.post('/webhook/kofi', async (req, res) => {
  const {
    verification_token,
    email,
    tier_name
  } = req.body;

  if (verification_token !== VERIFICATION_TOKEN) {
    return res.status(403).send('Invalid verification token');
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('User not found');
    }

    let newRole;

    switch (tier_name.toLowerCase()) {
      case 'lite':
        newRole = 'LITE';
        break;
      case 'student':
        newRole = 'STUDENT';
        break;
      case 'extreme':
        newRole = 'EXTREME';
        break;
      default:
        return res.status(400).send('Unknown tier');
    }

    user.role = newRole;
    await user.save();

    res.send('Role updated');
  } catch (error) {
    console.error('Error handling Ko-fi webhook:', error);
    res.status(500).send('Internal error');
  }
});

module.exports = router;